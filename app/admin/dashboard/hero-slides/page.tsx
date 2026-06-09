"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Trash2, Edit, GripVertical, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface HeroSlide {
  id: string
  title: string
  image_url: string
  order_index: number
  is_active: boolean
  created_at: string
}

export default function HeroSlidesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch hero slides
  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/hero-slides")
      const data = await response.json()

      if (data.success) {
        setSlides(data.slides)
      } else {
        toast({
          title: "Error",
          description: "Failed to load hero slides",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching slides:", error)
      toast({
        title: "Error",
        description: "Failed to load hero slides",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle active status
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const formData = new FormData()
      formData.append("is_active", (!currentStatus).toString())

      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: "PATCH",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setSlides((prev) =>
          prev.map((slide) =>
            slide.id === id ? { ...slide, is_active: !currentStatus } : slide
          )
        )
        toast({
          title: "Success",
          description: "Slide status updated",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update slide",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling slide:", error)
      toast({
        title: "Error",
        description: "Failed to update slide",
        variant: "destructive",
      })
    }
  }

  // Delete slide
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/admin/hero-slides/${deleteId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setSlides((prev) => prev.filter((slide) => slide.id !== deleteId))
        toast({
          title: "Success",
          description: "Hero slide deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete slide",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting slide:", error)
      toast({
        title: "Error",
        description: "Failed to delete slide",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600 mt-1">
            Manage hero section background images
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/dashboard/hero-slides/new")}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      {/* Slides List */}
      <Card>
        <CardHeader>
          <CardTitle>All Hero Slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hero slides yet</p>
              <Button
                onClick={() => router.push("/admin/dashboard/hero-slides/new")}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Slide
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                  {/* Drag Handle (for future drag & drop) */}
                  <div className="cursor-grab text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={slide.image_url}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {slide.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Order: {slide.order_index}
                    </p>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {slide.is_active ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={slide.is_active}
                      onCheckedChange={() =>
                        toggleActive(slide.id, slide.is_active)
                      }
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/dashboard/hero-slides/${slide.id}/edit`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(slide.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hero Slide?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this hero slide and its image. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
