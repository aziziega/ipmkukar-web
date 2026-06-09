import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

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
 * POST /api/admin/users/[id]/reset-password
 * Super admin only - Reset user password
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication and check super_admin role
    const authResult = await requireAuth(request)
    if (!authResult.authorized || authResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can reset passwords' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { password } = body

    // Validate password
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate password strength (min 8 chars, 1 uppercase, 1 number)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      )
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain at least one number' },
        { status: 400 }
      )
    }

    // Fetch user to verify existence
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('email')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash new password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error resetting password:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to reset password' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'update',
      entity_type: 'user',
      entity_id: id,
      description: `Reset password for user ${existingUser.email}`,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
