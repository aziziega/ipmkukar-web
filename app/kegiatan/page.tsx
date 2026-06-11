"use client"

import { useState, useEffect } from "react"
import { Department, ActivityType, ViewMode, ActivityFilters } from "@/types/activity"
import ActivitiesHeader from "@/components/kegiatan/activities-header"
import ActivitiesFilters from "@/components/kegiatan/activities-filters"
import GridView from "@/components/kegiatan/grid-view"
import TimelineView from "@/components/kegiatan/timeline-view"
import Footer from "@/components/footer"
import { Loader2 } from "lucide-react"

const ITEMS_PER_PAGE = 9

export default function KegiatanPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<ActivityFilters>({
    departments: [],
    years: [],
    types: [],
    searchQuery: "",
  })

  // State for API data
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        })

        if (filters.departments.length > 0) {
          filters.departments.forEach(dept => params.append('department', dept))
        }
        if (filters.years.length > 0) {
          filters.years.forEach(year => params.append('year', year.toString()))
        }
        if (filters.types.length > 0) {
          filters.types.forEach(type => params.append('type', type))
        }
        if (searchQuery) {
          params.append('search', searchQuery)
        }

        const response = await fetch(`/api/activities?${params}`)
        if (!response.ok) throw new Error('Failed to fetch activities')

        const data = await response.json()
        setActivities(data.activities || [])
        setTotalPages(data.pagination.total_pages)
        setTotalActivities(data.pagination.total)
      } catch (error) {
        console.error('Error fetching activities:', error)
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [currentPage, filters, searchQuery])

  // Calculate statistics from fetched data
  const availableYears = Array.from(new Set(activities.map(a => a.year))).sort((a, b) => b - a)
  const activeDepartments = new Set(activities.map(a => a.department)).size
  const activeYears = availableYears.length

  // Active filter count
  const activeFilterCount =
    filters.departments.length + filters.years.length + filters.types.length

  // Filter handlers
  const handleDepartmentToggle = (dept: Department) => {
    setFilters((prev) => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter((d) => d !== dept)
        : [...prev.departments, dept],
    }))
    setCurrentPage(1)
  }

  const handleYearToggle = (year: number) => {
    setFilters((prev) => ({
      ...prev,
      years: prev.years.includes(year)
        ? prev.years.filter((y) => y !== year)
        : [...prev.years, year],
    }))
    setCurrentPage(1)
  }

  const handleTypeToggle = (type: ActivityType) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }))
    setCurrentPage(1)
  }

  const handleClearAll = () => {
    setFilters({
      departments: [],
      years: [],
      types: [],
      searchQuery: "",
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchQuery])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <ActivitiesHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        totalActivities={totalActivities}
        activeDepartments={activeDepartments}
        activeYears={activeYears}
      />

      {/* Main Content */}
      <div className="flex-grow py-12 bg-gradient-to-b from-white to-surface">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <ActivitiesFilters
                selectedDepartments={filters.departments}
                selectedYears={filters.years}
                selectedTypes={filters.types}
                availableYears={availableYears}
                onDepartmentToggle={handleDepartmentToggle}
                onYearToggle={handleYearToggle}
                onTypeToggle={handleTypeToggle}
                onClearAll={handleClearAll}
                activeFilterCount={activeFilterCount}
              />
            </aside>

            {/* Content Area */}
            <main className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald" />
                </div>
              ) : viewMode === "grid" ? (
                <GridView
                  activities={activities}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              ) : (
                <TimelineView activities={activities} />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
