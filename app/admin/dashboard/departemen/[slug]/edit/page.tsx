"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, X, Upload, User, Trash2, Plus, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { PhotoCropModal } from "@/components/admin/photo-crop-modal"
import { blobToFile } from "@/lib/image-crop-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Department {
  id: string
  slug: string
  name: string
  full_name: string
  color: string
  period: string
}

interface DepartmentMember {
  id: string
  name: string
  position: string
  photo: string | null
  nim: string | null
  bio: string | null
  email: string | null
  phone: string | null
  order_index: number
}

interface BatchMemberInput {
  name: string
  position: string
  nim: string
  photo: File | null
}

export default function EditDepartemenPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { toast } = useToast()

  // Unwrap params Promise
  const unwrappedParams = React.use(params)
  const slug = unwrappedParams.slug

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [department, setDepartment] = useState<Department | null>(null)
  const [period, setPeriod] = useState("")
  
  // Kepala state
  const [kepala, setKepala] = useState<DepartmentMember | null>(null)
  const [kepalaName, setKepalaName] = useState("")
  const [kepalaPosition, setKepalaPosition] = useState("Kepala Departemen")
  const [kepalaNim, setKepalaNim] = useState("")
  const [kepalaPhoto, setKepalaPhoto] = useState<File | null>(null)
  const [kepalaPhotoPreview, setKepalaPhotoPreview] = useState<string | null>(null)
  const [kepalaDeletePhoto, setKepalaDeletePhoto] = useState(false)
  
  // Anggota state
  const [anggota, setAnggota] = useState<DepartmentMember[]>([])
  
  // Batch entry state
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [batchMembers, setBatchMembers] = useState<BatchMemberInput[]>([
    { name: "", position: "Anggota", nim: "", photo: null }
  ])
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<DepartmentMember | null>(null)
  const [editName, setEditName] = useState("")
  const [editPosition, setEditPosition] = useState("")
  const [editNim, setEditNim] = useState("")
  const [editPhoto, setEditPhoto] = useState<File | null>(null)
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null)
  const [editDeletePhoto, setEditDeletePhoto] = useState(false)
  
  // Delete confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)

  // Crop modal state
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [currentCropImage, setCurrentCropImage] = useState<string | null>(null)
  const [currentCropPosition, setCurrentCropPosition] = useState<string | null>(null)

  useEffect(() => {
    fetchDepartmentData()
  }, [slug])

  const fetchDepartmentData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/departemen/${slug}`)
      const data = await response.json()

      if (data.success) {
        setDepartment(data.data.department)
        setPeriod(data.data.department.period)
        setKepala(data.data.kepala)
        setAnggota(data.data.anggota)
        
        // Set kepala form if exists
        if (data.data.kepala) {
          setKepalaName(data.data.kepala.name)
          setKepalaPosition(data.data.kepala.position)
          setKepalaNim(data.data.kepala.nim || "")
          setKepalaPhotoPreview(data.data.kepala.photo)
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch department data",
          variant: "destructive",
        })
        router.push('/admin/dashboard/departemen')
      }
    } catch (error) {
      console.error('Error fetching department:', error)
      toast({
        title: "Error",
        description: "Failed to fetch department data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveCrop = async (croppedBlob: Blob) => {
    try {
      const file = blobToFile(croppedBlob, 'cropped-photo.jpg')
      
      // Set the cropped photo based on position
      if (currentCropPosition === 'kepala') {
        setKepalaPhoto(file)
        setKepalaPhotoPreview(URL.createObjectURL(file))
        setKepalaDeletePhoto(false)
      } else if (currentCropPosition === 'edit') {
        setEditPhoto(file)
        setEditPhotoPreview(URL.createObjectURL(file))
        setEditDeletePhoto(false)
      }
      
      // Close modal and reset state
      setIsCropModalOpen(false)
      setCurrentCropImage(null)
      setCurrentCropPosition(null)
      
      toast({
        title: "Success",
        description: "Photo cropped successfully",
      })
    } catch (error) {
      console.error('Error saving cropped photo:', error)
      toast({
        title: "Error",
        description: "Failed to save cropped photo",
        variant: "destructive",
      })
    }
  }

  const handleKepalaPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCurrentCropImage(URL.createObjectURL(file))
      setCurrentCropPosition('kepala')
      setIsCropModalOpen(true)
    }
  }

  const handleKepalaPhotoDelete = () => {
    setKepalaPhoto(null)
    setKepalaPhotoPreview(null)
    setKepalaDeletePhoto(true)
  }

  const handleSaveKepala = async () => {
    if (!kepalaName.trim()) {
      toast({
        title: "Error",
        description: "Nama kepala wajib diisi",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('name', kepalaName)
      formData.append('position', kepalaPosition)
      formData.append('nim', kepalaNim)
      if (kepalaPhoto) {
        formData.append('photo', kepalaPhoto)
      }
      if (kepalaDeletePhoto) {
        formData.append('deletePhoto', 'true')
      }

      let response
      if (kepala) {
        // Update existing kepala
        response = await fetch(`/api/admin/departemen/${slug}/members/${kepala.id}`, {
          method: 'PUT',
          body: formData,
        })
      } else {
        // Add new kepala
        response = await fetch(`/api/admin/departemen/${slug}/members`, {
          method: 'POST',
          body: formData,
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: kepala ? "Kepala updated successfully" : "Kepala added successfully",
        })
        fetchDepartmentData()
      } else {
        toast({
          title: "Error",
          description: data.error || data.message || "Failed to save kepala",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving kepala:', error)
      toast({
        title: "Error",
        description: "Failed to save kepala",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteKepala = async () => {
    if (!kepala) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/admin/departemen/${params.slug}/members/${kepala.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Kepala deleted successfully",
        })
        setKepala(null)
        setKepalaName("")
        setKepalaNim("")
        setKepalaPhoto(null)
        setKepalaPhotoPreview(null)
        fetchDepartmentData()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete kepala",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting kepala:', error)
      toast({
        title: "Error",
        description: "Failed to delete kepala",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddBatchRow = () => {
    setBatchMembers([...batchMembers, { name: "", position: "Anggota", nim: "", photo: null }])
  }

  const handleRemoveBatchRow = (index: number) => {
    setBatchMembers(batchMembers.filter((_, i) => i !== index))
  }

  const handleBatchFieldChange = (index: number, field: keyof BatchMemberInput, value: any) => {
    const updated = [...batchMembers]
    updated[index] = { ...updated[index], [field]: value }
    setBatchMembers(updated)
  }

  const handleSaveBatch = async () => {
    // Validate
    const validMembers = batchMembers.filter(m => m.name.trim())
    
    if (validMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one member with a name",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('batch', 'true')
      formData.append('memberCount', validMembers.length.toString())
      
      validMembers.forEach((member, index) => {
        formData.append(`members[${index}].name`, member.name)
        formData.append(`members[${index}].position`, member.position)
        formData.append(`members[${index}].nim`, member.nim)
        if (member.photo) {
          formData.append(`members[${index}].photo`, member.photo)
        }
      })

      const response = await fetch(`/api/admin/departemen/${slug}/members`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Added ${validMembers.length} member(s) successfully`,
        })
        setIsBatchMode(false)
        setBatchMembers([{ name: "", position: "Anggota", nim: "", photo: null }])
        fetchDepartmentData()
      } else {
        toast({
          title: "Error",
          description: data.error || data.message || "Failed to add members",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving batch:', error)
      toast({
        title: "Error",
        description: "Failed to add members",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Not Found</h3>
          <Button onClick={() => router.push('/admin/dashboard/departemen')}>
            Back to Departments
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/dashboard/departemen')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Departments
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit {department.name}
          </h1>
          <p className="text-gray-600">
            Manage kepala and anggota members for this department
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <Label htmlFor="period" className="text-xs text-gray-600 mb-1">Period</Label>
            <div className="flex gap-2">
              <Input
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g., 2026/2027"
                className="w-32 h-9"
              />
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    setIsSaving(true)
                    const response = await fetch(`/api/admin/departemen/${slug}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ period }),
                    })
                    const data = await response.json()
                    if (data.success) {
                      toast({ title: "Success", description: "Period updated" })
                      fetchDepartmentData()
                    } else {
                      toast({ title: "Error", description: data.error, variant: "destructive" })
                    }
                  } catch (error) {
                    toast({ title: "Error", description: "Failed to update period", variant: "destructive" })
                  } finally {
                    setIsSaving(false)
                  }
                }}
                disabled={isSaving || !period.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 h-9"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Kepala Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Kepala Departemen</span>
            {kepala && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteKepala}
                disabled={isSaving}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Kepala
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo Upload */}
          <div>
            <Label>Photo</Label>
            <div className="mt-2 flex items-center gap-4">
              {kepalaPhotoPreview ? (
                <div className="relative">
                  <Image
                    src={kepalaPhotoPreview}
                    alt="Kepala photo"
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                    onClick={handleKepalaPhotoDelete}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleKepalaPhotoChange}
                  className="max-w-xs"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a photo (optional, max 2MB)
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="kepala-name">Name *</Label>
            <Input
              id="kepala-name"
              value={kepalaName}
              onChange={(e) => setKepalaName(e.target.value)}
              placeholder="Enter kepala name"
            />
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="kepala-position">Position</Label>
            <Select value={kepalaPosition} onValueChange={setKepalaPosition}>
              <SelectTrigger id="kepala-position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kepala Departemen">Kepala Departemen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NIM */}
          <div>
            <Label htmlFor="kepala-nim">NIM (Optional)</Label>
            <Input
              id="kepala-nim"
              value={kepalaNim}
              onChange={(e) => setKepalaNim(e.target.value)}
              placeholder="Enter NIM"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveKepala}
            disabled={isSaving}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {kepala ? 'Update Kepala' : 'Add Kepala'}
          </Button>
        </CardContent>
      </Card>

      {/* Anggota Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Anggota Departemen ({anggota.length})</span>
            <div className="flex gap-2">
              {!isBatchMode && (
                <Button
                  onClick={() => setIsBatchMode(true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Batch Entry
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Anggota List */}
          {anggota.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {anggota.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{member.name}</p>
                        {member.nim && (
                          <p className="text-xs text-gray-500">NIM: {member.nim}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingMember(member)
                          setEditName(member.name)
                          setEditPosition(member.position)
                          setEditNim(member.nim || "")
                          setEditPhotoPreview(member.photo)
                          setEditPhoto(null)
                          setEditDeletePhoto(false)
                          setEditModalOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeletingMemberId(member.id)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Batch Entry Mode */}
          {isBatchMode && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Batch Entry Mode</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsBatchMode(false)
                    setBatchMembers([{ name: "", position: "Anggota", nim: "", photo: null }])
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>

              <div className="space-y-4">
                {batchMembers.map((member, index) => (
                  <div key={index} className="flex gap-2 items-start bg-white p-4 rounded-lg border">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">Name *</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => handleBatchFieldChange(index, 'name', e.target.value)}
                          placeholder="Member name"
                          size={1}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Position</Label>
                        <Select
                          value={member.position}
                          onValueChange={(value) => handleBatchFieldChange(index, 'position', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Anggota">Anggota</SelectItem>
                            <SelectItem value="Kepala Departemen">Kepala Departemen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">NIM</Label>
                        <Input
                          value={member.nim}
                          onChange={(e) => handleBatchFieldChange(index, 'nim', e.target.value)}
                          placeholder="NIM (optional)"
                          size={1}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleBatchFieldChange(index, 'photo', file)
                            }
                          }}
                          className="text-xs"
                        />
                      </div>
                    </div>
                    {batchMembers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBatchRow(index)}
                        className="mt-6"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddBatchRow}
                  variant="outline"
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row
                </Button>
                <Button
                  onClick={handleSaveBatch}
                  disabled={isSaving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save All ({batchMembers.filter(m => m.name.trim()).length} members)
                </Button>
              </div>
            </div>
          )}

          {!isBatchMode && anggota.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No anggota yet</p>
              <p className="text-sm mt-1">Click Batch Entry to add members</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Member Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update member information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Photo</Label>
              <div className="mt-2 flex items-center gap-4">
                {editPhotoPreview ? (
                  <div className="relative">
                    <Image
                      src={editPhotoPreview}
                      alt="Member photo"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => {
                        setEditPhoto(null)
                        setEditPhotoPreview(null)
                        setEditDeletePhoto(true)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setCurrentCropImage(URL.createObjectURL(file))
                      setCurrentCropPosition('edit')
                      setIsCropModalOpen(true)
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Name *</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <Label>Position</Label>
              <Select value={editPosition} onValueChange={setEditPosition}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anggota">Anggota</SelectItem>
                  <SelectItem value="Kepala Departemen">Kepala Departemen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>NIM</Label>
              <Input value={editNim} onChange={(e) => setEditNim(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!editingMember) return
                const formData = new FormData()
                formData.append('name', editName)
                formData.append('position', editPosition)
                formData.append('nim', editNim)
                if (editPhoto) formData.append('photo', editPhoto)
                if (editDeletePhoto) formData.append('deletePhoto', 'true')

                const response = await fetch(`/api/admin/departemen/${params.slug}/members/${editingMember.id}`, {
                  method: 'PUT',
                  body: formData,
                })
                const data = await response.json()
                if (data.success) {
                  toast({ title: "Success", description: "Member updated" })
                  setEditModalOpen(false)
                  fetchDepartmentData()
                } else {
                  toast({ title: "Error", description: data.error, variant: "destructive" })
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The member will be removed from the department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deletingMemberId) return
                const response = await fetch(`/api/admin/departemen/${params.slug}/members/${deletingMemberId}`, {
                  method: 'DELETE',
                })
                const data = await response.json()
                if (data.success) {
                  toast({ title: "Success", description: "Member deleted" })
                  fetchDepartmentData()
                } else {
                  toast({ title: "Error", description: data.error, variant: "destructive" })
                }
                setShowDeleteDialog(false)
                setDeletingMemberId(null)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
