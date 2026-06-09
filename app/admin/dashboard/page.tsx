"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react"

export default function DashboardPage() {
  // In production, these would be fetched from the database
  const stats = [
    {
      title: "Total Activities",
      value: "18",
      icon: Calendar,
      description: "Published events",
      trend: "+2 this month",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Testimonials",
      value: "12",
      icon: MessageSquare,
      description: "Active testimonials",
      trend: "+3 this month",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Hero Slides",
      value: "3",
      icon: ImageIcon,
      description: "Active slides",
      trend: "All active",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Team Members",
      value: "13",
      icon: Users,
      description: "In organization",
      trend: "Current period",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage IPM Kukar Yogyakarta website content and settings
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {stat.description}
                  </p>
                  <div className="flex items-center text-xs text-emerald-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/dashboard/activities"
                className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-emerald-600 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">
                  Manage Activities
                </h3>
                <p className="text-xs text-gray-600">
                  Add, edit, or remove activities
                </p>
              </a>

              <a
                href="/admin/dashboard/testimonials"
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">
                  Manage Testimonials
                </h3>
                <p className="text-xs text-gray-600">
                  Update member testimonials
                </p>
              </a>

              <a
                href="/admin/dashboard/statistics"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">
                  Update Statistics
                </h3>
                <p className="text-xs text-gray-600">
                  Modify homepage stats
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
