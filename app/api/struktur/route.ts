import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/struktur
 * Public endpoint - Returns active organizational structure and departments info
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
          departments: [],
        },
        { status: 500 }
      )
    }

    // Fetch all active departments with their metadata
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('id, slug, name, full_name, description, color, icon')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (deptError) {
      console.error('Error fetching departments:', deptError)
    }

    // Return organizational structure and departments
    return NextResponse.json(
      {
        success: true,
        structure: structure || null,
        departments: departments || [],
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
        departments: [],
      },
      { status: 500 }
    )
  }
}
