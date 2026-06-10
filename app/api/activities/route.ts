import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (anon key for public access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/activities
 * Public endpoint - List published activities with filtering
 * No authentication required
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const year = searchParams.get('year')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '9'))

    // Build query - only published activities
    let query = supabase
      .from('activities')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('date', { ascending: false })

    // Apply filters
    if (department) query = query.eq('department', department)
    if (year) query = query.eq('year', parseInt(year))
    if (type) query = query.eq('type', type)
    if (featured) query = query.eq('is_featured', true)
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
      )
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: activities, error, count } = await query

    if (error) {
      console.error('Error fetching public activities:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch activities' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        activities: activities || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Public activities fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
