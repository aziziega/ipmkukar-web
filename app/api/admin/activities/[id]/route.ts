import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadActivityImages,
  deleteActivityImages,
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

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/activities/:id
 * All admins - Fetch single activity by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Fetch activity with creator info
    const { data: activity, error } = await supabase
      .from('activities')
      .select('*, created_by:users(name, email)')
      .eq('id', id)
      .single()

    if (error || !activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, activity },
      { status: 200 }
    )
  } catch (error) {
    console.error('Activity fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/activities/:id
 * All admins - Update activity
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Fetch existing activity
    const { data: existingActivity, error: fetchError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingActivity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
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
    const existingImages = formData.get('existing_images') as string // JSON array of URLs to keep

    // Get new image files
    const newImageFiles: File[] = []
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`new_image_${i}`) as File | null
      if (file && file.size > 0) {
        newImageFiles.push(file)
      }
    }

    // Parse existing images to keep
    const imagesToKeep: string[] = existingImages
      ? JSON.parse(existingImages)
      : existingActivity.images || []

    // Validate total image count (existing + new)
    const totalImages = imagesToKeep.length + newImageFiles.length
    if (totalImages > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 images allowed per activity' },
        { status: 400 }
      )
    }

    // Validate new images if provided
    if (newImageFiles.length > 0) {
      const validation = validateActivityImages(newImageFiles)
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      }
    }

    // Validate required fields
    if (title && title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Title must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (description && description.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Description must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (participants && parseInt(participants) < 0) {
      return NextResponse.json(
        { success: false, error: 'Participants count must be >= 0' },
        { status: 400 }
      )
    }

    // Upload new images
    let newImageUrls: string[] = []
    if (newImageFiles.length > 0) {
      const uploadResult = await uploadActivityImages(newImageFiles, id)
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error },
          { status: 500 }
        )
      }
      newImageUrls = uploadResult.urls || []
    }

    // Combine existing and new images
    const finalImageUrls = [...imagesToKeep, ...newImageUrls]

    // Determine which images to delete (old images not in imagesToKeep)
    const oldImages = existingActivity.images || []
    const imagesToDelete = oldImages.filter(
      (url: string) => !imagesToKeep.includes(url)
    )

    // Delete removed images
    if (imagesToDelete.length > 0) {
      await deleteActivityImages(imagesToDelete)
    }

    // Extract year from date if date is being updated
    const year = date ? new Date(date).getFullYear() : existingActivity.year

    // Build update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
      images: finalImageUrls,
    }

    if (title) updateData.title = title.trim()
    if (description) updateData.description = description.trim()
    if (department) updateData.department = department
    if (type) updateData.type = type
    if (date) {
      updateData.date = date
      updateData.year = year
    }
    if (location) updateData.location = location.trim()
    if (participants) updateData.participants = parseInt(participants)
    if (isPublished !== undefined) updateData.is_published = isPublished
    if (isFeatured !== undefined) updateData.is_featured = isFeatured

    // Update activity
    const { data: updatedActivity, error: updateError } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating activity:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update activity' },
        { status: 500 }
      )
    }

    // Log activity
    const ipAddress = extractIpAddress(request)
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.UPDATE,
      entity_type: EntityType.ACTIVITY,
      entity_id: id,
      details: {
        title: title || existingActivity.title,
        changes: Object.keys(updateData),
      },
      ip_address: ipAddress || undefined,
    })

    return NextResponse.json(
      { success: true, activity: updatedActivity },
      { status: 200 }
    )
  } catch (error) {
    console.error('Activity update exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/activities/:id
 * All admins - Delete activity
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Fetch activity to get images for deletion
    const { data: activity, error: fetchError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      )
    }

    // Delete images from storage
    if (activity.images && activity.images.length > 0) {
      await deleteActivityImages(activity.images)
    }

    // Delete activity from database
    const { error: deleteError } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting activity:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete activity' },
        { status: 500 }
      )
    }

    // Log activity
    const ipAddress = extractIpAddress(request)
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.DELETE,
      entity_type: EntityType.ACTIVITY,
      entity_id: id,
      details: {
        title: activity.title,
        department: activity.department,
      },
      ip_address: ipAddress || undefined,
    })

    return NextResponse.json(
      { success: true, message: 'Activity deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Activity deletion exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
