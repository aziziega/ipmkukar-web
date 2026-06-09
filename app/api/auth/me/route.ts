// API route to get current authenticated user
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCurrentUser } from '@/lib/auth'

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

export async function GET(request: NextRequest) {
  try {
    // Get current user from token
    const { success, user, error } = await getCurrentUser(request)

    if (!success || !user) {
      return NextResponse.json(
        { error: error || 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch full user data from database
    const { data: fullUser, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name, role, is_active, last_login_at, created_at')
      .eq('id', user.id)
      .single()

    if (fetchError || !fullUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if account is still active
    if (!fullUser.is_active) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      )
    }

    // Return user data (without password hash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: fullUser.id,
          email: fullUser.email,
          name: fullUser.name,
          role: fullUser.role,
          is_active: fullUser.is_active,
          last_login_at: fullUser.last_login_at,
          created_at: fullUser.created_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
