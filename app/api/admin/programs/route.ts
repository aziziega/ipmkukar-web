import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadProgramImages,
  validateProgramImages,
} from '@/lib/supabase-storage-programs'
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
 * GET /api/admin/programs
 * Admin endpoint - List all department programs
 * Requires authentication
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

    // Build query
    const query = supabase
      .from('department_programs')
      .select('*')
      .order('display_order', { ascending: true })

    const { data: programs, error } = await query

    if (error) {
      console.error('Error fetching admin programs:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch programs' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        programs: programs || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin programs fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/programs
 * Admin endpoint - Create new department program
 * Requires authentication
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

    const formData = await request.formData()

    // Extract form fields
    const department = formData.get('department') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const programsJson = formData.get('programs') as string
    const badgeText = formData.get('badge_text') as string
    const badgeColor = formData.get('badge_color') as string
    const displayOrder = parseInt(formData.get('display_order') as string) || 0
    const isPublished = formData.get('is_published') === 'true'

    // Validate required fields
    if (!department || !title || !description || !programsJson || !badgeText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse programs array
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

    // Check if department already exists
    const { data: existingProgram } = await supabase
      .from('department_programs')
      .select('id')
      .eq('department', department)
      .single()

    if (existingProgram) {
      return NextResponse.json(
        { success: false, error: 'Department program already exists' },
        { status: 409 }
      )
    }

    // Extract image files
    const imageFiles: File[] = []
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`image_${i}`) as File | null
      if (file) {
        imageFiles.push(file)
      }
    }

    // Validate images
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one image is required' },
        { status: 400 }
      )
    }

    const validation = validateProgramImages(imageFiles)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Create program entry first to get ID
    const { data: newProgram, error: createError } = await supabase
      .from('department_programs')
      .insert({
        department,
        title,
        description,
        programs,
        images: [], // Will update after upload
        badge_text: badgeText,
        badge_color: badgeColor || 'bg-emerald-100 text-emerald-700 border-emerald-200',
        display_order: displayOrder,
        is_published: isPublished,
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating program:', createError)
      return NextResponse.json(
        { success: false, error: 'Failed to create program' },
        { status: 500 }
      )
    }

    // Upload images
    const uploadResult = await uploadProgramImages(newProgram.id, imageFiles)
    if (!uploadResult.success) {
      // Rollback: delete the program entry
      await supabase.from('department_programs').delete().eq('id', newProgram.id)
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      )
    }

    // Update program with image URLs
    const { error: updateError } = await supabase
      .from('department_programs')
      .update({ images: uploadResult.urls })
      .eq('id', newProgram.id)

    if (updateError) {
      console.error('Error updating program images:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to save images' },
        { status: 500 }
      )
    }

    // Log activity
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.CREATE,
      entity_type: EntityType.PROGRAM,
      entity_id: newProgram.id,
      details: { department, title },
      ip_address: extractIpAddress(request),
    })

    return NextResponse.json(
      {
        success: true,
        program: { ...newProgram, images: uploadResult.urls },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create program exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
