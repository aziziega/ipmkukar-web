"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, X, Upload, User, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { PhotoCropModal } from "@/components/admin/photo-crop-modal"
import { blobToFile } from "@/lib/image-crop-utils"

interface OrganizationalStructure {
  id: string
  period: string
  dewan_pengawas_1: string | null
  dewan_pengawas_2: string | null
  ketua_umum: string
  wakil_ketua: string
  sekretaris: string
  bendahara: string
  kepala_seni_budaya: string
  kepala_sosial_keagamaan: string
  kepala_infokom: string
  kepala_pengembangan_org: string
  kepala_olahraga: string
  kepala_kajian_pendidikan: string
  dewan_pengawas_1_photo: string | null
  dewan_pengawas_2_photo: string | null
  ketua_umum_photo: string | null
  wakil_ketua_photo: string | null
  sekretaris_photo: string | null
  bendahara_photo: string | null
}

export default function EditStrukturPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form fields
  const [period, setPeriod] = useState('')
  const [dewanPengawas1, setDewanPengawas1] = useState('')
  const [dewanPengawas2, setDewanPengawas2] = useState('')
  const [ketuaUmum, setKetuaUmum] = useState('')
  const [wakilKetua, setWakilKetua] = useState('')
  const [sekretaris, setSekretaris] = useState('')
  const [bendahara, setBendahara] = useState('')
  const [kepalaSeniBudaya, setKepalaSeniBudaya] = useState('')
  const [kepalaSosialKeagamaan, setKepalaSosialKeagamaan] = useState('')
  const [kepalaInfokom, setKepalaInfokom] = useState('')
  const [kepalaPengembanganOrg, setKepalaPengembanganOrg] = useState('')
  const [kepalaOlahraga, setKepalaOlahraga] = useState('')
  const [kepalaKajianPendidikan, setKepalaKajianPendidikan] = useState('')

  // Photo files
  const [dewanPengawas1Photo, setDewanPengawas1Photo] = useState<File | null>(null)
  const [dewanPengawas2Photo, setDewanPengawas2Photo] = useState<File | null>(null)
  const [ketuaUmumPhoto, setKetuaUmumPhoto] = useState<File | null>(null)
  const [wakilKetuaPhoto, setWakilKetuaPhoto] = useState<File | null>(null)
  const [sekretarisPhoto, setSekretarisPhoto] = useState<File | null>(null)
  const [bendaharaPhoto, setBendaharaPhoto] = useState<File | null>(null)

  // Photo previews (existing URLs)
  const [dewanPengawas1PhotoPreview, setDewanPengawas1PhotoPreview] = useState<string | null>(null)
  const [dewanPengawas2PhotoPreview, setDewanPengawas2PhotoPreview] = useState<string | null>(null)
  const [ketuaUmumPhotoPreview, setKetuaUmumPhotoPreview] = useState<string | null>(null)
  const [wakilKetuaPhotoPreview, setWakilKetuaPhotoPreview] = useState<string | null>(null)
  const [sekretarisPhotoPreview, setSekretarisPhotoPreview] = useState<string | null>(null)
  const [bendaharaPhotoPreview, setBendaharaPhotoPreview] = useState<string | null>(null)

  // Crop modal state
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [currentCropImage, setCurrentCropImage] = useState<string | null>(null)
  const [currentCropPosition, setCurrentCropPosition] = useState<string | null>(null)

  useEffect(() => {
    fetchStructure()
  }, [])

  const fetchStructure = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/struktur')
      const data = await response.json()

      if (data.success && data.structure) {
        const s = data.structure
        setPeriod(s.period || '')
        setDewanPengawas1(s.dewan_pengawas_1 || '')
        setDewanPengawas2(s.dewan_pengawas_2 || '')
        setKetuaUmum(s.ketua_umum || '')
        setWakilKetua(s.wakil_ketua || '')
        setSekretaris(s.sekretaris || '')
        setBendahara(s.bendahara || '')
        setKepalaSeniBudaya(s.kepala_seni_budaya || '')
        setKepalaSosialKeagamaan(s.kepala_sosial_keagamaan || '')
        setKepalaInfokom(s.kepala_infokom || '')
        setKepalaPengembanganOrg(s.kepala_pengembangan_org || '')
        setKepalaOlahraga(s.kepala_olahraga || '')
        setKepalaKajianPendidikan(s.kepala_kajian_pendidikan || '')

        // Set photo previews
        setDewanPengawas1PhotoPreview(s.dewan_pengawas_1_photo)
        setDewanPengawas2PhotoPreview(s.dewan_pengawas_2_photo)
        setKetuaUmumPhotoPreview(s.ketua_umum_photo)
        setWakilKetuaPhotoPreview(s.wakil_ketua_photo)
        setSekretarisPhotoPreview(s.sekretaris_photo)
        setBendaharaPhotoPreview(s.bendahara_photo)
      }
    } catch (error) {
      console.error('Error fetching structure:', error)
      toast({
        title: "Error",
        description: "Failed to load organizational structure",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPhoto: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      // Create preview URL for new upload
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditPhoto = (imageUrl: string, position: string) => {
    setCurrentCropImage(imageUrl)
    setCurrentCropPosition(position)
    setIsCropModalOpen(true)
  }

  const handleSaveCrop = (croppedBlob: Blob) => {
    if (!currentCropPosition) return

    const fileName = `${currentCropPosition}-${Date.now()}.jpg`
    const croppedFile = blobToFile(croppedBlob, fileName)
    const previewUrl = URL.createObjectURL(croppedBlob)

    // Update the correct photo and preview based on position
    switch (currentCropPosition) {
      case 'dewan_pengawas_1':
        setDewanPengawas1Photo(croppedFile)
        setDewanPengawas1PhotoPreview(previewUrl)
        break
      case 'dewan_pengawas_2':
        setDewanPengawas2Photo(croppedFile)
        setDewanPengawas2PhotoPreview(previewUrl)
        break
      case 'ketua_umum':
        setKetuaUmumPhoto(croppedFile)
        setKetuaUmumPhotoPreview(previewUrl)
        break
      case 'wakil_ketua':
        setWakilKetuaPhoto(croppedFile)
        setWakilKetuaPhotoPreview(previewUrl)
        break
      case 'sekretaris':
        setSekretarisPhoto(croppedFile)
        setSekretarisPhotoPreview(previewUrl)
        break
      case 'bendahara':
        setBendaharaPhoto(croppedFile)
        setBendaharaPhotoPreview(previewUrl)
        break
    }
  }

  const handleDeletePhoto = (position: string) => {
    // Clear both the photo file and preview based on position
    switch (position) {
      case 'dewan_pengawas_1':
        setDewanPengawas1Photo(null)
        setDewanPengawas1PhotoPreview(null)
        break
      case 'dewan_pengawas_2':
        setDewanPengawas2Photo(null)
        setDewanPengawas2PhotoPreview(null)
        break
      case 'ketua_umum':
        setKetuaUmumPhoto(null)
        setKetuaUmumPhotoPreview(null)
        break
      case 'wakil_ketua':
        setWakilKetuaPhoto(null)
        setWakilKetuaPhotoPreview(null)
        break
      case 'sekretaris':
        setSekretarisPhoto(null)
        setSekretarisPhotoPreview(null)
        break
      case 'bendahara':
        setBendaharaPhoto(null)
        setBendaharaPhotoPreview(null)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!period.trim()) {
      toast({
        title: "Validation Error",
        description: "Period is required",
        variant: "destructive",
      })
      return
    }

    if (!ketuaUmum.trim() || !wakilKetua.trim() || !sekretaris.trim() || !bendahara.trim()) {
      toast({
        title: "Validation Error",
        description: "All Pengurus Harian positions are required",
        variant: "destructive",
      })
      return
    }

    if (!kepalaSeniBudaya.trim() || !kepalaSosialKeagamaan.trim() || !kepalaInfokom.trim() ||
      !kepalaPengembanganOrg.trim() || !kepalaOlahraga.trim() || !kepalaKajianPendidikan.trim()) {
      toast({
        title: "Validation Error",
        description: "All Departemen heads are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      // Build FormData
      const formData = new FormData()
      formData.append('period', period.trim())
      formData.append('dewan_pengawas_1', dewanPengawas1.trim())
      formData.append('dewan_pengawas_2', dewanPengawas2.trim())
      formData.append('ketua_umum', ketuaUmum.trim())
      formData.append('wakil_ketua', wakilKetua.trim())
      formData.append('sekretaris', sekretaris.trim())
      formData.append('bendahara', bendahara.trim())
      formData.append('kepala_seni_budaya', kepalaSeniBudaya.trim())
      formData.append('kepala_sosial_keagamaan', kepalaSosialKeagamaan.trim())
      formData.append('kepala_infokom', kepalaInfokom.trim())
      formData.append('kepala_pengembangan_org', kepalaPengembanganOrg.trim())
      formData.append('kepala_olahraga', kepalaOlahraga.trim())
      formData.append('kepala_kajian_pendidikan', kepalaKajianPendidikan.trim())

      // Append photos
      if (dewanPengawas1Photo) formData.append('dewan_pengawas_1_photo', dewanPengawas1Photo)
      if (dewanPengawas2Photo) formData.append('dewan_pengawas_2_photo', dewanPengawas2Photo)
      if (ketuaUmumPhoto) formData.append('ketua_umum_photo', ketuaUmumPhoto)
      if (wakilKetuaPhoto) formData.append('wakil_ketua_photo', wakilKetuaPhoto)
      if (sekretarisPhoto) formData.append('sekretaris_photo', sekretarisPhoto)
      if (bendaharaPhoto) formData.append('bendahara_photo', bendaharaPhoto)

      const response = await fetch('/api/admin/struktur', {
        method: 'PUT',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Organizational structure updated successfully",
        })
        router.push('/admin/dashboard/struktur')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update organizational structure",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving structure:', error)
      toast({
        title: "Error",
        description: "Failed to save organizational structure",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Struktur Organisasi</h1>
          <p className="text-gray-600 mt-1">Update organizational structure and leadership</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Period */}
        <Card>
          <CardHeader>
            <CardTitle>Period Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="period">Period *</Label>
              <Input
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g., 2024-2025"
                required
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">Format: YYYY/YYYY</p>
            </div>
          </CardContent>
        </Card>

        {/* Dewan Pengawas */}
        <Card>
          <CardHeader>
            <CardTitle>Dewan Pengawas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dewan Pengawas 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dewan_pengawas_1">Dewan Pengawas 1</Label>
                <Input
                  id="dewan_pengawas_1"
                  value={dewanPengawas1}
                  onChange={(e) => setDewanPengawas1(e.target.value)}
                  placeholder="Full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dewan_pengawas_1_photo">Photo</Label>
                <div className="mt-1">
                  <Input
                    id="dewan_pengawas_1_photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handlePhotoChange(e, setDewanPengawas1Photo, setDewanPengawas1PhotoPreview)}
                    className="cursor-pointer"
                  />
                  {dewanPengawas1PhotoPreview && (
                    <div className="mt-2 space-y-2">
                      <Image
                        src={dewanPengawas1PhotoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPhoto(dewanPengawas1PhotoPreview, 'dewan_pengawas_1')}
                          className="flex-1"
                        >
                          {dewanPengawas1Photo ? 'Re-crop' : 'Edit'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePhoto('dewan_pengawas_1')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dewan Pengawas 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dewan_pengawas_2">Dewan Pengawas 2</Label>
                <Input
                  id="dewan_pengawas_2"
                  value={dewanPengawas2}
                  onChange={(e) => setDewanPengawas2(e.target.value)}
                  placeholder="Full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dewan_pengawas_2_photo">Photo</Label>
                <div className="mt-1">
                  <Input
                    id="dewan_pengawas_2_photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handlePhotoChange(e, setDewanPengawas2Photo, setDewanPengawas2PhotoPreview)}
                    className="cursor-pointer"
                  />
                  {dewanPengawas2PhotoPreview && (
                    <div className="mt-2 space-y-2">
                      <Image
                        src={dewanPengawas2PhotoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPhoto(dewanPengawas2PhotoPreview, 'dewan_pengawas_2')}
                          className="flex-1"
                        >
                          {dewanPengawas2Photo ? 'Re-crop' : 'Edit'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePhoto('dewan_pengawas_2')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pengurus Harian */}
        <Card>
          <CardHeader>
            <CardTitle>Pengurus Harian *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ketua Umum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ketua_umum">Ketua Umum *</Label>
                <Input
                  id="ketua_umum"
                  value={ketuaUmum}
                  onChange={(e) => setKetuaUmum(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ketua_umum_photo">Photo</Label>
                <div className="mt-1">
                  <Input
                    id="ketua_umum_photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handlePhotoChange(e, setKetuaUmumPhoto, setKetuaUmumPhotoPreview)}
                    className="cursor-pointer"
                  />
                  {ketuaUmumPhotoPreview && (
                    <div className="mt-2 space-y-2">
                      <Image
                        src={ketuaUmumPhotoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPhoto(ketuaUmumPhotoPreview, 'ketua_umum')}
                          className="flex-1"
                        >
                          {ketuaUmumPhoto ? 'Re-crop' : 'Edit'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePhoto('ketua_umum')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Wakil Ketua */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wakil_ketua">Wakil Ketua *</Label>
                <Input
                  id="wakil_ketua"
                  value={wakilKetua}
                  onChange={(e) => setWakilKetua(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="wakil_ketua_photo">Photo</Label>
                <div className="mt-1">
                  <Input
                    id="wakil_ketua_photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handlePhotoChange(e, setWakilKetuaPhoto, setWakilKetuaPhotoPreview)}
                    className="cursor-pointer"
                  />
                  {wakilKetuaPhotoPreview && (
                    <div className="mt-2 space-y-2">
                      <Image
                        src={wakilKetuaPhotoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPhoto(wakilKetuaPhotoPreview, 'wakil_ketua')}
                          className="flex-1"
                        >
                          {wakilKetuaPhoto ? 'Re-crop' : 'Edit'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePhoto('wakil_ketua')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sekretaris */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sekretaris">Sekretaris *</Label>
                <Input
                  id="sekretaris"
                  value={sekretaris}
                  onChange={(e) => setSekretaris(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sekretaris_photo">Photo</Label>
                <div className="mt-1">
                  <Input
                    id="sekretaris_photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handlePhotoChange(e, setSekretarisPhoto, setSekretarisPhotoPreview)}
                    className="cursor-pointer"
                  />
                  {sekretarisPhotoPreview && (
                    <div className="mt-2 space-y-2">
                      <Image
                        src={sekretarisPhotoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPhoto(sekretarisPhotoPreview, 'sekretaris')}
                          className="flex-1"
                        >
                          {sekretarisPhoto ? 'Re-crop' : 'Edit'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePhoto('sekretaris')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bendahara */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bendahara">Bendahara *</Label>
                <Input
                  id="bendahara"
                  value={bendahara}
                  onChange={(e) => setBendahara(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bendahara_photo">Photo</Label>
                <div className="mt-1">
                  <Input
                    id="bendahara_photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handlePhotoChange(e, setBendaharaPhoto, setBendaharaPhotoPreview)}
                    className="cursor-pointer"
                  />
                  {bendaharaPhotoPreview && (
                    <div className="mt-2 space-y-2">
                      <Image
                        src={bendaharaPhotoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPhoto(bendaharaPhotoPreview, 'bendahara')}
                          className="flex-1"
                        >
                          {bendaharaPhoto ? 'Re-crop' : 'Edit'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePhoto('bendahara')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departemen */}
        <Card>
          <CardHeader>
            <CardTitle>Kepala Departemen *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kepala_seni_budaya">Kepala Seni dan Budaya *</Label>
                <Input
                  id="kepala_seni_budaya"
                  value={kepalaSeniBudaya}
                  onChange={(e) => setKepalaSeniBudaya(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="kepala_sosial_keagamaan">Kepala Sosial dan Keagamaan *</Label>
                <Input
                  id="kepala_sosial_keagamaan"
                  value={kepalaSosialKeagamaan}
                  onChange={(e) => setKepalaSosialKeagamaan(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="kepala_infokom">Kepala Informasi dan Komunikasi *</Label>
                <Input
                  id="kepala_infokom"
                  value={kepalaInfokom}
                  onChange={(e) => setKepalaInfokom(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="kepala_pengembangan_org">Kepala Pengembangan Organisasi *</Label>
                <Input
                  id="kepala_pengembangan_org"
                  value={kepalaPengembanganOrg}
                  onChange={(e) => setKepalaPengembanganOrg(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="kepala_olahraga">Kepala Olahraga *</Label>
                <Input
                  id="kepala_olahraga"
                  value={kepalaOlahraga}
                  onChange={(e) => setKepalaOlahraga(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="kepala_kajian_pendidikan">Kepala Kajian dan Pendidikan *</Label>
                <Input
                  id="kepala_kajian_pendidikan"
                  value={kepalaKajianPendidikan}
                  onChange={(e) => setKepalaKajianPendidikan(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Structure
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Photo Crop Modal */}
      <PhotoCropModal
        image={currentCropImage}
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSave={handleSaveCrop}
      />
    </div>
  )
}
