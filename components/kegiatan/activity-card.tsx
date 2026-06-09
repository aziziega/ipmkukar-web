"use client"

import { Activity, DEPARTMENT_COLORS } from "@/types/activity"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/activity-utils"
import { useState } from "react"

interface ActivityCardProps {
  activity: Activity
  index?: number
}

export default function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleImageClick = () => {
    if (activity.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % activity.images.length)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-xl border border-border-custom hover:border-emerald transition-all duration-300 bg-white shadow-md hover:shadow-xl"
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={activity.images[currentImageIndex]}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deeper via-emerald-deeper/50 to-transparent opacity-70"></div>

        {/* Department Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className={`${DEPARTMENT_COLORS[activity.department]} text-xs px-3 py-1`}>
            {activity.department}
          </Badge>
        </div>

        {/* Image Counter */}
        {activity.images.length > 1 && (
          <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1}/{activity.images.length}
          </div>
        )}

        {/* Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
            {activity.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {activity.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald" />
            <span>{formatDate(activity.date)}</span>
          </div>

          {activity.participants && (
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald" />
              <span>{activity.participants} peserta</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald" />
            <span className="line-clamp-1">{activity.location}</span>
          </div>
        </div>

        {/* Activity Type Badge */}
        <div className="pt-2">
          <span className="inline-block text-xs font-semibold text-emerald bg-emerald/10 px-3 py-1 rounded-full">
            {activity.type}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
