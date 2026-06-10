/**
 * Image Cropping Utilities
 * Helper functions for cropping and processing images client-side
 */

/**
 * Creates an HTMLImageElement from a URL/data URL
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // Avoid CORS issues
    image.src = url
  })
}

/**
 * Gets radians from degrees
 */
export function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * Crops an image based on the crop area and returns a Blob
 * 
 * @param imageSrc - The source image URL or data URL
 * @param pixelCrop - The crop area in pixels {x, y, width, height}
 * @param rotation - Rotation angle in degrees (default: 0)
 * @param flip - Flip options {horizontal, vertical} (default: {horizontal: false, vertical: false})
 * @returns Promise that resolves to the cropped image as a Blob
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: {
    x: number
    y: number
    width: number
    height: number
  },
  rotation: number = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas 2d context')
  }

  const rotRad = getRadianAngle(rotation)

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // Translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // Draw rotated image
  ctx.drawImage(image, 0, 0)

  // Create another canvas for the final cropped image
  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    throw new Error('Failed to get cropped canvas 2d context')
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // Return as a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Canvas is empty or failed to create blob'))
      }
    }, 'image/jpeg', 0.95) // High quality JPEG
  })
}

/**
 * Converts a Blob to a File object
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  })
}

/**
 * Gets the dimensions of an image from a URL
 */
export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  const img = await createImage(url)
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
  }
}
