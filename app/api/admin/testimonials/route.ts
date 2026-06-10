import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadTestimonialPhoto,
  validateTestimonialPhoto,
  generateUniqueTestimonialFilename,
  generateAvatarFromName,
} from '@/lib/supabase-storage-testimonials'
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
 * GET /api/admin/testimonials
 * Admin only - List all testimonials
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search') // search by name, position, or company

    // Build query
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply search filter
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,position.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,district.ilike.%${searchQuery}%`)
    }

    const { data: testimonials, error } = await query

    if (error) {
      console.error('Error fetching testimonials:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch testimonials' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        testimonials: testimonials || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin testimonials fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/testimonials
 * Admin only - Create new testimonial with optional photo
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

    // Parse form data (multipart/form-data for file upload)
    const formData = await request.formData()
    const name = formData.get('name') as string
    const position = formData.get('position') as string
    const company = formData.get('company') as string | null
    const district = formData.get('district') as string | null
    const quote = formData.get('quote') as string
    const photoFile = formData.get('photo') as File | null

    // Validate required fields
    if (!name || !position || !quote) {
      return NextResponse.json(
        { success: false, error: 'Name, position, and quote are required' },
        { status: 400 }
      )
    }

    // Validate name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Validate position
    if (position.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Position must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Validate quote length
    if (quote.trim().length < 10 || quote.trim().length > 500) {
      return NextResponse.json(
        { success: false, error: 'Quote must be between 10 and 500 characters' },
        { status: 400 }
      )
    }

    // Handle photo upload (optional)
    let photoUrl: string | null = null

    if (photoFile && photoFile.size > 0) {
      // Validate photo
      const validation = validateTestimonialPhoto(photoFile)
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      }

      // Generate unique filename
      const filename = generateUniqueTestimonialFilename(photoFile.name)

      // Upload photo to Supabase Storage
      const uploadResult = await uploadTestimonialPhoto(photoFile, filename)

      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error || 'Failed to upload photo' },
          { status: 500 }
        )
      }

      photoUrl = uploadResult.url!
    } else {
      // No photo provided - use avatar fallback
      photoUrl = generateAvatarFromName(name.trim())
    }

    // Insert testimonial
    const { data: newTestimonial, error: insertError } = await supabase
      .from('testimonials')
      .insert({
        name: name.trim(),
        position: position.trim(),
        company: company?.trim() || null,
        district: district?.trim() || null,
        quote: quote.trim(),
        photo_url: photoUrl,
        created_by: authResult.user?.id,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating testimonial:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create testimonial' },
        { status: 500 }
      )
    }

    // Log activity
    const ipAddress = extractIpAddress(request)
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.CREATE,
      entity_type: EntityType.TESTIMONIAL,
      entity_id: newTestimonial.id,
      details: { name: name.trim(), position: position.trim(), company: company?.trim() },
      ip_address: ipAddress || undefined,
    })

    return NextResponse.json(
      {
        success: true,
        testimonial: newTestimonial,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Testimonial creation exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
