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
 * POST /api/admin/hero-slides/reorder
 * Admin only - Reorder hero slides (bulk update order_index)
 */
export async function POST(request: NextRequest) {
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
    const { order } = await request.json()

    // Validate order array
    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 }
      )
    }

    // Validate each item in order array
    for (const item of order) {
      if (!item.id || typeof item.order_index !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Each order item must have id and order_index' },
          { status: 400 }
        )
      }
    }

    // Update order_index for each slide
    const updatePromises = order.map((item) =>
      supabase
        .from('hero_slides')
        .update({ order_index: item.order_index, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    )

    const results = await Promise.all(updatePromises)

    // Check for errors
    const errors = results.filter((result) => result.error)
    if (errors.length > 0) {
      console.error('Error reordering hero slides:', errors)
      return NextResponse.json(
        { success: false, error: 'Failed to reorder some slides' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'update',
      entity_type: 'hero_slide',
      entity_id: null,
      description: `Reordered ${order.length} hero slides`,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Hero slides reordered successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Hero slide reorder exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
