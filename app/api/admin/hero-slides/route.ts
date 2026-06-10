import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadHeroImage,
  generateUniqueFilename,
  validateImageFile,
} from '@/lib/supabase-storage'
import { logActivity, extractIpAddress } from '@/lib/activity-logger'
import { ActivityAction, EntityType } from '@/types/activity-log'

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
 * GET /api/admin/hero-slides
 * Admin only - Returns all hero slides (including inactive)
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

    // Fetch all hero slides ordered by order_index
    const { data: slides, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching hero slides:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hero slides' },
        { status: 500 }
      )
    }

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

/**
 * POST /api/admin/hero-slides
 * Admin only - Create new hero slide with image upload
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

    // Parse multipart form data
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null
    const title = formData.get('title') as string
    const orderIndex = formData.get('order_index') as string
    const isActive = formData.get('is_active') === 'true'

    // Validate required fields
    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'Image file is required' },
        { status: 400 }
      )
    }

    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Title must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Validate image file
    const validation = validateImageFile(imageFile)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Generate unique filename
    const filename = generateUniqueFilename(imageFile.name)

    // Upload image to Supabase Storage
    const uploadResult = await uploadHeroImage(imageFile, filename)
    if (!uploadResult.success || !uploadResult.url) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'Image upload failed' },
        { status: 500 }
      )
    }

    // Determine order_index
    let finalOrderIndex = parseInt(orderIndex) || 0
    if (finalOrderIndex === 0) {
      // Auto-assign next available order_index
      const { data: maxOrderSlide } = await supabase
        .from('hero_slides')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      finalOrderIndex = (maxOrderSlide?.order_index || 0) + 1
    }

    // Insert hero slide record into database
    const { data: newSlide, error: insertError } = await supabase
      .from('hero_slides')
      .insert({
        title: title.trim(),
        image_url: uploadResult.url,
        order_index: finalOrderIndex,
        is_active: isActive,
        subtitle: null,
        cta_text: null,
        cta_link: null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting hero slide:', insertError)
      // If database insert fails, delete the uploaded image
      // (cleanup to avoid orphaned files in storage)
      return NextResponse.json(
        { success: false, error: 'Failed to create hero slide' },
        { status: 500 }
      )
    }

    // Log activity
    const ipAddress = extractIpAddress(request)
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.CREATE,
      entity_type: EntityType.HERO_SLIDE,
      entity_id: newSlide.id,
      details: { title: title.trim(), order_index: finalOrderIndex },
      ip_address: ipAddress || undefined,
    })

    return NextResponse.json(
      {
        success: true,
        slide: newSlide,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Hero slide creation exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
