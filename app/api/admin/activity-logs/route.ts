import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  ActivityLog,
  ActivityLogFilters,
  ActivityLogsResponse,
  ActivityAction,
  EntityType,
} from '@/types/activity-log'

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

/**
 * GET /api/admin/activity-logs
 * Super admin only - Fetch activity logs with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and check super_admin role
    const authResult = await requireAuth(request)
    if (!authResult.authorized || authResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can view activity logs' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const filters: ActivityLogFilters = {
      user_id: searchParams.get('user_id') || undefined,
      action: searchParams.get('action') as ActivityAction | undefined,
      entity_type: searchParams.get('entity_type') as EntityType | undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    }

    // Validate pagination parameters
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(100, Math.max(1, filters.limit || 50)) // Max 100 per page
    const offset = (page - 1) * limit

    // Build base query with join to users table for user info
    let query = supabase
      .from('activity_logs')
      .select(
        `
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        created_at,
        users:user_id (
          name,
          email
        )
      `,
        { count: 'exact' }
      )

    // Apply filters
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }

    if (filters.action) {
      query = query.eq('action', filters.action)
    }

    if (filters.entity_type) {
      query = query.eq('entity_type', filters.entity_type)
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }

    if (filters.date_to) {
      // Add one day to include the entire end date
      const endDate = new Date(filters.date_to)
      endDate.setDate(endDate.getDate() + 1)
      query = query.lt('created_at', endDate.toISOString())
    }

    if (filters.search) {
      // Search in entity_type, action, or user email
      query = query.or(
        `entity_type.ilike.%${filters.search}%,action.ilike.%${filters.search}%`
      )
    }

    // Apply ordering (most recent first)
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching activity logs:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch activity logs' },
        { status: 500 }
      )
    }

    // Transform data to include user info
    const logs: ActivityLog[] = (data || []).map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      user_name: log.users?.name || 'Unknown',
      user_email: log.users?.email || 'unknown@system',
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      details: log.details,
      ip_address: log.ip_address,
      created_at: log.created_at,
    }))

    // Calculate pagination metadata
    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    const response: ActivityLogsResponse = {
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Activity logs fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
