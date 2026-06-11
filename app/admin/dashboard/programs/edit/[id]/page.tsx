"use client"

import { useEffect, useState, use, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Upload, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface DepartmentProgram {
  id: string
  department: string
  title: string
  description: string
  programs: string[]
  images: string[]
  badge_text: string
  badge_color: string
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
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

export default function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

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

  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [keepExistingImages, setKeepExistingImages] = useState(true)

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Fetch existing program
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)

        const response = await fetch(`/api/admin/programs/${id}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch program")
        }

        const program: DepartmentProgram = data.program

        setFormData({
          department: program.department,
          title: program.title,
          description: program.description,
          programs: program.programs,
          badgeText: program.badge_text,
          badgeColor: program.badge_color,
          displayOrder: program.display_order,
          isPublished: program.is_published,
        })

        setExistingImages(program.images)
      } catch (err: any) {
        console.error("Error fetching program:", err)
        setLoadError(err.message || "Failed to load program")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgram()
  }, [id])

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
    if (!keepExistingImages) {
      if (newImageFiles.length === 0) {
        newErrors.images = "At least one image is required"
      } else if (newImageFiles.length > 10) {
        newErrors.images = "Maximum 10 images allowed"
      }
    } else if (existingImages.length === 0 && newImageFiles.length === 0) {
      newErrors.images = "At least one image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    const totalImages = (keepExistingImages ? existingImages.length : 0) + newImageFiles.length + fileArray.length

    if (totalImages > 10) {
      alert("Maximum 10 images allowed in total")
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

    setNewImageFiles((prev) => [...prev, ...fileArray])

    // Create previews
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove new image
  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
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
      formDataToSend.append("keep_existing_images", keepExistingImages.toString())

      // Add new images if any
      newImageFiles.forEach((file, index) => {
        formDataToSend.append(`image_${index}`, file)
      })

      // Submit to API
      const response = await fetch(`/api/admin/programs/${id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Gagal memperbarui program")
      }

      toast({
        title: "Berhasil",
        description: "Program berhasil diperbarui",
      })
      router.push("/admin/dashboard/programs")
    } catch (err: any) {
      console.error("Error updating program:", err)
      const errorMsg = err.message || "Gagal memperbarui program"
      setSubmitError(errorMsg)
      toast({
        title: "Gagal Memperbarui Program",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalImages = (keepExistingImages ? existingImages.length : 0) + newImageFiles.length

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
          <h1 className="text-3xl font-black text-text-primary">Edit Department Program</h1>
          <p className="text-text-secondary mt-2">
            Update department program for the home page
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        )}

        {/* Load Error */}
        {loadError && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Program</h3>
              <p className="text-red-700">{loadError}</p>
              <button
                onClick={() => router.back()}
                className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {!isLoading && !loadError && (
          <>
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

              {/* Images Management */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Images <span className="text-red-500">*</span> (Max 10 total)
                </label>
                
                {/* Keep Existing Images Toggle */}
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={keepExistingImages}
                    onChange={(e) => setKeepExistingImages(e.target.checked)}
                    className="w-5 h-5 text-emerald border-gray-300 rounded focus:ring-emerald"
                  />
                  <span className="text-sm font-semibold text-text-primary">
                    Keep existing images ({existingImages.length})
                  </span>
                </label>

                {/* Existing Images */}
                {keepExistingImages && existingImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Existing Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={totalImages >= 10}
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <label
                    htmlFor="image-upload-edit"
                    className={`flex flex-col items-center justify-center cursor-pointer ${
                      totalImages >= 10 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      {totalImages >= 10
                        ? "Maximum images reached"
                        : "Click to upload new images"}
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, WebP (max 5MB each) - {totalImages}/10 total
                    </p>
                  </label>
                </div>
                {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}

                {/* New Image Previews */}
                {newImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">New Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <Badge className="absolute bottom-2 left-2 bg-blue-600 text-white">
                            New
                          </Badge>
                        </div>
                      ))}
                    </div>
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
                  Edit all main programs for this department (flexible, unlimited items)
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Update Program
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
