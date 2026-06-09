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
 * GET /api/admin/site-statistics
 * Admin only - Returns statistics with metadata (updated_at, updated_by)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    // Fetch statistics with metadata
    const { data: statistics, error } = await supabase
      .from('site_statistics')
      .select('*, updated_by:users(name, email)')
      .single()

    if (error) {
      console.error('Error fetching statistics:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch statistics' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: statistics,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin statistics fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/site-statistics
 * Admin only - Update statistics values
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      active_members,
      activities_per_year,
      total_alumni,
      active_departments,
    } = body

    // Validate inputs (must be positive integers)
    const errors: string[] = []

    if (active_members !== undefined) {
      if (!Number.isInteger(active_members) || active_members < 0) {
        errors.push('Active members must be a positive integer')
      }
    }

    if (activities_per_year !== undefined) {
      if (!Number.isInteger(activities_per_year) || activities_per_year < 0) {
        errors.push('Activities per year must be a positive integer')
      }
    }

    if (total_alumni !== undefined) {
      if (!Number.isInteger(total_alumni) || total_alumni < 0) {
        errors.push('Total alumni must be a positive integer')
      }
    }

    if (active_departments !== undefined) {
      if (!Number.isInteger(active_departments) || active_departments < 0) {
        errors.push('Active departments must be a positive integer')
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
      updated_by: authResult.user?.id,
    }

    if (active_members !== undefined) updateData.active_members = active_members
    if (activities_per_year !== undefined) updateData.activities_per_year = activities_per_year
    if (total_alumni !== undefined) updateData.total_alumni = total_alumni
    if (active_departments !== undefined) updateData.active_departments = active_departments

    // Update statistics (site_statistics is a single-row table)
    const { data: updatedStats, error: updateError } = await supabase
      .from('site_statistics')
      .update(updateData)
      .eq('id', (await supabase.from('site_statistics').select('id').single()).data?.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating statistics:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update statistics' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'update',
      entity_type: 'site_statistics',
      entity_id: updatedStats.id,
      description: 'Updated site statistics',
    })

    return NextResponse.json(
      {
        success: true,
        data: updatedStats,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Statistics update exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
