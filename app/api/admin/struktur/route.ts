import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth'
import {
  uploadStrukturPhoto,
  validateStrukturPhoto,
  generateUniqueStrukturFilename,
  generateAvatarFromName,
  type StrukturPhotoPosition,
} from '@/lib/supabase-storage-struktur'
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
 * GET /api/admin/struktur
 * Admin only - Fetch active organizational structure
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

    // Fetch active organizational structure
    const { data: structure, error } = await supabase
      .from('organizational_structure')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (acceptable for first time)
      console.error('Error fetching organizational structure:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch organizational structure' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        structure: structure || null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin struktur fetch exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/struktur
 * Admin only - Update organizational structure with photos
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    // Parse form data (multipart/form-data for file uploads)
    const formData = await request.formData()

    // Extract text fields
    const period = formData.get('period') as string
    const dewanPengawas1 = formData.get('dewan_pengawas_1') as string | null
    const dewanPengawas2 = formData.get('dewan_pengawas_2') as string | null
    const ketuaUmum = formData.get('ketua_umum') as string
    const wakilKetua = formData.get('wakil_ketua') as string
    const sekretaris = formData.get('sekretaris') as string
    const bendahara = formData.get('bendahara') as string
    const kepalaSeniBudaya = formData.get('kepala_seni_budaya') as string
    const kepalaSosialKeagamaan = formData.get('kepala_sosial_keagamaan') as string
    const kepalaInfokom = formData.get('kepala_infokom') as string
    const kepalaPengembanganOrg = formData.get('kepala_pengembangan_org') as string
    const kepalaOlahraga = formData.get('kepala_olahraga') as string
    const kepalaKajianPendidikan = formData.get('kepala_kajian_pendidikan') as string

    // Extract photo files
    const dewanPengawas1Photo = formData.get('dewan_pengawas_1_photo') as File | null
    const dewanPengawas2Photo = formData.get('dewan_pengawas_2_photo') as File | null
    const ketuaUmumPhoto = formData.get('ketua_umum_photo') as File | null
    const wakilKetuaPhoto = formData.get('wakil_ketua_photo') as File | null
    const sekretarisPhoto = formData.get('sekretaris_photo') as File | null
    const bendaharaPhoto = formData.get('bendahara_photo') as File | null

    // Validate required fields
    if (!period || !ketuaUmum || !wakilKetua || !sekretaris || !bendahara ||
        !kepalaSeniBudaya || !kepalaSosialKeagamaan || !kepalaInfokom ||
        !kepalaPengembanganOrg || !kepalaOlahraga || !kepalaKajianPendidikan) {
      return NextResponse.json(
        { success: false, error: 'All core positions are required except Dewan Pengawas' },
        { status: 400 }
      )
    }

    // Fetch existing structure FIRST (before photo loop) to preserve existing photos
    const { data: existingStructure } = await supabase
      .from('organizational_structure')
      .select('*')
      .eq('is_active', true)
      .single()

    // Handle photo uploads
    const photoUploads: Array<{
      position: StrukturPhotoPosition
      file: File | null
      name: string
      fieldName: string
    }> = [
      { position: 'dewan_pengawas_1', file: dewanPengawas1Photo, name: dewanPengawas1 || '', fieldName: 'dewan_pengawas_1_photo' },
      { position: 'dewan_pengawas_2', file: dewanPengawas2Photo, name: dewanPengawas2 || '', fieldName: 'dewan_pengawas_2_photo' },
      { position: 'ketua_umum', file: ketuaUmumPhoto, name: ketuaUmum, fieldName: 'ketua_umum_photo' },
      { position: 'wakil_ketua', file: wakilKetuaPhoto, name: wakilKetua, fieldName: 'wakil_ketua_photo' },
      { position: 'sekretaris', file: sekretarisPhoto, name: sekretaris, fieldName: 'sekretaris_photo' },
      { position: 'bendahara', file: bendaharaPhoto, name: bendahara, fieldName: 'bendahara_photo' },
    ]

    const photoUrls: Record<string, string | null> = {}

    for (const upload of photoUploads) {
      if (upload.file && upload.file.size > 0) {
        // Validate photo
        const validation = validateStrukturPhoto(upload.file)
        if (!validation.valid) {
          return NextResponse.json(
            { success: false, error: `${upload.fieldName}: ${validation.error}` },
            { status: 400 }
          )
        }

        // Generate unique filename
        const filename = generateUniqueStrukturFilename(upload.position, upload.file.name)

        // Upload photo
        const uploadResult = await uploadStrukturPhoto(upload.file, filename)
        if (!uploadResult.success) {
          return NextResponse.json(
            { success: false, error: `${upload.fieldName}: ${uploadResult.error}` },
            { status: 500 }
          )
        }

        photoUrls[upload.fieldName] = uploadResult.url!
      } else {
        // No new photo uploaded - check if existing photo exists
        const existingPhotoUrl = existingStructure?.[upload.fieldName as keyof typeof existingStructure] as string | null
        
        if (existingPhotoUrl) {
          // Preserve existing photo
          photoUrls[upload.fieldName] = existingPhotoUrl
        } else if (upload.name && upload.name.trim()) {
          // No existing photo and name exists - generate avatar
          photoUrls[upload.fieldName] = generateAvatarFromName(upload.name.trim())
        } else {
          // No photo and no name - set to null
          photoUrls[upload.fieldName] = null
        }
      }
    }


    const structureData = {
      period: period.trim(),
      dewan_pengawas_1: dewanPengawas1?.trim() || null,
      dewan_pengawas_2: dewanPengawas2?.trim() || null,
      ketua_umum: ketuaUmum.trim(),
      wakil_ketua: wakilKetua.trim(),
      sekretaris: sekretaris.trim(),
      bendahara: bendahara.trim(),
      kepala_seni_budaya: kepalaSeniBudaya.trim(),
      kepala_sosial_keagamaan: kepalaSosialKeagamaan.trim(),
      kepala_infokom: kepalaInfokom.trim(),
      kepala_pengembangan_org: kepalaPengembanganOrg.trim(),
      kepala_olahraga: kepalaOlahraga.trim(),
      kepala_kajian_pendidikan: kepalaKajianPendidikan.trim(),
      dewan_pengawas_1_photo: photoUrls.dewan_pengawas_1_photo,
      dewan_pengawas_2_photo: photoUrls.dewan_pengawas_2_photo,
      ketua_umum_photo: photoUrls.ketua_umum_photo,
      wakil_ketua_photo: photoUrls.wakil_ketua_photo,
      sekretaris_photo: photoUrls.sekretaris_photo,
      bendahara_photo: photoUrls.bendahara_photo,
      is_active: true,
      updated_by: authResult.user?.id,
      updated_at: new Date().toISOString(),
    }

    let updatedStructure

    if (existingStructure) {
      // Update existing structure
      const { data, error } = await supabase
        .from('organizational_structure')
        .update(structureData)
        .eq('id', existingStructure.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating organizational structure:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to update organizational structure' },
          { status: 500 }
        )
      }

      updatedStructure = data
    } else {
      // Create new structure
      const { data, error } = await supabase
        .from('organizational_structure')
        .insert(structureData)
        .select()
        .single()

      if (error) {
        console.error('Error creating organizational structure:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to create organizational structure' },
          { status: 500 }
        )
      }

      updatedStructure = data
    }

    // Log activity
    const ipAddress = extractIpAddress(request)
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: existingStructure ? ActivityAction.UPDATE : ActivityAction.CREATE,
      entity_type: EntityType.ORGANIZATIONAL_STRUCTURE,
      entity_id: updatedStructure.id,
      details: { period: period.trim(), action: existingStructure ? 'update' : 'create' },
      ip_address: ipAddress || undefined,
    })

    return NextResponse.json(
      {
        success: true,
        structure: updatedStructure,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Struktur update exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/struktur
 * Admin only - Delete organizational structure
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    // Fetch existing structure
    const { data: existingStructure, error: fetchError } = await supabase
      .from('organizational_structure')
      .select('*')
      .eq('is_active', true)
      .single()

    if (fetchError || !existingStructure) {
      return NextResponse.json(
        { success: false, error: 'No active organizational structure found' },
        { status: 404 }
      )
    }

    // Delete the structure
    const { error: deleteError } = await supabase
      .from('organizational_structure')
      .delete()
      .eq('id', existingStructure.id)

    if (deleteError) {
      console.error('Error deleting organizational structure:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete organizational structure' },
        { status: 500 }
      )
    }

    // Log activity
    const ipAddress = extractIpAddress(request)
    await logActivity(supabase, {
      user_id: authResult.user!.id,
      action: ActivityAction.DELETE,
      entity_type: EntityType.ORGANIZATIONAL_STRUCTURE,
      entity_id: existingStructure.id,
      details: { period: existingStructure.period },
      ip_address: ipAddress || undefined,
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Struktur delete exception:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
