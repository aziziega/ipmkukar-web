import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * PUT /api/admin/departemen/[slug]/members/[id]
 * Update existing member
 * Requires authentication
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { slug, id } = await params

    // Get department
    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('id, name')
      .eq('slug', slug)
      .single()

    if (deptError || !department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Get existing member
    const { data: existingMember, error: memberError } = await supabase
      .from('department_members')
      .select('*')
      .eq('id', id)
      .eq('department_id', department.id)
      .single()

    if (memberError || !existingMember) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const position = formData.get('position') as string
    const nim = formData.get('nim') as string
    const bio = formData.get('bio') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const photo = formData.get('photo') as File | null
    const deletePhoto = formData.get('deletePhoto') === 'true'

    // Validate required fields
    if (!name || !position) {
      return NextResponse.json(
        { success: false, error: 'Name and position are required' },
        { status: 400 }
      )
    }

    // If changing to Kepala, check if another Kepala exists
    if (position === 'Kepala Departemen' && existingMember.position !== 'Kepala Departemen') {
      const { data: otherKepala } = await supabase
        .from('department_members')
        .select('id')
        .eq('department_id', department.id)
        .eq('position', 'Kepala Departemen')
        .eq('is_active', true)
        .neq('id', id)
        .maybeSingle()

      if (otherKepala) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Kepala already exists',
            message: `${department.name} already has a Kepala. Please remove the existing one first.`
          },
          { status: 400 }
        )
      }
    }

    // Handle photo update
    let photoUrl = existingMember.photo

    // Delete existing photo if requested
    if (deletePhoto && existingMember.photo) {
      try {
        const photoPath = existingMember.photo.split('/department-photos/')[1]
        if (photoPath) {
          await supabase.storage.from('department-photos').remove([photoPath])
        }
      } catch (error) {
        console.error('Error deleting old photo:', error)
      }
      photoUrl = null
    }

    // Upload new photo if provided
    if (photo && photo.size > 0) {
      // Delete old photo first
      if (existingMember.photo && !deletePhoto) {
        try {
          const photoPath = existingMember.photo.split('/department-photos/')[1]
          if (photoPath) {
            await supabase.storage.from('department-photos').remove([photoPath])
          }
        } catch (error) {
          console.error('Error deleting old photo:', error)
        }
      }

      // Upload new photo
      const fileExt = photo.name.split('.').pop()
      const fileName = `${department.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('department-photos')
        .upload(fileName, photo, {
          contentType: photo.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Photo upload error:', uploadError)
        return NextResponse.json(
          { success: false, error: 'Failed to upload photo' },
          { status: 500 }
        )
      }

      const { data: { publicUrl } } = supabase.storage
        .from('department-photos')
        .getPublicUrl(fileName)
      photoUrl = publicUrl
    }

    // Update member
    const { data: updatedMember, error: updateError } = await supabase
      .from('department_members')
      .update({
        name,
        position,
        photo: photoUrl,
        nim: nim || null,
        bio: bio || null,
        email: email || null,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update member' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Member updated successfully', member: updatedMember },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/departemen/[slug]/members/[id]
 * Delete member (soft delete by setting is_active to false)
 * Requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { slug, id } = await params

    // Get department
    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('id')
      .eq('slug', slug)
      .single()

    if (deptError || !department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Get member
    const { data: member, error: memberError } = await supabase
      .from('department_members')
      .select('id, photo')
      .eq('id', id)
      .eq('department_id', department.id)
      .single()

    if (memberError || !member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      )
    }

    // Soft delete member
    const { error: deleteError } = await supabase
      .from('department_members')
      .update({ is_active: false })
      .eq('id', id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete member' },
        { status: 500 }
      )
    }

    // Optionally delete photo from storage
    if (member.photo) {
      try {
        const photoPath = member.photo.split('/department-photos/')[1]
        if (photoPath) {
          await supabase.storage.from('department-photos').remove([photoPath])
        }
      } catch (error) {
        console.error('Error deleting photo:', error)
        // Continue even if photo delete fails
      }
    }

    return NextResponse.json(
      { success: true, message: 'Member deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
