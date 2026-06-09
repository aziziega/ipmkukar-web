import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { cookies } from 'next/headers'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  is_active: boolean
}

export interface JWTPayload {
  userId: string
  email: string
  role: 'super_admin' | 'admin'
  iat?: number
  exp?: number
}

interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const SESSION_DURATION = 24 * 60 * 60 // 24 hours in seconds
const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 // 7 days in seconds
const SALT_ROUNDS = 10

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 */
export async function generateToken(
  user: User,
  rememberMe: boolean = false
): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const expiresIn = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION

  // jose requires secret as Uint8Array
  const secret = new TextEncoder().encode(JWT_SECRET)

  const token = await new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${expiresIn}s`)
    .sign(secret)

  return token
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    // jose requires secret as Uint8Array
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    // Cast through unknown because jose.JWTPayload and our custom JWTPayload are different types
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Get current user from request cookies
 */
export async function getCurrentUser(
  request?: NextRequest
): Promise<AuthResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return { success: false, error: 'No token found' }
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return { success: false, error: 'Invalid token' }
    }

    // In production, fetch full user data from database
    // For now, return user from token payload
    const user: User = {
      id: payload.userId,
      email: payload.email,
      name: '', // Will be fetched from DB in production
      role: payload.role,
      is_active: true,
    }

    return { success: true, user }
  } catch (error) {
    console.error('Get current user error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

/**
 * Set authentication cookie
 */
export async function setAuthCookie(token: string, rememberMe: boolean = false) {
  const cookieStore = await cookies()
  const maxAge = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION

  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ authorized: boolean; user?: User; error?: string }> {
  const result = await getCurrentUser(request)

  if (!result.success || !result.user) {
    return {
      authorized: false,
      error: result.error || 'Unauthorized',
    }
  }

  if (!result.user.is_active) {
    return {
      authorized: false,
      error: 'Account is inactive',
    }
  }

  return {
    authorized: true,
    user: result.user,
  }
}

/**
 * Middleware to require super admin role
 */
export async function requireSuperAdmin(
  request: NextRequest
): Promise<{ authorized: boolean; user?: User; error?: string }> {
  const authResult = await requireAuth(request)

  if (!authResult.authorized || !authResult.user) {
    return authResult
  }

  if (authResult.user.role !== 'super_admin') {
    return {
      authorized: false,
      error: 'Super admin access required',
    }
  }

  return authResult
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return hasUpperCase && hasLowerCase && hasNumber
}
