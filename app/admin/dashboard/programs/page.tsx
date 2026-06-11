"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Search,
  ArrowUpDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
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

export default function ProgramsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [programs, setPrograms] = useState<DepartmentProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"department" | "display_order">("display_order")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [deleteProgram, setDeleteProgram] = useState<DepartmentProgram | null>(null)

  const fetchPrograms = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/programs")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch programs")
      }

      setPrograms(data.programs || [])
    } catch (err: any) {
      console.error("Error fetching programs:", err)
      setError(err.message || "Failed to load programs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const handleDelete = async () => {
    if (!deleteProgram) return

    try {
      const response = await fetch(`/api/admin/programs/${deleteProgram.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Gagal menghapus program")
      }

      toast({
        title: "Berhasil",
        description: "Program berhasil dihapus",
      })
      fetchPrograms()
    } catch (err: any) {
      console.error("Error deleting program:", err)
      toast({
        title: "Gagal Menghapus",
        description: err.message || "Gagal menghapus program",
        variant: "destructive",
      })
    } finally {
      setDeleteProgram(null)
    }
  }

  const filteredAndSortedPrograms = programs
    .filter((program) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        program.department.toLowerCase().includes(query) ||
        program.title.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === "department") {
        comparison = a.department.localeCompare(b.department)
      } else {
        comparison = a.display_order - b.display_order
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const toggleSort = (field: "department" | "display_order") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-text-primary">
                Department Programs
              </h1>
              <p className="text-text-secondary mt-2">
                Manage 6 department program section for home page
              </p>
            </div>
            <Button
              onClick={() => router.push("/admin/dashboard/programs/create")}
              className="bg-emerald hover:bg-emerald-darker text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Program
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by department, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleSort("display_order")}
                className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
                  sortBy === "display_order"
                    ? "bg-emerald text-white border-emerald"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                Order
              </button>
              <button
                onClick={() => toggleSort("department")}
                className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
                  sortBy === "department"
                    ? "bg-emerald text-white border-emerald"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                Name
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Programs</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchPrograms}
                className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredAndSortedPrograms.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {searchQuery ? "No programs found" : "No programs yet"}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start by creating your first department program"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/admin/dashboard/programs/create")}
                className="bg-emerald hover:bg-emerald-darker text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Program
              </Button>
            )}
          </div>
        )}

        {!isLoading && !error && filteredAndSortedPrograms.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  {program.images.length > 0 ? (
                    <img
                      src={program.images[0]}
                      alt={program.department}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {program.is_published ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <Eye className="w-3 h-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <Badge className={program.badge_color}>
                      {program.badge_text}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {program.department}
                  </h3>

                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>{program.programs.length} programs</span>
                    <span>•</span>
                    <span>{program.images.length} images</span>
                    <span>•</span>
                    <span>Order: {program.display_order}</span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() =>
                        router.push(`/admin/dashboard/programs/edit/${program.id}`)
                      }
                      className="flex-1 bg-emerald hover:bg-emerald-darker text-white"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteProgram(program)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredAndSortedPrograms.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Total Programs: {filteredAndSortedPrograms.length}
            </h3>
            <p className="text-sm text-blue-700">
              These department programs will be displayed on the home page in the Program Section.
              Use display order to control the sequence.
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteProgram} onOpenChange={() => setDeleteProgram(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Program</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus program <strong>{deleteProgram?.department}</strong>?
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
