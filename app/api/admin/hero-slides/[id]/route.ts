import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadHeroImage,
  deleteHeroImage,
  generateUniqueFilename,
  validateImageFile,
} from '@/lib/supabase-storage'

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
 * PATCH /api/admin/hero-slides/[id]
 * Admin only - Update hero slide (title, image, active status)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // Fetch existing slide
    const { data: existingSlide, error: fetchError } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingSlide) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null
    const title = formData.get('title') as string | null
    const isActive = formData.get('is_active')

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Update title if provided
    if (title !== null && title.trim().length >= 3) {
      updateData.title = title.trim()
    }

    // Update is_active if provided
    if (isActive !== null) {
      updateData.is_active = isActive === 'true'
    }

    // Handle image replacement if new image provided
    if (imageFile) {
      // Validate new image
      const validation = validateImageFile(imageFile)
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      }

      // Generate unique filename for new image
      const filename = generateUniqueFilename(imageFile.name)

      // Upload new image
      const uploadResult = await uploadHeroImage(imageFile, filename)
      if (!uploadResult.success || !uploadResult.url) {
        return NextResponse.json(
          {
            success: false,
            error: uploadResult.error || 'Image upload failed',
          },
          { status: 500 }
        )
      }

      // Delete old image from storage
      await deleteHeroImage(existingSlide.image_url)

      // Update image_url
      updateData.image_url = uploadResult.url
    }

    // Update database record
    const { data: updatedSlide, error: updateError } = await supabase
      .from('hero_slides')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating hero slide:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update hero slide' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'update',
      entity_type: 'hero_slide',
      entity_id: id,
      description: `Updated hero slide: ${updatedSlide.title}`,
    })

    return NextResponse.json(
      {
        success: true,
        slide: updatedSlide,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Hero slide update exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/hero-slides/[id]
 * Admin only - Delete hero slide and its image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // Fetch existing slide
    const { data: existingSlide, error: fetchError } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingSlide) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 }
      )
    }

    // Delete image from storage
    await deleteHeroImage(existingSlide.image_url)

    // Delete database record
    const { error: deleteError } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting hero slide:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete hero slide' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: authResult.user?.id,
      action: 'delete',
      entity_type: 'hero_slide',
      entity_id: id,
      description: `Deleted hero slide: ${existingSlide.title}`,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Hero slide deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Hero slide deletion exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
