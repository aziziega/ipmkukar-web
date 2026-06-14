"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Loader2, Users, Trash2, Palette, Heart, Megaphone, Rocket, Trophy, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
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
  kepala_seni_budaya_photo: string | null
  kepala_sosial_keagamaan_photo: string | null
  kepala_infokom_photo: string | null
  kepala_pengembangan_org_photo: string | null
  kepala_olahraga_photo: string | null
  kepala_kajian_pendidikan_photo: string | null
  updated_at: string
}

export default function StrukturPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [structure, setStructure] = useState<OrganizationalStructure | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchStructure()
  }, [])

  const fetchStructure = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/struktur')
      const data = await response.json()

      if (data.success) {
        setStructure(data.structure)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch organizational structure",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching structure:', error)
      toast({
        title: "Error",
        description: "Failed to fetch organizational structure",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!structure) return

    try {
      const response = await fetch('/api/admin/struktur', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Gagal menghapus struktur organisasi')
      }

      toast({
        title: "Berhasil",
        description: "Struktur organisasi berhasil dihapus",
      })

      fetchStructure()
    } catch (error: any) {
      console.error('Error deleting structure:', error)
      toast({
        title: "Gagal Menghapus",
        description: error.message || "Gagal menghapus struktur organisasi",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Struktur Organisasi</h1>
          <p className="text-gray-600 mt-1">Manage organizational structure and leadership</p>
        </div>
        <div className="flex gap-3">
          {structure && (
            <Button
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Structure
            </Button>
          )}
          <Button
            onClick={() => router.push('/admin/dashboard/struktur/edit')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            {structure ? 'Edit Structure' : 'Create Structure'}
          </Button>
        </div>
      </div>

      {!structure ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Organizational Structure Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your organization's leadership structure
              </p>
              <Button
                onClick={() => router.push('/admin/dashboard/struktur/edit')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Create Structure
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Period and Last Updated */}
          <Card>
            <CardHeader>
              <CardTitle>Current Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{structure.period}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(structure.updated_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Dewan Pengawas */}
          <Card>
            <CardHeader>
              <CardTitle>Dewan Pengawas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {structure.dewan_pengawas_1 && (
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={structure.dewan_pengawas_1_photo || '/placeholder.svg'}
                      alt={structure.dewan_pengawas_1}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Dewan Pengawas 1</p>
                      <p className="font-semibold text-gray-900">{structure.dewan_pengawas_1}</p>
                    </div>
                  </div>
                )}
                {structure.dewan_pengawas_2 && (
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={structure.dewan_pengawas_2_photo || '/placeholder.svg'}
                      alt={structure.dewan_pengawas_2}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Dewan Pengawas 2</p>
                      <p className="font-semibold text-gray-900">{structure.dewan_pengawas_2}</p>
                    </div>
                  </div>
                )}
                {!structure.dewan_pengawas_1 && !structure.dewan_pengawas_2 && (
                  <p className="text-gray-500 col-span-2">No Dewan Pengawas assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pengurus Harian */}
          <Card>
            <CardHeader>
              <CardTitle>Pengurus Harian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Ketua Umum - Special highlight */}
                <div className="border-2 border-emerald-200 bg-emerald-50 rounded-lg p-6">
                  <div className="flex items-center gap-6">
                    <Image
                      src={structure.ketua_umum_photo || '/placeholder.svg'}
                      alt={structure.ketua_umum}
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div>
                      <Badge className="bg-emerald-600 text-white mb-2">Ketua Umum</Badge>
                      <p className="text-xl font-bold text-gray-900">{structure.ketua_umum}</p>
                    </div>
                  </div>
                </div>

                {/* Other Pengurus */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={structure.wakil_ketua_photo || '/placeholder.svg'}
                      alt={structure.wakil_ketua}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Wakil Ketua</p>
                      <p className="font-semibold text-gray-900">{structure.wakil_ketua}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={structure.sekretaris_photo || '/placeholder.svg'}
                      alt={structure.sekretaris}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sekretaris</p>
                      <p className="font-semibold text-gray-900">{structure.sekretaris}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={structure.bendahara_photo || '/placeholder.svg'}
                      alt={structure.bendahara}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bendahara</p>
                      <p className="font-semibold text-gray-900">{structure.bendahara}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Departemen */}
          <Card>
            <CardHeader>
              <CardTitle>Kepala Departemen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {structure.kepala_seni_budaya_photo ? (
                      <Image
                        src={structure.kepala_seni_budaya_photo}
                        alt="Tim Seni dan Budaya"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Palette className="w-6 h-6 text-purple-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 font-semibold mb-1">Seni dan Budaya</p>
                      <p className="font-semibold text-gray-900 text-sm">{structure.kepala_seni_budaya}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {structure.kepala_sosial_keagamaan_photo ? (
                      <Image
                        src={structure.kepala_sosial_keagamaan_photo}
                        alt="Tim Sosial dan Keagamaan"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-green-600 font-semibold mb-1">Sosial dan Keagamaan</p>
                      <p className="font-semibold text-gray-900 text-sm">{structure.kepala_sosial_keagamaan}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {structure.kepala_infokom_photo ? (
                      <Image
                        src={structure.kepala_infokom_photo}
                        alt="Tim Informasi dan Komunikasi"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Informasi dan Komunikasi</p>
                      <p className="font-semibold text-gray-900 text-sm">{structure.kepala_infokom}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {structure.kepala_pengembangan_org_photo ? (
                      <Image
                        src={structure.kepala_pengembangan_org_photo}
                        alt="Tim Pengembangan Organisasi"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Rocket className="w-6 h-6 text-amber-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-amber-600 font-semibold mb-1">Pengembangan Organisasi</p>
                      <p className="font-semibold text-gray-900 text-sm">{structure.kepala_pengembangan_org}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {structure.kepala_olahraga_photo ? (
                      <Image
                        src={structure.kepala_olahraga_photo}
                        alt="Tim Olahraga"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-red-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-red-600 font-semibold mb-1">Olahraga</p>
                      <p className="font-semibold text-gray-900 text-sm">{structure.kepala_olahraga}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {structure.kepala_kajian_pendidikan_photo ? (
                      <Image
                        src={structure.kepala_kajian_pendidikan_photo}
                        alt="Tim Kajian dan Pendidikan"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-indigo-600 font-semibold mb-1">Kajian dan Pendidikan</p>
                      <p className="font-semibold text-gray-900 text-sm">{structure.kepala_kajian_pendidikan}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Struktur Organisasi</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus struktur organisasi periode <strong>{structure?.period}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
