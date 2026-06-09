import { Activity, ActivityFilters, Department, ActivityType, SortOption } from "@/types/activity"

/**
 * Filter activities based on provided filters
 */
export function filterActivities(
  activities: Activity[],
  filters: ActivityFilters
): Activity[] {
  let filtered = [...activities]

  // Filter by departments
  if (filters.departments.length > 0) {
    filtered = filtered.filter((activity) =>
      filters.departments.includes(activity.department)
    )
  }

  // Filter by years
  if (filters.years.length > 0) {
    filtered = filtered.filter((activity) =>
      filters.years.includes(activity.year)
    )
  }

  // Filter by types
  if (filters.types.length > 0) {
    filtered = filtered.filter((activity) =>
      filters.types.includes(activity.type)
    )
  }

  // Filter by search query
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (activity) =>
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.location.toLowerCase().includes(query)
    )
  }

  return filtered
}

/**
 * Sort activities based on sort option
 */
export function sortActivities(
  activities: Activity[],
  sortOption: SortOption
): Activity[] {
  const sorted = [...activities]

  switch (sortOption) {
    case "date-desc":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case "date-asc":
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case "name-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return sorted
  }
}

/**
 * Get unique years from activities
 */
export function getUniqueYears(activities: Activity[]): number[] {
  const years = activities.map((activity) => activity.year)
  return [...new Set(years)].sort((a, b) => b - a)
}

/**
 * Get activity count by department
 */
export function getActivityCountByDepartment(
  activities: Activity[]
): Record<Department, number> {
  const counts = {} as Record<Department, number>

  // Initialize all departments with 0
  Object.values(Department).forEach((dept) => {
    counts[dept] = 0
  })

  // Count activities
  activities.forEach((activity) => {
    counts[activity.department]++
  })

  return counts
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * Get month-year string for grouping
 */
export function getMonthYear(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })
}

/**
 * Group activities by year for timeline view
 */
export function groupActivitiesByYear(
  activities: Activity[]
): Record<number, Activity[]> {
  const grouped: Record<number, Activity[]> = {}

  activities.forEach((activity) => {
    if (!grouped[activity.year]) {
      grouped[activity.year] = []
    }
    grouped[activity.year].push(activity)
  })

  // Sort activities within each year by date (newest first)
  Object.keys(grouped).forEach((year) => {
    grouped[Number(year)].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })

  return grouped
}

/**
 * Paginate activities
 */
export function paginateActivities(
  activities: Activity[],
  page: number,
  itemsPerPage: number
): { items: Activity[]; totalPages: number } {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const items = activities.slice(startIndex, endIndex)
  const totalPages = Math.ceil(activities.length / itemsPerPage)

  return { items, totalPages }
}
