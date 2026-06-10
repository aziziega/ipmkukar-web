/**
 * Activity Logger Utility
 * Centralized logging for admin activities
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { ActivityAction, EntityType, LogActivityParams } from '@/types/activity-log'

/**
 * Extract IP address from Next.js request
 * Handles various proxy headers
 */
export function extractIpAddress(request: NextRequest): string | null {
  try {
    // Check common proxy headers first
    const forwardedFor = request.headers.get('x-forwarded-for')
    if (forwardedFor) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return forwardedFor.split(',')[0].trim()
    }

    const realIp = request.headers.get('x-real-ip')
    if (realIp) {
      return realIp
    }

    // Fallback to connection remote address (may not be available in all environments)
    const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
    if (cfConnectingIp) {
      return cfConnectingIp
    }

    // In development, might be localhost
    return null
  } catch (error) {
    console.error('Error extracting IP address:', error)
    return null
  }
}

/**
 * Log an activity to the database
 * This function is non-blocking - if it fails, it won't throw an error
 * 
 * @param supabase - Supabase client instance (should use service_role_key)
 * @param params - Activity log parameters
 * @returns Promise<boolean> - true if logged successfully, false otherwise
 */
export async function logActivity(
  supabase: SupabaseClient,
  params: LogActivityParams
): Promise<boolean> {
  try {
    const {
      user_id,
      action,
      entity_type = null,
      entity_id = null,
      details = null,
      ip_address = null,
    } = params

    // Validate required fields
    if (!user_id || !action) {
      console.error('Activity log missing required fields:', { user_id, action })
      return false
    }

    // Insert into activity_logs table
    const { error } = await supabase.from('activity_logs').insert({
      user_id,
      action,
      entity_type,
      entity_id,
      details,
      ip_address,
    })

    if (error) {
      console.error('Failed to log activity:', error)
      return false
    }

    return true
  } catch (error) {
    // Non-blocking: log error but don't throw
    console.error('Exception in logActivity:', error)
    return false
  }
}

/**
 * Log activity with automatic IP extraction from request
 * Convenience wrapper around logActivity
 * 
 * @param supabase - Supabase client instance
 * @param request - Next.js request object
 * @param params - Activity log parameters (without ip_address)
 * @returns Promise<boolean> - true if logged successfully
 */
export async function logActivityFromRequest(
  supabase: SupabaseClient,
  request: NextRequest,
  params: Omit<LogActivityParams, 'ip_address'>
): Promise<boolean> {
  const ip_address = extractIpAddress(request)
  
  return logActivity(supabase, {
    ...params,
    ip_address,
  })
}

/**
 * Helper function to create activity details object
 * Useful for structured logging
 */
export function createActivityDetails(data: Record<string, any>): Record<string, any> {
  // Remove sensitive fields if any
  const sanitized = { ...data }
  
  // Remove password-related fields
  delete sanitized.password
  delete sanitized.password_hash
  delete sanitized.old_password
  delete sanitized.new_password
  
  return sanitized
}

/**
 * Log user creation activity
 */
export async function logUserCreated(
  supabase: SupabaseClient,
  actorUserId: string,
  newUserId: string,
  email: string,
  name: string,
  role: string,
  ipAddress?: string
): Promise<boolean> {
  return logActivity(supabase, {
    user_id: actorUserId,
    action: ActivityAction.CREATE,
    entity_type: EntityType.USER,
    entity_id: newUserId,
    details: {
      email,
      name,
      role,
    },
    ip_address: ipAddress,
  })
}

/**
 * Log user update activity
 */
export async function logUserUpdated(
  supabase: SupabaseClient,
  actorUserId: string,
  targetUserId: string,
  changes: Record<string, any>,
  ipAddress?: string
): Promise<boolean> {
  return logActivity(supabase, {
    user_id: actorUserId,
    action: ActivityAction.UPDATE,
    entity_type: EntityType.USER,
    entity_id: targetUserId,
    details: createActivityDetails(changes),
    ip_address: ipAddress,
  })
}

/**
 * Log user deletion activity
 */
export async function logUserDeleted(
  supabase: SupabaseClient,
  actorUserId: string,
  deletedUserId: string,
  deletedUserEmail: string,
  ipAddress?: string
): Promise<boolean> {
  return logActivity(supabase, {
    user_id: actorUserId,
    action: ActivityAction.DELETE,
    entity_type: EntityType.USER,
    entity_id: deletedUserId,
    details: {
      email: deletedUserEmail,
    },
    ip_address: ipAddress,
  })
}

/**
 * Log login activity
 */
export async function logLogin(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  ipAddress?: string
): Promise<boolean> {
  return logActivity(supabase, {
    user_id: userId,
    action: ActivityAction.LOGIN,
    entity_type: EntityType.SESSION,
    details: {
      email,
    },
    ip_address: ipAddress,
  })
}

/**
 * Log logout activity
 */
export async function logLogout(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  ipAddress?: string
): Promise<boolean> {
  return logActivity(supabase, {
    user_id: userId,
    action: ActivityAction.LOGOUT,
    entity_type: EntityType.SESSION,
    details: {
      email,
    },
    ip_address: ipAddress,
  })
}

/**
 * Log failed login attempt
 */
export async function logLoginFailed(
  supabase: SupabaseClient,
  email: string,
  reason: string,
  ipAddress?: string
): Promise<boolean> {
  return logActivity(supabase, {
    user_id: 'system', // Use a system identifier for failed logins
    action: ActivityAction.LOGIN_FAILED,
    entity_type: EntityType.SESSION,
    details: {
      email,
      reason,
    },
    ip_address: ipAddress,
  })
}
