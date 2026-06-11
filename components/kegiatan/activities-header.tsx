"use client"

import { Search, Grid3x3, List, Calendar, Users, Activity as ActivityIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ViewMode } from "@/types/activity"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ActivitiesHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  totalActivities: number
  activeDepartments: number
  activeYears: number
}

export default function ActivitiesHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  totalActivities,
  activeDepartments,
  activeYears,
}: ActivitiesHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-surface to-white border-b border-border-custom">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald hover:text-emerald-dark transition-colors mb-8 hover:gap-3 duration-300"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold text-sm">Kembali ke Beranda</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Arsip Kegiatan
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-4">
            Jejak <span className="text-emerald">Perjalanan Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Dokumentasi lengkap kegiatan IPM Kukar Yogyakarta dari berbagai departemen dan tahun
          </p>
        </motion.div>

        {/* Search and View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between max-w-5xl mx-auto"
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input
              type="text"
              placeholder="Cari kegiatan, lokasi, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 py-6 text-base border-2 focus:border-emerald rounded-xl"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white rounded-xl p-1.5 border-2 border-border-custom">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={`gap-2 ${
                viewMode === "grid"
                  ? "bg-emerald text-white hover:bg-emerald-dark"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("timeline")}
              className={`gap-2 ${
                viewMode === "timeline"
                  ? "bg-emerald text-white hover:bg-emerald-dark"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
