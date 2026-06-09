"use client"

import { Department, ActivityType, DEPARTMENT_COLORS } from "@/types/activity"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface ActivitiesFiltersProps {
  selectedDepartments: Department[]
  selectedYears: number[]
  selectedTypes: ActivityType[]
  availableYears: number[]
  onDepartmentToggle: (dept: Department) => void
  onYearToggle: (year: number) => void
  onTypeToggle: (type: ActivityType) => void
  onClearAll: () => void
  activeFilterCount: number
}

export default function ActivitiesFilters({
  selectedDepartments,
  selectedYears,
  selectedTypes,
  availableYears,
  onDepartmentToggle,
  onYearToggle,
  onTypeToggle,
  onClearAll,
  activeFilterCount,
}: ActivitiesFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full border-2 border-emerald text-emerald hover:bg-emerald hover:text-white font-semibold"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter & Sortir
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-emerald text-white">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {(isOpen || true) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:block ${!isOpen ? "hidden lg:block" : ""}`}
          >
            <div className="bg-white rounded-xl border-2 border-border-custom p-6 space-y-6 sticky top-24">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald" />
                  <h3 className="text-lg font-bold text-text-primary">Filter</h3>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-emerald text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-xs text-text-secondary hover:text-red-500"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Department Filter */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">Departemen</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(Department).map((dept) => {
                    const isSelected = selectedDepartments.includes(dept)
                    return (
                      <button
                        key={dept}
                        onClick={() => onDepartmentToggle(dept)}
                        className={`text-xs px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? DEPARTMENT_COLORS[dept] + " font-semibold"
                            : "border-gray-200 text-text-secondary hover:border-emerald"
                        }`}
                      >
                        {dept}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">Tahun</h4>
                <div className="flex flex-wrap gap-2">
                  {availableYears.map((year) => {
                    const isSelected = selectedYears.includes(year)
                    return (
                      <button
                        key={year}
                        onClick={() => onYearToggle(year)}
                        className={`text-xs px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-emerald text-white border-emerald font-semibold"
                            : "border-gray-200 text-text-secondary hover:border-emerald"
                        }`}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Activity Type Filter */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">Jenis Kegiatan</h4>
                <div className="space-y-2">
                  {Object.values(ActivityType).map((type) => {
                    const isSelected = selectedTypes.includes(type)
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onTypeToggle(type)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-emerald peer-checked:border-emerald transition-all duration-200 flex items-center justify-center">
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                          {type}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Info */}
              <div className="pt-4 border-t border-border-custom">
                <p className="text-xs text-text-secondary leading-relaxed">
                  Filter kegiatan berdasarkan departemen, tahun, dan jenis untuk menemukan kegiatan yang kamu cari.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
