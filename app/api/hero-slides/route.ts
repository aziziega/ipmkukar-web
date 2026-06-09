import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/hero-slides
 * Public endpoint - Returns only active hero slides ordered by order_index
 */
export async function GET() {
  try {
    // Fetch active hero slides ordered by order_index
    const { data: slides, error } = await supabase
      .from('hero_slides')
      .select('id, title, image_url, order_index')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching hero slides:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hero slides' },
        { status: 500 }
      )
    }

    // Return slides with proper structure for frontend
    return NextResponse.json(
      {
        success: true,
        slides: slides || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Hero slides fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
