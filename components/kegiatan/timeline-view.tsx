"use client"

import { Activity, DEPARTMENT_COLORS, DEPARTMENT_DOT_COLORS } from "@/types/activity"
import { groupActivitiesByYear } from "@/lib/activity-utils"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { formatDate } from "@/lib/activity-utils"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { useScroll, useTransform } from "framer-motion"

interface TimelineViewProps {
  activities: Activity[]
}

interface TimelineItemProps {
  activity: Activity
  index: number
  isLeft: boolean
}

function TimelineItem({ activity, index, isLeft }: TimelineItemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const itemRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end center"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])

  const handleImageClick = () => {
    if (activity.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % activity.images.length)
    }
  }

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity, scale }}
      className="relative mb-16 md:mb-20"
    >
      {/* Timeline Dot */}
      <div
        className={`absolute left-1/2 top-8 w-4 h-4 rounded-full transform -translate-x-1/2 z-10 hidden md:block shadow-lg ${
          DEPARTMENT_DOT_COLORS[activity.department]
        }`}
      />

      <div className="container mx-auto px-6">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${
            isLeft ? "md:text-right" : ""
          }`}
        >
          {/* Image */}
          <div className={isLeft ? "md:order-2" : "md:order-1"}>
            <div
              className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100 border-2 border-gray-200 shadow-lg cursor-pointer group"
              onClick={handleImageClick}
            >
              <img
                src={activity.images[currentImageIndex]}
                alt={activity.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deeper/60 via-transparent to-transparent" />

              {/* Badge */}
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
            </div>
          </div>

          {/* Content */}
          <div className={isLeft ? "md:order-1" : "md:order-2"}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl md:text-3xl font-black text-text-primary">
                {activity.title}
              </h3>

              <p className="text-base text-text-secondary leading-relaxed">
                {activity.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald" />
                  <span>{formatDate(activity.date)}</span>
                </div>

                {activity.participants && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald" />
                    <span>{activity.participants} peserta</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald" />
                  <span>{activity.location}</span>
                </div>
              </div>

              {/* Type Badge */}
              <div>
                <span className="inline-block text-xs font-semibold text-emerald bg-emerald/10 px-3 py-1 rounded-full">
                  {activity.type}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TimelineView({ activities }: TimelineViewProps) {
  const groupedActivities = groupActivitiesByYear(activities)
  const years = Object.keys(groupedActivities)
    .map(Number)
    .sort((a, b) => b - a)

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          Tidak ada kegiatan ditemukan
        </h3>
        <p className="text-text-secondary">
          Coba ubah filter atau kata kunci pencarian
        </p>
      </motion.div>
    )
  }

  return (
    <div className="relative">
      {/* Central Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald/30 transform -translate-x-1/2 hidden md:block" />

      {years.map((year) => {
        const yearActivities = groupedActivities[year]
        return (
          <div key={year} className="mb-16">
            {/* Year Marker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative mb-12"
            >
              <div className="flex items-center justify-center">
                <div className="bg-emerald text-white px-8 py-3 rounded-full font-black text-2xl shadow-lg">
                  {year}
                </div>
              </div>
            </motion.div>

            {/* Activities for this year */}
            {yearActivities.map((activity, index) => (
              <TimelineItem
                key={activity.id}
                activity={activity}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
