import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadTestimonialPhoto,
  deleteTestimonialPhoto,
  validateTestimonialPhoto,
  generateUniqueTestimonialFilename,
  generateAvatarFromName,
} from '@/lib/supabase-storage-testimonials'

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
 * GET /api/admin/testimonials/[id]
 * Admin only - Get single testimonial
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await params

    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, testimonial },
      { status: 200 }
    )
  } catch (error) {
    console.error('Testimonial fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/testimonials/[id]
 * Admin only - Update testimonial (optional photo replacement)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await params

    // Fetch existing testimonial
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const name = formData.get('name') as string
    const position = formData.get('position') as string
    const company = formData.get('company') as string | null
    const district = formData.get('district') as string | null
    const quote = formData.get('quote') as string
    const photoFile = formData.get('photo') as File | null
    const removePhoto = formData.get('removePhoto') === 'true'

    // Validate fields if provided
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (position && position.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Position must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (quote && (quote.trim().length < 10 || quote.trim().length > 500)) {
      return NextResponse.json(
        { success: false, error: 'Quote must be between 10 and 500 characters' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (name) updateData.name = name.trim()
    if (position) updateData.position = position.trim()
    if (company !== undefined) updateData.company = company?.trim() || null
    if (district !== undefined) updateData.district = district?.trim() || null
    if (quote) updateData.quote = quote.trim()

    // Handle photo update
    const oldPhotoUrl = existingTestimonial.photo_url
    const isOldPhotoUploaded = oldPhotoUrl && !oldPhotoUrl.includes('dicebear.com')

    if (removePhoto) {
      // User wants to remove photo - use avatar fallback
      updateData.photo_url = generateAvatarFromName(name || existingTestimonial.name)
      
      // Delete old photo from storage if it was uploaded
      if (isOldPhotoUploaded) {
        await deleteTestimonialPhoto(oldPhotoUrl)
      }
    } else if (photoFile && photoFile.size > 0) {
      // New photo provided - validate and upload
      const validation = validateTestimonialPhoto(photoFile)
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      }

      const filename = generateUniqueTestimonialFilename(photoFile.name)
      const uploadResult = await uploadTestimonialPhoto(photoFile, filename)

      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error || 'Failed to upload photo' },
          { status: 500 }
        )
      }

      updateData.photo_url = uploadResult.url

      // Delete old photo from storage if it was uploaded
      if (isOldPhotoUploaded) {
        await deleteTestimonialPhoto(oldPhotoUrl)
      }
    }

    // Update testimonial
    const { data: updatedTestimonial, error: updateError } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating testimonial:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update testimonial' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'update',
      entity_type: 'testimonial',
      entity_id: id,
      description: `Updated testimonial from ${updatedTestimonial.name}`,
    })

    return NextResponse.json(
      { success: true, testimonial: updatedTestimonial },
      { status: 200 }
    )
  } catch (error) {
    console.error('Testimonial update exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/testimonials/[id]
 * Admin only - Delete testimonial and photo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await params

    // Fetch existing testimonial
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Delete photo from storage if it was uploaded (not avatar)
    if (existingTestimonial.photo_url && !existingTestimonial.photo_url.includes('dicebear.com')) {
      await deleteTestimonialPhoto(existingTestimonial.photo_url)
    }

    // Delete testimonial from database
    const { error: deleteError } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting testimonial:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete testimonial' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'delete',
      entity_type: 'testimonial',
      entity_id: id,
      description: `Deleted testimonial from ${existingTestimonial.name}`,
    })

    return NextResponse.json(
      { success: true, message: 'Testimonial deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Testimonial deletion exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
