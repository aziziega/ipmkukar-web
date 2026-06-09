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
 * GET /api/admin/users
 * Super admin only - List all admin users with filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and check super_admin role
    const authResult = await requireAuth(request)
    if (!authResult.authorized || authResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can manage users' },
        { status: 403 }
      )
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const roleFilter = searchParams.get('role') // 'all', 'super_admin', 'admin'
    const statusFilter = searchParams.get('status') // 'all', 'active', 'inactive'
    const searchQuery = searchParams.get('search') // search by name or email

    // Build query
    let query = supabase
      .from('users')
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .order('created_at', { ascending: false })

    // Apply role filter
    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role', roleFilter)
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('is_active', statusFilter === 'active')
    }

    // Apply search filter
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
    }

    const { data: users, error } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    // Calculate counts
    const totalCount = users?.length || 0
    const activeCount = users?.filter(u => u.is_active).length || 0

    return NextResponse.json(
      {
        success: true,
        users: users || [],
        counts: {
          total: totalCount,
          active: activeCount,
          inactive: totalCount - activeCount,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Users fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users
 * Super admin only - Create new admin user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and check super_admin role
    const authResult = await requireAuth(request)
    if (!authResult.authorized || authResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can create users' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email, name, password, role, is_active } = body

    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, name, password, and role are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate role
    if (role !== 'super_admin' && role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Role must be super_admin or admin' },
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

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password_hash,
        role,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select('id, email, name, role, is_active, created_at')
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'create',
      entity_type: 'user',
      entity_id: newUser.id,
      description: `Created new ${role} user: ${email}`,
    })

    return NextResponse.json(
      {
        success: true,
        user: newUser,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('User creation exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
