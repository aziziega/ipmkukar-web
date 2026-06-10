/**
 * Activities Image Storage Utility
 * Handles upload, deletion, and validation of activity images (max 5 per activity)
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const BUCKET_NAME = 'activities'
const MAX_IMAGES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate activity images
 */
export function validateActivityImages(files: File[]): ValidationResult {
  // Check max count
  if (files.length > MAX_IMAGES) {
    return {
      valid: false,
      error: `Maximum ${MAX_IMAGES} images allowed per activity`,
    }
  }

  // Validate each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `File ${file.name}: Invalid type. Allowed: JPG, PNG, WebP`,
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return {
        valid: false,
        error: `File ${file.name}: Too large (${sizeMB}MB). Maximum 5MB per image`,
      }
    }

    // Check if file is actually an image
    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: `File ${file.name}: Not an image file`,
      }
    }
  }

  return { valid: true }
}

/**
 * Generate unique filename for activity image
 */
export function generateUniqueActivityImageFilename(
  activityId: string,
  originalFilename: string,
  index: number
): string {
  const timestamp = Date.now()
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg'
  return `${activityId}/image-${index + 1}-${timestamp}.${extension}`
}

/**
 * Upload multiple activity images
 * Returns array of public URLs
 */
export async function uploadActivityImages(
  files: File[],
  activityId: string
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    // Validate files first
    const validation = validateActivityImages(files)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    const uploadedUrls: string[] = []

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const filename = generateUniqueActivityImageFilename(
        activityId,
        file.name,
        i
      )

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error(`Error uploading ${file.name}:`, error)
        // Cleanup previously uploaded files on failure
        await deleteActivityImages(uploadedUrls)
        return {
          success: false,
          error: `Failed to upload ${file.name}: ${error.message}`,
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename)

      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    return {
      success: true,
      urls: uploadedUrls,
    }
  } catch (error) {
    console.error('Activity images upload exception:', error)
    return {
      success: false,
      error: 'Failed to upload images',
    }
  }
}

/**
 * Delete a single activity image
 */
export async function deleteActivityImage(
  url: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract filename from URL
    // URL format: https://.../storage/v1/object/public/activities/activity-id/image.jpg
    const urlParts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`)
    if (urlParts.length < 2) {
      return {
        success: false,
        error: 'Invalid image URL format',
      }
    }

    const filename = urlParts[1]

    // Delete from Supabase Storage
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filename])

    if (error) {
      console.error('Error deleting image:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Activity image deletion exception:', error)
    return {
      success: false,
      error: 'Failed to delete image',
    }
  }
}

/**
 * Delete multiple activity images
 * Used when deleting an activity or on upload failure cleanup
 */
export async function deleteActivityImages(
  urls: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!urls || urls.length === 0) {
      return { success: true }
    }

    // Extract filenames from URLs
    const filenames = urls
      .map((url) => {
        const urlParts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`)
        return urlParts.length >= 2 ? urlParts[1] : null
      })
      .filter((filename): filename is string => filename !== null)

    if (filenames.length === 0) {
      return { success: true }
    }

    // Delete all files
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(filenames)

    if (error) {
      console.error('Error deleting images:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Activity images bulk deletion exception:', error)
    return {
      success: false,
      error: 'Failed to delete images',
    }
  }
}

/**
 * Get public URL for an activity image
 */
export function getActivityImagePublicUrl(filename: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename)
  return data.publicUrl
}
