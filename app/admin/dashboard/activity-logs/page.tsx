"use client"

import { useEffect, useState } from "react"
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
  History,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  User,
  Activity as ActivityIcon,
  Loader2,
} from "lucide-react"
import {
  ActivityLog,
  ActivityLogsResponse,
  ActivityAction,
  EntityType,
  ACTION_LABELS,
  ACTION_COLORS,
  ENTITY_TYPE_LABELS,
} from "@/types/activity-log"

// Native JS relative time formatter
function formatRelativeTime(timestamp: string): string {
  const now = new Date().getTime()
  const past = new Date(timestamp).getTime()
  const diffMs = now - past
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`
  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`
}

export default function ActivityLogsPage() {
  // State management
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [pageSize] = useState(50)
  
  // Filter state
  const [filters, setFilters] = useState({
    user_id: "",
    action: "all",
    entity_type: "all",
    search: "",
    date_from: "",
    date_to: "",
  })
  
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Fetch activity logs
  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Build query string
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      })

      if (filters.user_id) params.append("user_id", filters.user_id)
      if (filters.action && filters.action !== "all") params.append("action", filters.action)
      if (filters.entity_type && filters.entity_type !== "all") params.append("entity_type", filters.entity_type)
      if (filters.search) params.append("search", filters.search)
      if (filters.date_from) params.append("date_from", filters.date_from)
      if (filters.date_to) params.append("date_to", filters.date_to)

      const response = await fetch(`/api/admin/activity-logs?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch activity logs")
      }

      const data: ActivityLogsResponse = await response.json()
      
      setLogs(data.logs)
      setTotalPages(data.pagination.total_pages)
      setTotalLogs(data.pagination.total)
    } catch (err) {
      console.error("Error fetching logs:", err)
      setError(err instanceof Error ? err.message : "Failed to load logs")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch logs on mount and when filters/page change
  useEffect(() => {
    fetchLogs()
  }, [currentPage, filters])

  // Count active filters
  useEffect(() => {
    const count = Object.values(filters).filter((v) => v !== "" && v !== "all").length
    setActiveFiltersCount(count)
  }, [filters])

  // Filter handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleClearFilters = () => {
    setFilters({
      user_id: "",
      action: "all",
      entity_type: "all",
      search: "",
      date_from: "",
      date_to: "",
    })
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    fetchLogs()
  }

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return timestamp
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <History className="w-8 h-8 text-emerald-600" />
              Activity Logs
            </h1>
            <p className="text-gray-600">
              Track all admin activities and system events
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
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
                <p className="text-sm text-gray-600 mb-1">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentPage} / {totalPages}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <History className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Filters</p>
                <p className="text-2xl font-bold text-gray-900">{activeFiltersCount}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Filter className="w-6 h-6 text-emerald-600" />
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
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-sm"
                >
                  Clear all
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Action Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Action
                </label>
                <Select
                  value={filters.action}
                  onValueChange={(value) => handleFilterChange("action", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    {Object.values(ActivityAction).map((action) => (
                      <SelectItem key={action} value={action}>
                        {ACTION_LABELS[action]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Entity Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Entity Type
                </label>
                <Select
                  value={filters.entity_type}
                  onValueChange={(value) =>
                    handleFilterChange("entity_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All entities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All entities</SelectItem>
                    {Object.values(EntityType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {ENTITY_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Activity History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <ActivityIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to Load Logs
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && logs.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <History className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Logs Found
                </h3>
                <p className="text-gray-600">
                  {activeFiltersCount > 0
                    ? "Try adjusting your filters"
                    : "No activity logs yet"}
                </p>
              </div>
            )}

            {/* Table */}
            {!isLoading && !error && logs.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Time
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Action
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Entity
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        IP Address
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((log, index) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Timestamp */}
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                {new Date(log.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.created_at).toLocaleTimeString()}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatRelativeTime(log.created_at)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* User */}
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                {log.user_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {log.user_email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={ACTION_COLORS[log.action as ActivityAction]}
                          >
                            {ACTION_LABELS[log.action as ActivityAction]}
                          </Badge>
                        </td>

                        {/* Entity Type */}
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">
                              {log.entity_type
                                ? ENTITY_TYPE_LABELS[log.entity_type as EntityType]
                                : "-"}
                            </p>
                            {log.entity_id && (
                              <p className="text-xs text-gray-400 font-mono mt-0.5">
                                {log.entity_id.substring(0, 8)}...
                              </p>
                            )}
                          </div>
                        </td>

                        {/* IP Address */}
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600 font-mono">
                            {log.ip_address || "-"}
                          </p>
                        </td>

                        {/* Details */}
                        <td className="py-3 px-4">
                          {log.details ? (
                            <details className="cursor-pointer">
                              <summary className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                View details
                              </summary>
                              <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200 overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && logs.length > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages} ({totalLogs} total
                  logs)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

