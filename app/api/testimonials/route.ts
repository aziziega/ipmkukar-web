import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Shuffle array randomly (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * GET /api/testimonials
 * Public endpoint - Returns all testimonials (shuffled randomly)
 * No authentication required
 */
export async function GET() {
  try {
    // Fetch all testimonials (no is_active filter - user wants all testimonials always displayed)
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('id, name, position, company, district, quote, photo_url')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials:', error)
      
      // Return empty array as fallback
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch testimonials',
          testimonials: [],
        },
        { status: 500 }
      )
    }

    // Shuffle testimonials randomly for fresh display
    const shuffledTestimonials = shuffleArray(testimonials || [])

    // Return testimonials
    return NextResponse.json(
      {
        success: true,
        testimonials: shuffledTestimonials,
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Testimonials fetch exception:', error)
    
    // Return empty array as fallback
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        testimonials: [],
      },
      { status: 500 }
    )
  }
}
