"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Loader2, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function NewHeroSlidePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [title, setTitle] = useState("")
  const [orderIndex, setOrderIndex] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPEG, PNG, or WebP)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Remove selected image
  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please select an image for the hero slide",
        variant: "destructive",
      })
      return
    }

    if (!title.trim() || title.trim().length < 3) {
      toast({
        title: "Invalid Title",
        description: "Alt text must be at least 3 characters",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Create form data
      const formData = new FormData()
      formData.append("image", imageFile)
      formData.append("title", title.trim())
      formData.append("order_index", orderIndex || "0")
      formData.append("is_active", isActive.toString())

      // Submit to API
      const response = await fetch("/api/admin/hero-slides", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Hero slide created successfully",
        })
        router.push("/admin/dashboard/hero-slides")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create hero slide",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating slide:", error)
      toast({
        title: "Error",
        description: "Failed to create hero slide",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Hero Slide</h1>
          <p className="text-gray-600 mt-1">Upload a new background image for the hero section</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Slide Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image *</Label>
              <p className="text-sm text-gray-500">
                Recommended: 1920x1080px or similar. Max 5MB. Formats: JPEG, PNG, WebP
              </p>

              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your image here, or
                  </p>
                  <label htmlFor="file-upload">
                    <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium">
                      browse files
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Alt Text / Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Alt Text (for accessibility) *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., IPM Kukar members at gathering event"
                required
                minLength={3}
              />
              <p className="text-sm text-gray-500">
                Describe the image for screen readers
              </p>
            </div>

            {/* Order Index */}
            <div className="space-y-2">
              <Label htmlFor="order">Display Order (optional)</Label>
              <Input
                id="order"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                placeholder="Leave empty to auto-assign"
                min={1}
              />
              <p className="text-sm text-gray-500">
                Lower numbers appear first
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="active">Active Status</Label>
                <p className="text-sm text-gray-500">
                  Only active slides are displayed on the homepage
                </p>
              </div>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Hero Slide"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
