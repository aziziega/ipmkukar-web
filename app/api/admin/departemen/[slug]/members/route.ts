import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface MemberInput {
  name: string
  position: 'Kepala Departemen' | 'Anggota'
  photo?: File | null
  nim?: string
  bio?: string
  email?: string
  phone?: string
}

/**
 * POST /api/admin/departemen/[slug]/members
 * Add new member(s) to a department
 * Supports single member or batch entry
 * Requires authentication
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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

    // Parse form data
    const formData = await request.formData()
    
    // Check if batch mode (multiple members)
    const isBatch = formData.get('batch') === 'true'
    
    if (isBatch) {
      // Batch entry mode
      const memberCount = parseInt(formData.get('memberCount') as string || '0')
      const addedMembers = []
      
      for (let i = 0; i < memberCount; i++) {
        const name = formData.get(`members[${i}].name`) as string
        const position = formData.get(`members[${i}].position`) as string
        const nim = formData.get(`members[${i}].nim`) as string
        const photo = formData.get(`members[${i}].photo`) as File | null
        
        if (!name || !position) continue

        // Block creating Kepala - must be managed via Struktur Organisasi
        if (position === 'Kepala Departemen') {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Kepala harus dikelola di Struktur Organisasi',
              message: 'Kepala Departemen dikelola melalui halaman Struktur Organisasi. Silakan edit di /admin/dashboard/struktur/edit'
            },
            { status: 400 }
          )
        }

        // Upload photo if provided
        let photoUrl: string | null = null
        if (photo && photo.size > 0) {
          const fileExt = photo.name.split('.').pop()
          const fileName = `${department.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('department-photos')
            .upload(fileName, photo, {
              contentType: photo.type,
              upsert: false,
            })

          if (uploadError) {
            console.error('Photo upload error:', uploadError)
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('department-photos')
              .getPublicUrl(fileName)
            photoUrl = publicUrl
          }
        }

        // Get max order_index
        const { data: maxOrder } = await supabase
          .from('department_members')
          .select('order_index')
          .eq('department_id', department.id)
          .order('order_index', { ascending: false })
          .limit(1)
          .maybeSingle()

        const orderIndex = (maxOrder?.order_index || 0) + 1

        // Insert member
        const { data: newMember, error: insertError } = await supabase
          .from('department_members')
          .insert({
            department_id: department.id,
            name,
            position,
            photo: photoUrl,
            nim: nim || null,
            order_index: orderIndex,
            is_active: true,
          })
          .select()
          .single()

        if (!insertError && newMember) {
          addedMembers.push(newMember)
        }
      }

      return NextResponse.json(
        { 
          success: true, 
          message: `Added ${addedMembers.length} member(s)`,
          members: addedMembers
        },
        { status: 201 }
      )
      
    } else {
      // Single member mode
      const name = formData.get('name') as string
      const position = formData.get('position') as string
      const nim = formData.get('nim') as string
      const bio = formData.get('bio') as string
      const email = formData.get('email') as string
      const phone = formData.get('phone') as string
      const photo = formData.get('photo') as File | null

      // Validate required fields
      if (!name || !position) {
        return NextResponse.json(
          { success: false, error: 'Name and position are required' },
          { status: 400 }
        )
      }

      // Block creating Kepala - must be managed via Struktur Organisasi
      if (position === 'Kepala Departemen') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Kepala harus dikelola di Struktur Organisasi',
            message: 'Kepala Departemen dikelola melalui halaman Struktur Organisasi. Silakan edit di /admin/dashboard/struktur/edit'
          },
          { status: 400 }
        )
      }

      // Upload photo if provided
      let photoUrl: string | null = null
      if (photo && photo.size > 0) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${department.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
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

      // Get max order_index
      const { data: maxOrder } = await supabase
        .from('department_members')
        .select('order_index')
        .eq('department_id', department.id)
        .order('order_index', { ascending: false })
        .limit(1)
        .maybeSingle()

      const orderIndex = (maxOrder?.order_index || 0) + 1

      // Insert member
      const { data: newMember, error: insertError } = await supabase
        .from('department_members')
        .insert({
          department_id: department.id,
          name,
          position,
          photo: photoUrl,
          nim: nim || null,
          bio: bio || null,
          email: email || null,
          phone: phone || null,
          order_index: orderIndex,
          is_active: true,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        return NextResponse.json(
          { success: false, error: 'Failed to add member' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, message: 'Member added successfully', member: newMember },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Error adding member:', error)
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
