"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Upload, X, Trash2 } from "lucide-react"
import { Department, ActivityType } from "@/types/activity"

interface Activity {
  id: string
  title: string
  description: string
  images: string[]
  department: Department
  date: string
  year: number
  type: ActivityType
  participants: number
  location: string
  is_published: boolean
  is_featured: boolean
  created_at: string
}

export default function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activity, setActivity] = useState<Activity | null>(null)

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("")
  const [type, setType] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [participants, setParticipants] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  
  // Image management
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch activity data
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/activities/${id}`)
        if (!response.ok) throw new Error("Failed to fetch activity")

        const data = await response.json()
        const act = data.activity

        setActivity(act)
        setTitle(act.title)
        setDescription(act.description)
        setDepartment(act.department)
        setType(act.type)
        setDate(act.date.split("T")[0]) // Format date for input
        setLocation(act.location)
        setParticipants(act.participants.toString())
        setIsPublished(act.is_published)
        setIsFeatured(act.is_featured)
        setExistingImages(act.images || [])
      } catch (err) {
        console.error("Error fetching activity:", err)
        setError(err instanceof Error ? err.message : "Failed to load activity")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivity()
  }, [id])

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!department) {
      newErrors.department = "Department is required"
    }

    if (!type) {
      newErrors.type = "Type is required"
    }

    if (!date) {
      newErrors.date = "Date is required"
    }

    if (!location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!participants || parseInt(participants) < 0) {
      newErrors.participants = "Valid participant count is required"
    }

    const totalImages = existingImages.length + newImages.length
    if (totalImages > 5) {
      newErrors.images = "Maximum 5 images allowed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle new image upload
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    const totalImages = existingImages.length + newImages.length + fileArray.length

    if (totalImages > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 5 images allowed",
      }))
      return
    }

    // Validate file sizes
    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: `${file.name} exceeds 5MB limit`,
        }))
        return
      }
    }

    // Add new images
    setNewImages((prev) => [...prev, ...fileArray])

    // Generate previews
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    // Clear error
    setErrors((prev) => {
      const { images, ...rest } = prev
      return rest
    })
  }

  // Remove existing image
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Remove new image
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Build form data
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("department", department)
      formData.append("type", type)
      formData.append("date", date)
      formData.append("location", location.trim())
      formData.append("participants", participants)
      formData.append("is_published", isPublished.toString())
      formData.append("is_featured", isFeatured.toString())
      formData.append("existing_images", JSON.stringify(existingImages))

      // Add new images
      newImages.forEach((image, index) => {
        formData.append(`new_image_${index}`, image)
      })

      const response = await fetch(`/api/admin/activities/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update activity")
      }

      // Success - redirect to list
      router.push("/admin/dashboard/activities")
    } catch (err) {
      console.error("Error updating activity:", err)
      setError(err instanceof Error ? err.message : "Failed to update activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete activity
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${activity?.title}"? This will also delete all associated images and cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/activities/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete activity")

      router.push("/admin/dashboard/activities")
    } catch (err) {
      console.error("Error deleting activity:", err)
      alert("Failed to delete activity")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && !activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const totalImages = existingImages.length + newImages.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Activity</h1>
              <p className="text-gray-600 mt-1">
                Update activity details and images
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Activity
          </Button>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter activity title"
                  maxLength={500}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the activity..."
                  rows={4}
                  maxLength={2000}
                  className={errors.description ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">
                  {description.length}/2000 characters
                </p>
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Department & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Department).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-600">{errors.department}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ActivityType).map((activityType) => (
                        <SelectItem key={activityType} value={activityType}>
                          {activityType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={errors.date ? "border-red-500" : ""}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    maxLength={255}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <Label htmlFor="participants">
                  Participants <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="participants"
                  type="number"
                  min="0"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Number of participants"
                  className={errors.participants ? "border-red-500" : ""}
                />
                {errors.participants && (
                  <p className="text-sm text-red-600">{errors.participants}</p>
                )}
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {existingImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && existingImages.length > 0 && newImages.length === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Upload */}
              <div className="space-y-2">
                <Label>
                  Add New Images (Max {5 - existingImages.length} more, {totalImages}/5 total)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleNewImageChange}
                    className="hidden"
                    id="new-image-upload"
                    disabled={totalImages >= 5}
                  />
                  <label
                    htmlFor="new-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {totalImages >= 5 ? "Maximum images reached" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, WebP (max 5MB each)
                    </p>
                  </label>
                </div>
                {errors.images && (
                  <p className="text-sm text-red-600">{errors.images}</p>
                )}

                {/* New Image Previews */}
                {newImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_published"
                    checked={isPublished}
                    onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                  />
                  <Label htmlFor="is_published" className="cursor-pointer">
                    Published (visible on public page)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Featured on landing page
                  </Label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Activity
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  )
}
