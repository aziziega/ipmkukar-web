"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Upload, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Department } from "@/types/activity"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  department: string
  title: string
  description: string
  programs: string[]
  badgeText: string
  badgeColor: string
  displayOrder: number
  isPublished: boolean
}

interface FormErrors {
  department?: string
  title?: string
  description?: string
  programs?: string
  badgeText?: string
  images?: string
}

const DEPARTMENT_OPTIONS: { value: string; label: string; color: string }[] = [
  {
    value: "Seni dan Budaya",
    label: "Seni dan Budaya",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    value: "Sosial dan Keagamaan",
    label: "Sosial dan Keagamaan",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    value: "Informasi dan Komunikasi",
    label: "Informasi dan Komunikasi",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "Pengembangan Organisasi",
    label: "Pengembangan Organisasi",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "Olahraga",
    label: "Olahraga",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: "Kajian Strategi dan Pendidikan",
    label: "Kajian Strategi dan Pendidikan",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
]

export default function CreateProgramPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    department: "",
    title: "",
    description: "",
    programs: [""],
    badgeText: "",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    displayOrder: 0,
    isPublished: true,
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.department) {
      newErrors.department = "Department is required"
    }

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!formData.badgeText || formData.badgeText.trim().length < 2) {
      newErrors.badgeText = "Badge text is required"
    }

    // Validate programs
    const validPrograms = formData.programs.filter((p) => p.trim().length > 0)
    if (validPrograms.length === 0) {
      newErrors.programs = "At least one program is required"
    }

    // Validate images
    if (imageFiles.length === 0) {
      newErrors.images = "At least one image is required"
    } else if (imageFiles.length > 10) {
      newErrors.images = "Maximum 10 images allowed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    const totalImages = imageFiles.length + fileArray.length

    if (totalImages > 10) {
      alert("Maximum 10 images allowed")
      return
    }

    // Validate file types and sizes
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit`)
        return
      }
    }

    setImageFiles((prev) => [...prev, ...fileArray])

    // Create previews
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove image
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (imageFiles.length >= 10) {
      alert("Maximum 10 images allowed")
      return
    }

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const totalImages = imageFiles.length + fileArray.length

    if (totalImages > 10) {
      alert("Maximum 10 images allowed")
      return
    }

    // Validate file types and sizes
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit`)
        return
      }
    }

    setImageFiles((prev) => [...prev, ...fileArray])

    // Create previews
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Add program item
  const addProgramItem = () => {
    setFormData((prev) => ({
      ...prev,
      programs: [...prev.programs, ""],
    }))
  }

  // Remove program item
  const removeProgramItem = (index: number) => {
    if (formData.programs.length <= 1) {
      alert("At least one program item is required")
      return
    }
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index),
    }))
  }

  // Update program item
  const updateProgramItem = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.map((p, i) => (i === index ? value : p)),
    }))
  }

  // Handle department change
  const handleDepartmentChange = (department: string) => {
    const option = DEPARTMENT_OPTIONS.find((opt) => opt.value === department)
    setFormData((prev) => ({
      ...prev,
      department,
      badgeColor: option?.color || prev.badgeColor,
      badgeText: option?.label || department,
    }))
  }

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon perbaiki error pada form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Prepare form data
      const formDataToSend = new FormData()

      formDataToSend.append("department", formData.department)
      formDataToSend.append("title", formData.title.trim())
      formDataToSend.append("description", formData.description.trim())

      // Filter and add valid programs
      const validPrograms = formData.programs.filter((p) => p.trim().length > 0)
      formDataToSend.append("programs", JSON.stringify(validPrograms))

      formDataToSend.append("badge_text", formData.badgeText.trim())
      formDataToSend.append("badge_color", formData.badgeColor)
      formDataToSend.append("display_order", formData.displayOrder.toString())
      formDataToSend.append("is_published", formData.isPublished.toString())

      // Add images
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`image_${index}`, file)
      })

      // Submit to API
      const response = await fetch("/api/admin/programs", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Gagal membuat program")
      }

      toast({
        title: "Berhasil",
        description: "Program berhasil dibuat",
      })
      router.push("/admin/dashboard/programs")
    } catch (err: any) {
      console.error("Error creating program:", err)
      const errorMsg = err.message || "Gagal membuat program"
      setSubmitError(errorMsg)
      toast({
        title: "Gagal Membuat Program",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-black text-text-primary">Create Department Program</h1>
          <p className="text-text-secondary mt-2">
            Add a new department program for the home page
          </p>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Department Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
            >
              <option value="">Select Department</option>
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Seni dan Budaya Program"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the department and its mission..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Badge Text */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Badge Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.badgeText}
              onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
              placeholder="e.g., Seni & Budaya"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
            />
            {errors.badgeText && (
              <p className="mt-1 text-sm text-red-600">{errors.badgeText}</p>
            )}
            {formData.badgeText && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Preview:</span>
                <Badge className={`ml-2 ${formData.badgeColor}`}>
                  {formData.badgeText}
                </Badge>
              </div>
            )}
          </div>

          {/* Display Order */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
              }
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first on the home page
            </p>
          </div>

          {/* Published Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="w-5 h-5 text-emerald border-gray-300 rounded focus:ring-emerald"
              />
              <span className="text-sm font-semibold text-text-primary">
                Publish to home page
              </span>
            </label>
          </div>

          {/* Images Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Images <span className="text-red-500">*</span> (Max 10)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragging
                  ? "border-emerald bg-emerald-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={imageFiles.length >= 10}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  imageFiles.length >= 10 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload
                  className={`w-12 h-12 mb-3 transition-colors ${
                    isDragging ? "text-emerald" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-sm font-medium mb-1 transition-colors ${
                    isDragging ? "text-emerald-700" : "text-gray-600"
                  }`}
                >
                  {imageFiles.length >= 10
                    ? "Maximum images reached"
                    : isDragging
                    ? "Drop images here"
                    : "Click to upload or drag and drop images"}
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, WebP (max 5MB each) - {imageFiles.length}/10 uploaded
                </p>
              </label>
            </div>
            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 bg-emerald text-white">
                        Cover
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Programs List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-text-primary">
                Program List <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                onClick={addProgramItem}
                className="bg-emerald hover:bg-emerald-darker text-white text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Program
              </Button>
            </div>

            <div className="space-y-3">
              {formData.programs.map((program, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => updateProgramItem(index, e.target.value)}
                    placeholder={`Program ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
                  />
                  {formData.programs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProgramItem(index)}
                      className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.programs && (
              <p className="mt-2 text-sm text-red-600">{errors.programs}</p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Add all main programs for this department (flexible, unlimited items)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald hover:bg-emerald-darker text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Program
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
