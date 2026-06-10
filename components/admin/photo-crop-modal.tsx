"use client"

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { getCroppedImg } from '@/lib/image-crop-utils'

interface PhotoCropModalProps {
  image: string | null
  isOpen: boolean
  onClose: () => void
  onSave: (croppedBlob: Blob) => void
  aspectRatio?: number
}

export function PhotoCropModal({
  image,
  isOpen,
  onClose,
  onSave,
  aspectRatio = 1,
}: PhotoCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    if (!image || !croppedAreaPixels) return

    try {
      setIsSaving(true)
      const croppedBlob = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      )
      onSave(croppedBlob)
      onClose()
    } catch (error) {
      console.error('Error cropping image:', error)
      alert('Failed to crop image. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedAreaPixels(null)
    onClose()
  }

  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop & Adjust Photo</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Drag to reposition and use the slider to zoom in/out
          </p>
        </DialogHeader>

        {/* Cropper Container */}
        <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4 pt-2">
          {/* Zoom Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="zoom" className="text-sm font-medium">
                Zoom
              </Label>
              <span className="text-sm text-gray-500">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <Slider
              id="zoom"
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Rotation Slider (Optional - can be removed if not needed) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rotation" className="text-sm font-medium">
                Rotation
              </Label>
              <span className="text-sm text-gray-500">
                {rotation}°
              </span>
            </div>
            <Slider
              id="rotation"
              value={[rotation]}
              onValueChange={(values) => setRotation(values[0])}
              min={0}
              max={360}
              step={1}
              className="w-full"
            />
          </div>

          {/* Helper Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Drag the image to reposition it within the circle. Use the zoom slider to adjust size for the perfect fit.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !croppedAreaPixels}
          >
            {isSaving ? 'Saving...' : 'Save & Apply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
