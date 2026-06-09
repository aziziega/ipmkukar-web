import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/site-statistics
 * Public endpoint - Returns current site statistics
 * No authentication required
 */
export async function GET() {
  try {
    // Fetch statistics from database (single row table)
    const { data: statistics, error } = await supabase
      .from('site_statistics')
      .select('active_members, activities_per_year, total_alumni, active_departments')
      .single()

    if (error) {
      console.error('Error fetching statistics:', error)
      
      // Return fallback values if database query fails
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch statistics',
          data: {
            active_members: 30,
            activities_per_year: 10,
            total_alumni: 1000,
            active_departments: 6,
          },
        },
        { status: 500 }
      )
    }

    // Return statistics
    return NextResponse.json(
      {
        success: true,
        data: statistics,
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Site statistics fetch exception:', error)
    
    // Return fallback values on exception
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        data: {
          active_members: 30,
          activities_per_year: 10,
          total_alumni: 1000,
          active_departments: 6,
        },
      },
      { status: 500 }
    )
  }
}
