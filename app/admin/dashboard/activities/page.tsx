"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Activity as ActivityIcon,
} from "lucide-react"
import {
  Department,
  ActivityType,
  DEPARTMENT_COLORS,
} from "@/types/activity"
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
import { useToast } from "@/hooks/use-toast"

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
  created_by: { name: string; email: string }
}

export default function ActivitiesPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)
  const [deleteActivity, setDeleteActivity] = useState<Activity | null>(null)

  // Stats
  const [statsByDepartment, setStatsByDepartment] = useState<Record<string, number>>({})

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      })

      if (search) params.append("search", search)
      if (departmentFilter !== "all") params.append("department", departmentFilter)
      if (yearFilter !== "all") params.append("year", yearFilter)
      if (typeFilter !== "all") params.append("type", typeFilter)

      const response = await fetch(`/api/admin/activities?${params}`)
      if (!response.ok) throw new Error("Failed to fetch activities")

      const data = await response.json()
      setActivities(data.activities)
      setTotalPages(data.pagination.total_pages)
      setTotalActivities(data.pagination.total)

      // Calculate stats by department
      const stats: Record<string, number> = {}
      data.activities.forEach((activity: Activity) => {
        stats[activity.department] = (stats[activity.department] || 0) + 1
      })
      setStatsByDepartment(stats)
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError(err instanceof Error ? err.message : "Failed to load activities")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [currentPage, search, departmentFilter, yearFilter, typeFilter])

  // Handlers
  const handleClearFilters = () => {
    setSearch("")
    setDepartmentFilter("all")
    setYearFilter("all")
    setTypeFilter("all")
    setCurrentPage(1)
  }

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const formData = new FormData()
      formData.append("is_published", (!currentStatus).toString())

      const response = await fetch(`/api/admin/activities/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to update activity")
      fetchActivities()
    } catch (err) {
      console.error("Error toggling published status:", err)
      alert("Failed to update activity status")
    }
  }

  const handleDelete = async () => {
    if (!deleteActivity) return

    const { toast } = useToast()
    try {
      const response = await fetch(`/api/admin/activities/${deleteActivity.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete activity")
      
      toast({
        title: "Berhasil",
        description: "Kegiatan berhasil dihapus",
      })
      fetchActivities()
    } catch (err) {
      console.error("Error deleting activity:", err)
      toast({
        title: "Gagal Menghapus",
        description: "Gagal menghapus kegiatan",
        variant: "destructive",
      })
    } finally {
      setDeleteActivity(null)
    }
  }

  const activeFiltersCount =
    (search ? 1 : 0) +
    (departmentFilter !== "all" ? 1 : 0) +
    (yearFilter !== "all" ? 1 : 0) +
    (typeFilter !== "all" ? 1 : 0)

  // Get unique years from activities
  const uniqueYears = Array.from(new Set(activities.map((a) => a.year))).sort(
    (a, b) => b - a
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kelola Kegiatan
            </h1>
            <p className="text-gray-600">
              Kelola kegiatan organisasi, acara, dan program
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/dashboard/activities/create")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Kegiatan
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Kegiatan</p>
                <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ActivityIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dipublikasi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activities.filter((a) => a.is_published).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unggulan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activities.filter((a) => a.is_featured).length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Filter Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{activeFiltersCount}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter
              </span>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Hapus semua
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cari</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari kegiatan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Departemen</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua departemen</SelectItem>
                    {Object.values(Department).map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tahun</label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua tahun</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipe</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua tipe</SelectItem>
                    {Object.values(ActivityType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activities Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Kegiatan</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <ActivityIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gagal Memuat Kegiatan
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchActivities} variant="outline">
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && activities.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <ActivityIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tidak Ada Kegiatan
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeFiltersCount > 0
                    ? "Coba sesuaikan filter Anda"
                    : "Mulai dengan membuat kegiatan pertama"}
                </p>
                <Button
                  onClick={() => router.push("/admin/dashboard/activities/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Kegiatan
                </Button>
              </div>
            )}

            {/* Activities Table */}
            {!isLoading && !error && activities.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Kegiatan
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Departemen
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Tipe
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Tanggal
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Peserta
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activities.map((activity, index) => (
                        <motion.tr
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          {/* Activity Info */}
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-3">
                              {activity.images[0] && (
                                <img
                                  src={activity.images[0]}
                                  alt={activity.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {activity.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={DEPARTMENT_COLORS[activity.department]}
                            >
                              {activity.department}
                            </Badge>
                          </td>

                          {/* Type */}
                          <td className="py-3 px-4">
                            <Badge variant="outline">{activity.type}</Badge>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-900">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">{activity.year}</p>
                          </td>

                          {/* Participants */}
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-900">
                              {activity.participants}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <Badge
                                variant={activity.is_published ? "default" : "secondary"}
                              >
                                {activity.is_published ? "Dipublikasi" : "Draft"}
                              </Badge>
                              {activity.is_featured && (
                                <Badge variant="outline" className="bg-amber-50">
                                  Unggulan
                                </Badge>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  router.push(
                                    `/admin/dashboard/activities/edit/${activity.id}`
                                  )
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleTogglePublished(
                                    activity.id,
                                    activity.is_published
                                  )
                                }
                              >
                                {activity.is_published ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteActivity(activity)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    Menampilkan halaman {currentPage} dari {totalPages} ({totalActivities}{" "}
                    total kegiatan)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={!!deleteActivity} onOpenChange={() => setDeleteActivity(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kegiatan</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus kegiatan <strong>{deleteActivity?.title}</strong>?
              Semua gambar terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
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
