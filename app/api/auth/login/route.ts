import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  hashPassword,
  verifyPassword,
  generateToken,
  setAuthCookie,
  isValidEmail,
} from '@/lib/auth'
import { logLogin, logLoginFailed, extractIpAddress } from '@/lib/activity-logger'

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

interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequest = await request.json()
    const { email, password, rememberMe = false } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user exists
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (fetchError || !user) {
      // Log failed login attempt
      const ipAddress = extractIpAddress(request)
      await logLoginFailed(
        supabase,
        email,
        'User not found',
        ipAddress || undefined
      )
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is inactive. Contact super admin.' },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      // Log failed login attempt
      const ipAddress = extractIpAddress(request)
      await logLoginFailed(
        supabase,
        email,
        'Invalid password',
        ipAddress || undefined
      )
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await generateToken(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
      },
      rememberMe
    )

    // Set auth cookie
    await setAuthCookie(token, rememberMe)

    // Update last login timestamp
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // Log successful login
    const ipAddress = extractIpAddress(request)
    await logLogin(supabase, user.id, user.email, ipAddress || undefined)

    // Return user data (without password hash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_active: user.is_active,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
