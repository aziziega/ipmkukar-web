"use client"

import { useState, useEffect } from "react"
import { Department, ActivityType, ViewMode, ActivityFilters } from "@/types/activity"
import { activitiesData } from "@/data/activities-data"
import { filterActivities, sortActivities, getUniqueYears, paginateActivities } from "@/lib/activity-utils"
import ActivitiesHeader from "@/components/kegiatan/activities-header"
import ActivitiesFilters from "@/components/kegiatan/activities-filters"
import GridView from "@/components/kegiatan/grid-view"
import TimelineView from "@/components/kegiatan/timeline-view"
import Footer from "@/components/footer"

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

  // Get available years from all activities
  const availableYears = getUniqueYears(activitiesData)

  // Apply filters and search
  const filteredActivities = filterActivities(activitiesData, {
    ...filters,
    searchQuery,
  })

  // Sort by date (newest first)
  const sortedActivities = sortActivities(filteredActivities, "date-desc")

  // Paginate for grid view
  const { items: paginatedActivities, totalPages } = paginateActivities(
    sortedActivities,
    currentPage,
    ITEMS_PER_PAGE
  )

  // Statistics
  const totalActivities = activitiesData.length
  const activeDepartments = new Set(activitiesData.map((a) => a.department)).size
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
              {viewMode === "grid" ? (
                <GridView
                  activities={paginatedActivities}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              ) : (
                <TimelineView activities={sortedActivities} />
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
