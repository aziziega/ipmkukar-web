import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/struktur
 * Public endpoint - Returns active organizational structure
 * No authentication required
 */
export async function GET() {
  try {
    // Fetch active organizational structure
    const { data: structure, error } = await supabase
      .from('organizational_structure')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (acceptable - database might be empty)
      console.error('Error fetching organizational structure:', error)
      
      // Return empty structure as fallback
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch organizational structure',
          structure: null,
        },
        { status: 500 }
      )
    }

    // Return organizational structure (null if no data exists yet)
    return NextResponse.json(
      {
        success: true,
        structure: structure || null,
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Organizational structure fetch exception:', error)
    
    // Return empty structure as fallback
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        structure: null,
      },
      { status: 500 }
    )
  }
}
