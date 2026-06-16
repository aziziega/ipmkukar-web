"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Loader2, Users, Palette, Heart, Megaphone, Rocket, Trophy, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Department {
  id: string
  slug: string
  name: string
  full_name: string
  description: string | null
  color: string
  icon: string
  period: string
  order_index: number
  is_active: boolean
}

interface DepartmentWithStats extends Department {
  kepala_count: number
  anggota_count: number
  total_members: number
}

const iconMap: Record<string, React.ElementType> = {
  Palette,
  Heart,
  Megaphone,
  Rocket,
  Trophy,
  BookOpen,
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
  green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
  blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
  amber: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
  red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
}

export default function DepartemenAdminPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [departments, setDepartments] = useState<DepartmentWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/departemen')
      const data = await response.json()

      if (data.success) {
        setDepartments(data.departments)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch departments",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
        <p className="text-gray-600">
          Mengelola anggota untuk setiap departemen termasuk kepala dan anggota.
        </p>
      </div>

      {/* No Departments State */}
      {departments.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Departments Found
              </h3>
              <p className="text-gray-600 mb-4">
                Please run the department migration to initialize departments
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const Icon = iconMap[dept.icon] || Users
              const colors = colorMap[dept.color] || colorMap.purple

              return (
                <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <p className="text-xs text-gray-500 mt-1">
                            Period: {dept.period}
                          </p>
                        </div>
                      </div>
                      {dept.is_active ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Description */}
                    {dept.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {dept.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {dept.kepala_count}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Kepala</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {dept.anggota_count}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Anggota</p>
                      </div>
                      <div className={`${colors.bg} rounded-lg p-3 text-center`}>
                        <p className={`text-2xl font-bold ${colors.text}`}>
                          {dept.total_members}
                        </p>
                        <p className={`text-xs ${colors.text} mt-1`}>Total</p>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button
                      onClick={() => router.push(`/admin/dashboard/departemen/${dept.slug}/edit`)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Anggota
                    </Button>

                    {/* Status Info */}
                    {dept.total_members === 0 && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>No members yet. Click Edit to add members.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Bagaimana cara mengelola departemen</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Klik <strong>Edit Anggota</strong> untuk manage setiap anggota dan kepala departemen</li>
                  <li>• Setiap departemen hanya memiliki 1 kepala dan beberapa anggota</li>
                  <li>• Upload photos, tambahkan anggota details, dan sesuaikan posisi</li>
                  <li>• Gunakan mode entri batch untuk menambahkan beberapa anggota sekaligus.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
