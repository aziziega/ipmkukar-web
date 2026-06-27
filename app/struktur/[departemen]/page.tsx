"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Palette, Heart, Megaphone, Rocket, Trophy, BookOpen, ArrowLeft, Loader2, User } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Navbar from "@/components/Navbar"

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

interface Department {
  id: string
  slug: string
  name: string
  full_name: string
  description: string | null
  color: string
  icon: string
  period: string
}

interface DepartmentDetail {
  department: Department
  kepala: DepartmentMember | null
  anggota: DepartmentMember[]
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

export default function DepartmentPage() {
  const params = useParams()
  const router = useRouter()
  const departemen = params.departemen as string

  const [data, setData] = useState<DepartmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/struktur/${departemen}`)
        const result = await response.json()

        if (result.success && result.data) {
          setData(result.data)
        } else {
          setError(result.error || "Failed to load department data")
        }
      } catch (err) {
        console.error("Error fetching department:", err)
        setError("Failed to load department data")
      } finally {
        setIsLoading(false)
      }
    }

    if (departemen) {
      fetchData()
    }
  }, [departemen])

  if (isLoading) {
    return (
      <section className="relative pt-32 pb-20 bg-surface min-h-screen">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !data) {
    return (
      <section className="relative pt-32 pb-20 bg-surface min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <User className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">Departemen Tidak Ditemukan</h3>
            <p className="text-lg text-text-secondary mb-6">{error || "Departemen yang Anda cari tidak tersedia."}</p>
            <Button onClick={() => router.push("/struktur")} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Struktur Organisasi
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const { department, kepala, anggota } = data
  const Icon = iconMap[department.icon] || User
  const colors = colorMap[department.color] || colorMap.purple

  return (
    <>
      <Navbar />
      <section className="relative pt-32 pb-20 bg-surface min-h-screen">
        <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

        <div className="container mx-auto px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/struktur")}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Struktur Organisasi
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-3 ${colors.bg} px-6 py-3 rounded-full mb-6`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
              <span className={`text-sm font-bold tracking-[0.2em] uppercase ${colors.text}`}>
                STRUKTUR DEPARTEMEN
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4">
              {department.full_name}
            </h1>
            {/* <h2 className="text-2xl md:text-3xl font-bold text-emerald">
            IPM KUKAR YOGYAKARTA
          </h2> */}
            {department.description && (
              <p className="text-lg text-text-secondary mt-6 max-w-2xl mx-auto">
                {department.description}
              </p>
            )}
            <Badge className="mt-4 bg-emerald/10 text-emerald border-emerald/20">
              Periode {department.period}
            </Badge>
          </motion.div>

          {/* Kepala Departemen */}
          {kepala && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-16"
            >
              <h3 className="text-center text-sm font-bold tracking-[0.2em] uppercase text-gray-600 mb-8">
                KEPALA DEPARTEMEN
              </h3>
              <Card className="max-w-md mx-auto p-8 bg-white border-2 border-border-custom hover:border-emerald hover:shadow-xl transition-all">
                <div className="flex flex-col items-center text-center">
                  {kepala.photo ? (
                    <Image
                      src={kepala.photo}
                      alt={kepala.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald mb-4"
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full ${colors.bg} flex items-center justify-center mb-4 border-4 border-emerald`}>
                      <User className={`w-12 h-12 ${colors.text}`} />
                    </div>
                  )}
                  <Badge className={`${colors.bg} ${colors.text} mb-3`}>Kepala Departemen</Badge>
                  <h4 className="text-2xl font-bold text-text-primary mb-2">{kepala.name}</h4>
                  {kepala.nim && (
                    <p className="text-sm text-text-secondary mb-2">NIM: {kepala.nim}</p>
                  )}
                  {kepala.bio && (
                    <p className="text-sm text-text-secondary mt-3 max-w-sm">{kepala.bio}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Connecting Line */}
          {anggota.length > 0 && (
            <div className="flex justify-center my-8">
              <div className="w-0.5 h-8 bg-emerald/30"></div>
            </div>
          )}

          {/* Anggota */}
          {anggota.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-center text-sm font-bold tracking-[0.2em] uppercase text-gray-600 mb-8">
                ANGGOTA DEPARTEMEN
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {anggota.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  >
                    <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all">
                      <div className="flex flex-col items-center text-center">
                        {member.photo ? (
                          <Image
                            src={member.photo}
                            alt={member.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-2 border-emerald/50 mb-3"
                          />
                        ) : (
                          <div className={`w-20 h-20 rounded-full ${colors.bg} flex items-center justify-center mb-3 border-2 border-emerald/50`}>
                            <User className={`w-10 h-10 ${colors.text}`} />
                          </div>
                        )}
                        <h5 className="font-semibold text-text-primary text-sm mb-1">{member.name}</h5>
                        {member.nim && (
                          <p className="text-xs text-text-secondary">NIM: {member.nim}</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!kepala && anggota.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-center py-16"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${colors.bg} flex items-center justify-center`}>
                <Icon className={`w-10 h-10 ${colors.text}`} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Data Struktur Sedang Diperbarui
              </h3>
              <p className="text-lg text-text-secondary">
                Informasi anggota departemen akan segera ditampilkan. Silakan kembali lagi nanti.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
