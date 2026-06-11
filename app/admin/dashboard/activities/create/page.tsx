"use client"

import { useState } from "react"
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
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react"
import { Department, ActivityType } from "@/types/activity"

export default function CreateActivityPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    } else {
      // Validate DD/MM/YYYY format
      const dateParts = date.split('/')
      if (dateParts.length !== 3) {
        newErrors.date = "Date must be in DD/MM/YYYY format"
      } else {
        const [day, month, year] = dateParts
        const dayNum = parseInt(day)
        const monthNum = parseInt(month)
        const yearNum = parseInt(year)
        
        if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
          newErrors.date = "Invalid date format"
        } else if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
          newErrors.date = "Date must be in DD/MM/YYYY format (e.g., 25/12/2024)"
        } else if (dayNum < 1 || dayNum > 31) {
          newErrors.date = "Day must be between 01 and 31"
        } else if (monthNum < 1 || monthNum > 12) {
          newErrors.date = "Month must be between 01 and 12"
        } else if (yearNum < 1900 || yearNum > 2100) {
          newErrors.date = "Year must be between 1900 and 2100"
        } else {
          // Validate actual date (e.g., not 31/02/2024)
          const testDate = new Date(yearNum, monthNum - 1, dayNum)
          if (testDate.getDate() !== dayNum || testDate.getMonth() !== monthNum - 1 || testDate.getFullYear() !== yearNum) {
            newErrors.date = "Invalid date (e.g., 31/02/2024 doesn't exist)"
          }
        }
      }
    }

    if (!location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!participants || parseInt(participants) < 0) {
      newErrors.participants = "Valid participant count is required"
    }

    if (images.length > 5) {
      newErrors.images = "Maximum 5 images allowed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Format date input as DD/MM/YYYY
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // Remove non-digits
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2)
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5)
    }
    if (value.length > 10) {
      value = value.slice(0, 10)
    }
    
    setDate(value)
  }

  // Convert DD/MM/YYYY to YYYY-MM-DD for API
  const formatDateForAPI = (dateStr: string): string => {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return dateStr
  }

  // Handle image upload (shared by click and drag-drop)
  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const fileArray = Array.from(fileList)
    const totalImages = images.length + fileArray.length

    if (totalImages > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 5 images allowed",
      }))
      return
    }

    // Validate file sizes and types
    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: `${file.name} exceeds 5MB limit`,
        }))
        return
      }
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          images: `${file.name} is not an image file`,
        }))
        return
      }
    }

    // Add new images
    setImages((prev) => [...prev, ...fileArray])

    // Generate previews
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    // Clear error
    setErrors((prev) => {
      const { images, ...rest } = prev
      return rest
    })
  }

  // Handle image upload from file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    processFiles(files)
  }

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
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
      formData.append("date", formatDateForAPI(date))
      formData.append("location", location.trim())
      formData.append("participants", participants)
      formData.append("is_published", isPublished.toString())
      formData.append("is_featured", isFeatured.toString())

      // Add images
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image)
      })

      const response = await fetch("/api/admin/activities", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create activity")
      }

      // Success - redirect to list
      router.push("/admin/dashboard/activities")
    } catch (err) {
      console.error("Error creating activity:", err)
      setError(err instanceof Error ? err.message : "Failed to create activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buat Kegiatan</h1>
            <p className="text-gray-600 mt-1">
              Tambahkan kegiatan, acara, atau program organisasi baru
            </p>
          </div>
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
              <CardTitle>Detail Kegiatan</CardTitle>
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
                  Judul <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul kegiatan"
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
                  Deskripsi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kegiatan..."
                  rows={4}
                  maxLength={2000}
                  className={errors.description ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">
                  {description.length}/2000 karakter
                </p>
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Department & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">
                    Departemen <span className="text-red-500">*</span>
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih departemen" />
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
                    Tipe <span className="text-red-500">*</span>
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih tipe" />
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
                    Tanggal <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="text"
                    value={date}
                    onChange={handleDateChange}
                    placeholder="Tanggal/Bulan/Tahun"
                    maxLength={10}
                    className={errors.date ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-gray-500">
                    Contoh: 25/12/2024
                  </p>
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Lokasi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Masukkan lokasi"
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
                  Peserta <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="participants"
                  type="number"
                  min="0"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Jumlah peserta"
                  className={errors.participants ? "border-red-500" : ""}
                />
                {errors.participants && (
                  <p className="text-sm text-red-600">{errors.participants}</p>
                )}
              </div>

              {/* Images Upload */}
              <div className="space-y-2">
                <Label>
                  Gambar (Maks 5, 5MB per gambar)
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging 
                      ? 'border-emerald bg-emerald/5' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= 5}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className={`w-12 h-12 mb-2 ${
                      isDragging ? 'text-emerald' : 'text-gray-400'
                    }`} />
                    <p className="text-sm text-gray-600 mb-1">
                      {isDragging ? 'Lepaskan file di sini' : 'Klik untuk upload atau drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, WebP (maks 5MB per gambar)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {images.length}/5 gambar ter-upload
                    </p>
                  </label>
                </div>
                {errors.images && (
                  <p className="text-sm text-red-600">{errors.images}</p>
                )}

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Sampul
                          </div>
                        )}
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
                    Publikasikan langsung (terlihat di halaman publik)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Tampilkan di landing page (sorot kegiatan ini)
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
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Membuat...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Buat Kegiatan
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
