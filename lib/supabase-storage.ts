import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Storage bucket name
const HERO_SLIDES_BUCKET = 'hero-slides'

/**
 * Upload an image to Supabase Storage
 * @param file - File object or Buffer
 * @param filename - Unique filename (should include extension)
 * @returns Public URL of uploaded image
 */
export async function uploadHeroImage(
  file: File | Buffer,
  filename: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(HERO_SLIDES_BUCKET)
      .upload(filename, file, {
        contentType: file instanceof File ? file.type : 'image/jpeg',
        cacheControl: '3600',
        upsert: false, // Don't overwrite existing files
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(HERO_SLIDES_BUCKET)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error('Upload exception:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - Full public URL of the image
 * @returns Success status
 */
export async function deleteHeroImage(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract filename from URL
    // URL format: https://.../storage/v1/object/public/hero-slides/filename.jpg
    const urlParts = imageUrl.split(`${HERO_SLIDES_BUCKET}/`)
    if (urlParts.length < 2) {
      return { success: false, error: 'Invalid image URL format' }
    }

    const filename = urlParts[1]

    // Delete from storage
    const { error } = await supabase.storage
      .from(HERO_SLIDES_BUCKET)
      .remove([filename])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete exception:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}

/**
 * Generate a unique filename for uploaded image
 * @param originalName - Original filename from upload
 * @returns Unique filename with UUID prefix
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop() || 'jpg'
  const sanitizedExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '')

  return `${timestamp}-${randomString}.${sanitizedExtension}`
}

/**
 * Validate image file type
 * @param file - File to validate
 * @returns Validation result
 */
export function validateImageFile(
  file: File
): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit.',
    }
  }

  return { valid: true }
}

/**
 * Get public URL for an image in storage
 * @param filename - Filename in storage
 * @returns Public URL
 */
export function getHeroImagePublicUrl(filename: string): string {
  const { data } = supabase.storage
    .from(HERO_SLIDES_BUCKET)
    .getPublicUrl(filename)

  return data.publicUrl
}
