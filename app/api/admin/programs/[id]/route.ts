import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadProgramImages,
  deleteProgramImages,
  validateProgramImages,
} from '@/lib/supabase-storage-programs'
import { logActivity, extractIpAddress } from '@/lib/activity-logger'
import { ActivityAction, EntityType } from '@/types/activity-log'

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
 * GET /api/admin/programs/[id]
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const { data: program, error } = await supabase
      .from('department_programs')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !program) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, program },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get program exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/programs/[id]
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Fetch existing program
    const { data: existingProgram, error: fetchError } = await supabase
      .from('department_programs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingProgram) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()

    // Extract fields
    const department = formData.get('department') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const programsJson = formData.get('programs') as string
    const badgeText = formData.get('badge_text') as string
    const badgeColor = formData.get('badge_color') as string
    const displayOrder = parseInt(formData.get('display_order') as string) || existingProgram.display_order
    const isPublished = formData.get('is_published') === 'true'
    const keepExistingImages = formData.get('keep_existing_images') === 'true'

    // Validate required fields
    if (!department || !title || !description || !programsJson || !badgeText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse programs
    let programs: string[]
    try {
      programs = JSON.parse(programsJson)
      if (!Array.isArray(programs) || programs.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Programs must be a non-empty array' },
          { status: 400 }
        )
      }
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Invalid programs format' },
        { status: 400 }
      )
    }

    // Check department uniqueness (if changed)
    if (department !== existingProgram.department) {
      const { data: duplicate } = await supabase
        .from('department_programs')
        .select('id')
        .eq('department', department)
        .neq('id', id)
        .single()

      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Department already exists' },
          { status: 409 }
        )
      }
    }

    let finalImageUrls = existingProgram.images

    // Handle image updates
    if (!keepExistingImages) {
      const newImageFiles: File[] = []
      for (let i = 0; i < 10; i++) {
        const file = formData.get(`image_${i}`) as File | null
        if (file) {
          newImageFiles.push(file)
        }
      }

      if (newImageFiles.length > 0) {
        const validation = validateProgramImages(newImageFiles)
        if (!validation.valid) {
          return NextResponse.json(
            { success: false, error: validation.error },
            { status: 400 }
          )
        }

        // Delete old images
        if (existingProgram.images && existingProgram.images.length > 0) {
          await deleteProgramImages(existingProgram.images)
        }

        // Upload new images
        const uploadResult = await uploadProgramImages(id, newImageFiles)
        if (!uploadResult.success) {
          return NextResponse.json(
            { success: false, error: uploadResult.error },
            { status: 500 }
          )
        }

        finalImageUrls = uploadResult.urls
      } else if (existingProgram.images && existingProgram.images.length === 0) {
        return NextResponse.json(
          { success: false, error: 'At least one image is required' },
          { status: 400 }
        )
      }
    }

    // Update program
    const { data: updatedProgram, error: updateError } = await supabase
      .from('department_programs')
      .update({
        department,
        title,
        description,
        programs,
        images: finalImageUrls,
        badge_text: badgeText,
        badge_color: badgeColor,
        display_order: displayOrder,
        is_published: isPublished,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating program:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update program' },
        { status: 500 }
      )
    }

    // Log activity
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.UPDATE,
      entity_type: EntityType.PROGRAM,
      entity_id: id,
      details: { department, title },
      ip_address: extractIpAddress(request),
    })

    return NextResponse.json(
      { success: true, program: updatedProgram },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update program exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/programs/[id]
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Fetch existing program
    const { data: existingProgram, error: fetchError } = await supabase
      .from('department_programs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingProgram) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      )
    }

    // Delete images from storage
    if (existingProgram.images && existingProgram.images.length > 0) {
      await deleteProgramImages(existingProgram.images)
    }

    // Delete program from database
    const { error: deleteError } = await supabase
      .from('department_programs')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting program:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete program' },
        { status: 500 }
      )
    }

    // Log activity
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.DELETE,
      entity_type: EntityType.PROGRAM,
      entity_id: id,
      details: { department: existingProgram.department, title: existingProgram.title },
      ip_address: extractIpAddress(request),
    })

    return NextResponse.json(
      { success: true, message: 'Program deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete program exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
