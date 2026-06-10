"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function KegiatanSection() {
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch latest/featured activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        // Try to fetch featured activities first
        const featuredResponse = await fetch('/api/activities?featured=true&limit=6')
        const featuredData = await featuredResponse.json()
        
        if (featuredData.activities && featuredData.activities.length > 0) {
          // Use featured activities if available
          setActivities(featuredData.activities)
        } else {
          // Fall back to latest activities
          const latestResponse = await fetch('/api/activities?limit=6')
          const latestData = await latestResponse.json()
          setActivities(latestData.activities || [])
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return (
    <section id="kegiatan" className="relative py-20 bg-surface">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase">
            Kegiatan & Galeri
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary mt-4">
            Jejak Kegiatan Kami
          </h2>
        </motion.div>

        {/* Activities Grid with Staggered Animation */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary">Belum ada kegiatan yang ditampilkan</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-xl border border-border-custom hover:border-emerald transition-all duration-300 bg-white"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={activity.images?.[0] || '/placeholder.jpg'}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-deeper via-emerald-deeper/50 to-transparent opacity-70"></div>
                  
                  {/* Title on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {activity.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4">
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Button with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/kegiatan">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-emerald text-emerald hover:bg-emerald hover:text-white font-semibold px-8 transition-all duration-300"
              >
                Lihat Semua Kegiatan
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
