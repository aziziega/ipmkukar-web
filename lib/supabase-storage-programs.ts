/**
 * Programs Image Storage Utility
 * Handles upload, deletion, and validation of department program images (max 10 per program)
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

const BUCKET_NAME = 'programs'
const MAX_IMAGES = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate program images
 */
export function validateProgramImages(files: File[]): ValidationResult {
  // Check max count
  if (files.length > MAX_IMAGES) {
    return {
      valid: false,
      error: `Maximum ${MAX_IMAGES} images allowed per program`,
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
 * Generate unique filename for program image
 */
export function generateUniqueProgramImageFilename(
  programId: string,
  originalFilename: string,
  index: number
): string {
  const timestamp = Date.now()
  const extension = originalFilename.split('.').pop()
  return `${programId}/${timestamp}_${index}.${extension}`
}

/**
 * Upload program images to Supabase storage
 * @returns Array of public URLs for uploaded images
 */
export async function uploadProgramImages(
  programId: string,
  files: File[]
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    // Validate files
    const validation = validateProgramImages(files)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Upload each file
    const uploadPromises = files.map(async (file, index) => {
      const filename = generateUniqueProgramImageFilename(programId, file.name, index)

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

      return publicUrl
    })

    const urls = await Promise.all(uploadPromises)

    return { success: true, urls }
  } catch (error: any) {
    console.error('Error uploading program images:', error)
    return { success: false, error: error.message || 'Failed to upload images' }
  }
}

/**
 * Delete program images from Supabase storage
 */
export async function deleteProgramImages(
  imageUrls: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (imageUrls.length === 0) {
      return { success: true }
    }

    // Extract file paths from URLs
    const filePaths = imageUrls.map((url) => {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split(`/${BUCKET_NAME}/`)
      return pathParts[1] || ''
    })

    // Filter out empty paths
    const validPaths = filePaths.filter((path) => path.length > 0)

    if (validPaths.length === 0) {
      return { success: true }
    }

    // Delete files
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(validPaths)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting program images:', error)
    return { success: false, error: error.message || 'Failed to delete images' }
  }
}

/**
 * Replace program images (delete old ones and upload new ones)
 */
export async function replaceProgramImages(
  programId: string,
  oldImageUrls: string[],
  newFiles: File[]
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    // Delete old images
    const deleteResult = await deleteProgramImages(oldImageUrls)
    if (!deleteResult.success) {
      return { success: false, error: deleteResult.error }
    }

    // Upload new images
    const uploadResult = await uploadProgramImages(programId, newFiles)
    return uploadResult
  } catch (error: any) {
    console.error('Error replacing program images:', error)
    return { success: false, error: error.message || 'Failed to replace images' }
  }
}

/**
 * Ensure storage bucket exists
 */
export async function ensureProgramBucketExists(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) throw listError

    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME)

    if (!bucketExists) {
      // Create bucket
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: ALLOWED_TYPES,
      })

      if (createError) throw createError
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error ensuring program bucket exists:', error)
    return { success: false, error: error.message || 'Failed to setup storage bucket' }
  }
}
