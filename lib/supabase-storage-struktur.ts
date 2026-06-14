import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'struktur-photos'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/**
 * Position types for organizational structure photos
 */
export type StrukturPhotoPosition = 
  | 'dewan_pengawas_1'
  | 'dewan_pengawas_2'
  | 'ketua_umum'
  | 'wakil_ketua'
  | 'sekretaris'
  | 'bendahara'
  | 'kepala_seni_budaya'
  | 'kepala_sosial_keagamaan'
  | 'kepala_infokom'
  | 'kepala_pengembangan_org'
  | 'kepala_olahraga'
  | 'kepala_kajian_pendidikan'

/**
 * Generate default avatar URL from name using DiceBear API
 * Fallback for positions without photos
 */
export function generateAvatarFromName(name: string): string {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
  
  // Using DiceBear API with initials style
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0a5c3d&textColor=ffffff`
}

/**
 * Validate image file for organizational structure photo upload
 */
export function validateStrukturPhoto(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP image.',
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
    }
  }

  return { valid: true }
}

/**
 * Generate unique filename for organizational structure photo
 */
export function generateUniqueStrukturFilename(
  position: StrukturPhotoPosition,
  originalName: string
): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop() || 'jpg'
  return `${position}-${timestamp}-${randomString}.${extension}`
}

/**
 * Upload organizational structure photo to Supabase Storage
 */
export async function uploadStrukturPhoto(
  file: File,
  filename: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload photo',
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename)

    return {
      success: true,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error('Upload struktur photo exception:', error)
    return {
      success: false,
      error: 'An error occurred during upload',
    }
  }
}

/**
 * Delete organizational structure photo from Supabase Storage
 */
export async function deleteStrukturPhoto(photoUrl: string): Promise<boolean> {
  try {
    // Skip if it's a DiceBear avatar URL
    if (photoUrl.includes('dicebear.com')) {
      return true
    }

    // Extract filename from URL
    const url = new URL(photoUrl)
    const pathParts = url.pathname.split('/')
    const filename = pathParts[pathParts.length - 1]

    if (!filename) {
      console.error('Could not extract filename from URL:', photoUrl)
      return false
    }

    // Delete file from storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filename])

    if (error) {
      console.error('Error deleting struktur photo:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete struktur photo exception:', error)
    return false
  }
}

/**
 * Get public URL for organizational structure photo
 */
export function getStrukturPhotoPublicUrl(filename: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename)
  
  return data.publicUrl
}
