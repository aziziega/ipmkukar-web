"use client"

import { use, useState, useEffect } from "react"
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

interface HeroSlide {
  id: string
  title: string
  image_url: string
  order_index: number
  is_active: boolean
}

export default function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id: slideId } = use(params) // Unwrap params Promise for Next.js 15
  
  const [slide, setSlide] = useState<HeroSlide | null>(null)
  const [title, setTitle] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Fetch existing slide data
  useEffect(() => {
    fetchSlide()
  }, [])

  const fetchSlide = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/hero-slides")
      const data = await response.json()

      if (data.success) {
        const foundSlide = data.slides.find((s: HeroSlide) => s.id === slideId)
        if (foundSlide) {
          setSlide(foundSlide)
          setTitle(foundSlide.title)
          setIsActive(foundSlide.is_active)
          setImagePreview(foundSlide.image_url)
        } else {
          toast({
            title: "Not Found",
            description: "Hero slide not found",
            variant: "destructive",
          })
          router.push("/admin/dashboard/hero-slides")
        }
      }
    } catch (error) {
      console.error("Error fetching slide:", error)
      toast({
        title: "Error",
        description: "Failed to load hero slide",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPEG, PNG, or WebP)",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const removeNewImage = () => {
    setImageFile(null)
    setImagePreview(slide?.image_url || null)
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("is_active", isActive.toString())
      
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await fetch(`/api/admin/hero-slides/${slideId}`, {
        method: "PATCH",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Hero slide updated successfully",
        })
        router.push("/admin/dashboard/hero-slides")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update hero slide",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating slide:", error)
      toast({
        title: "Error",
        description: "Failed to update hero slide",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!slide) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Hero Slide</h1>
          <p className="text-gray-600 mt-1">Update slide details or replace image</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slide Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current/New Image */}
            <div className="space-y-2">
              <Label>Image</Label>
              <p className="text-sm text-gray-500">
                {imageFile ? "New image selected" : "Current image (click to replace)"}
              </p>

              <div className="relative">
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {imageFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeNewImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel Replace
                  </Button>
                )}
              </div>

              {!imageFile && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop new image to replace, or
                  </p>
                  <label htmlFor="file-upload">
                    <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium text-sm">
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
              )}
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="title">Alt Text (for accessibility) *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
              />
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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
