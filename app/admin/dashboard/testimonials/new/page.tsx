"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Loader2, Search, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { kukarDistricts } from "@/lib/kukar-districts"

export default function NewTestimonialPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [district, setDistrict] = useState('')
  const [quote, setQuote] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [districtSearch, setDistrictSearch] = useState('')
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) {
      return ['Tidak ada / Lainnya', ...kukarDistricts]
    }
    const search = districtSearch.toLowerCase()
    const filtered = kukarDistricts.filter(district => 
      district.toLowerCase().includes(search)
    )
    return ['Tidak ada / Lainnya', ...filtered]
  }, [districtSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDistrictDropdownOpen(false)
        setDistrictSearch('')
      }
    }

    if (isDistrictDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDistrictDropdownOpen])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !position.trim() || !quote.trim()) {
      toast({
        title: "Validation Error",
        description: "Name, position, and quote are required",
        variant: "destructive",
      })
      return
    }

    if (quote.length < 10 || quote.length > 500) {
      toast({
        title: "Validation Error",
        description: "Quote must be between 10 and 500 characters",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('position', position.trim())
      formData.append('company', company.trim())
      formData.append('district', district.trim())
      formData.append('quote', quote.trim())
      if (photoFile) {
        formData.append('photo', photoFile)
      }

      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        })
        router.push('/admin/dashboard/testimonials')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating testimonial:', error)
      toast({
        title: "Error",
        description: "Failed to create testimonial",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Testimonial</h1>
          <p className="text-gray-600 mt-1">Add a new testimonial to the homepage</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
          <CardDescription>Fill in the information below to create a new testimonial</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photo">Photo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {photoPreview ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <label htmlFor="photo" className="cursor-pointer">
                      <span className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Upload a photo
                      </span>
                      <span className="text-gray-500"> or leave empty for avatar</span>
                    </label>
                    <input
                      id="photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Square images recommended (400x400px), max 2MB
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                If no photo is uploaded, an avatar will be generated from the name initials
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sarah Chen"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">
                Position/Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Alumni 2020 or Ketua Departemen"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company / Universitas (Optional)</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Universitas Mulawarman, PT. Pupuk Kaltim"
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500">
                Nama perusahaan, universitas, atau organisasi
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Asal Daerah di Kukar (Optional)</Label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between px-4 py-2 text-left border border-gray-300 rounded-lg hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  <span className={district ? "text-gray-900" : "text-gray-500"}>
                    {district || "Cari & pilih kecamatan..."}
                  </span>
                  <Search className="w-4 h-4 text-gray-400" />
                </button>

                {isDistrictDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Cari nama kecamatan..."
                          value={districtSearch}
                          onChange={(e) => setDistrictSearch(e.target.value)}
                          className="pl-9"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="max-h-[280px] overflow-y-auto">
                      {filteredDistricts.length > 0 ? (
                        <div className="py-1">
                          {filteredDistricts.map((districtOption) => (
                            <button
                              key={districtOption}
                              type="button"
                              onClick={() => {
                                setDistrict(districtOption === "Tidak ada / Lainnya" ? "Lainnya" : districtOption)
                                setIsDistrictDropdownOpen(false)
                                setDistrictSearch('')
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{districtOption}</div>
                                <div className="text-sm text-gray-500">Kutai Kartanegara</div>
                              </div>
                              {(district === districtOption || (district === "Lainnya" && districtOption === "Tidak ada / Lainnya")) && (
                                <Check className="w-5 h-5 text-emerald-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          Tidak ada kecamatan yang ditemukan
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                      Total {filteredDistricts.length} kecamatan
                      {districtSearch && ` • Ketik untuk mencari`}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Pilih kecamatan asal di Kutai Kartanegara
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">
                Testimonial Quote <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Write the testimonial quote here..."
                rows={4}
                required
                disabled={isSubmitting}
                maxLength={500}
              />
              <p className="text-sm text-gray-500">
                {quote.length}/500 characters (minimum 10)
              </p>
            </div>

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
                  'Create Testimonial'
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
