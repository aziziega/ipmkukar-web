import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadActivityImages,
  validateActivityImages,
} from '@/lib/supabase-storage-activities'
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
 * GET /api/admin/activities
 * All admins - List all activities with filtering
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const year = searchParams.get('year')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))

    // Build query
    let query = supabase
      .from('activities')
      .select('*, created_by:users(name, email)', { count: 'exact' })
      .order('date', { ascending: false })

    // Apply filters
    if (department) query = query.eq('department', department)
    if (year) query = query.eq('year', parseInt(year))
    if (type) query = query.eq('type', type)
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
      console.error('Error fetching activities:', error)
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
    console.error('Activities fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/activities
 * All admins - Create new activity with images
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

    // Parse form data
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const department = formData.get('department') as string
    const type = formData.get('type') as string
    const date = formData.get('date') as string
    const location = formData.get('location') as string
    const participants = formData.get('participants') as string
    const isPublished = formData.get('is_published') === 'true'
    const isFeatured = formData.get('is_featured') === 'true'

    // Get image files
    const imageFiles: File[] = []
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`image_${i}`) as File | null
      if (file && file.size > 0) {
        imageFiles.push(file)
      }
    }

    // Validate required fields
    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Title must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Description must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (!department || !type || !date || !location) {
      return NextResponse.json(
        { success: false, error: 'Department, type, date, and location are required' },
        { status: 400 }
      )
    }

    if (!participants || parseInt(participants) < 0) {
      return NextResponse.json(
        { success: false, error: 'Participants count is required and must be >= 0' },
        { status: 400 }
      )
    }

    // Validate images if provided
    if (imageFiles.length > 0) {
      const validation = validateActivityImages(imageFiles)
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      }
    }

    // Extract year from date
    const activityDate = new Date(date)
    const year = activityDate.getFullYear()

    // Create activity record first (to get ID for image upload)
    const { data: newActivity, error: insertError } = await supabase
      .from('activities')
      .insert({
        title: title.trim(),
        description: description.trim(),
        department,
        type,
        date,
        year,
        location: location.trim(),
        participants: parseInt(participants),
        is_published: isPublished,
        is_featured: isFeatured,
        images: [], // Empty initially
        created_by: authResult.user?.id,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating activity:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create activity' },
        { status: 500 }
      )
    }

    // Upload images if provided
    let imageUrls: string[] = []
    if (imageFiles.length > 0) {
      const uploadResult = await uploadActivityImages(imageFiles, newActivity.id)
      if (!uploadResult.success) {
        // Rollback: delete the created activity
        await supabase.from('activities').delete().eq('id', newActivity.id)
        return NextResponse.json(
          { success: false, error: uploadResult.error },
          { status: 500 }
        )
      }
      imageUrls = uploadResult.urls || []

      // Update activity with image URLs
      const { error: updateError } = await supabase
        .from('activities')
        .update({ images: imageUrls })
        .eq('id', newActivity.id)

      if (updateError) {
        console.error('Error updating activity images:', updateError)
      }
    }

    // Log activity
    const ipAddress = extractIpAddress(request)
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.CREATE,
      entity_type: EntityType.ACTIVITY,
      entity_id: newActivity.id,
      details: {
        title: title.trim(),
        department,
        type,
        image_count: imageUrls.length,
      },
      ip_address: ipAddress || undefined,
    })

    return NextResponse.json(
      {
        success: true,
        activity: { ...newActivity, images: imageUrls },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Activity creation exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
