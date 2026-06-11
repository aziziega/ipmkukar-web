import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (anon key for public access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/programs
 * Public endpoint - List published department programs for home page
 * No authentication required
 */
export async function GET(request: NextRequest) {
  try {
    // Build query - only published programs
    const query = supabase
      .from('department_programs')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })

    const { data: programs, error } = await query

    if (error) {
      console.error('Error fetching public programs:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch programs' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        programs: programs || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Public programs fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
