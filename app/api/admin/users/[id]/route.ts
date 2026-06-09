import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'

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
 * GET /api/admin/users/[id]
 * Super admin only - Get single user details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication and check super_admin role
    const authResult = await requireAuth(request)
    if (!authResult.authorized || authResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can view user details' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Fetch user details (exclude password_hash)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .eq('id', id)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('User fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Super admin only - Update user (name, role, is_active)
 * Cannot edit email (as per requirements)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication and check super_admin role
    const authResult = await requireAuth(request)
    if (!authResult.authorized || authResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can update users' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Fetch existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent self-modification for critical fields
    if (authResult.user?.id === id) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify your own account through this endpoint' },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, role, is_active } = body

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Update name if provided
    if (name !== undefined) {
      if (!name || name.trim().length < 2) {
        return NextResponse.json(
          { success: false, error: 'Name must be at least 2 characters' },
          { status: 400 }
        )
      }
      updateData.name = name.trim()
    }

    // Update role if provided
    if (role !== undefined) {
      if (role !== 'super_admin' && role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Role must be super_admin or admin' },
          { status: 400 }
        )
      }
      updateData.role = role
    }

    // Update is_active if provided
    if (is_active !== undefined) {
      updateData.is_active = is_active
    }

    // If trying to deactivate last super_admin, prevent it
    if (updateData.is_active === false && existingUser.role === 'super_admin') {
      const { data: superAdmins } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'super_admin')
        .eq('is_active', true)

      if (superAdmins && superAdmins.length === 1 && superAdmins[0].id === id) {
        return NextResponse.json(
          { success: false, error: 'Cannot deactivate the last active super admin' },
          { status: 400 }
        )
      }
    }

    // If trying to demote last super_admin, prevent it
    if (updateData.role === 'admin' && existingUser.role === 'super_admin') {
      const { data: superAdmins } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'super_admin')
        .eq('is_active', true)

      if (superAdmins && superAdmins.length === 1 && superAdmins[0].id === id) {
        return NextResponse.json(
          { success: false, error: 'Cannot demote the last active super admin' },
          { status: 400 }
        )
      }
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .single()

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      )
    }

    // Log activity
    const changes = []
    if (name !== undefined && name !== existingUser.name) changes.push(`name: ${existingUser.name} → ${name}`)
    if (role !== undefined && role !== existingUser.role) changes.push(`role: ${existingUser.role} → ${role}`)
    if (is_active !== undefined && is_active !== existingUser.is_active) {
      changes.push(`status: ${existingUser.is_active ? 'active' : 'inactive'} → ${is_active ? 'active' : 'inactive'}`)
    }

    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'update',
      entity_type: 'user',
      entity_id: id,
      description: `Updated user ${existingUser.email}: ${changes.join(', ')}`,
    })

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('User update exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Super admin only - Soft delete user (set is_active = false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication and check super_admin role
    const authResult = await requireAuth(request)
    if (!authResult.authorized || authResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can delete users' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Prevent self-deletion
    if (authResult.user?.id === id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Fetch existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting last super_admin
    if (existingUser.role === 'super_admin') {
      const { data: superAdmins } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'super_admin')
        .eq('is_active', true)

      if (superAdmins && superAdmins.length === 1 && superAdmins[0].id === id) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete the last active super admin' },
          { status: 400 }
        )
      }
    }

    // Soft delete (set is_active = false)
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('Error deleting user:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete user' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'delete',
      entity_type: 'user',
      entity_id: id,
      description: `Deactivated user ${existingUser.email}`,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'User deactivated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('User deletion exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
