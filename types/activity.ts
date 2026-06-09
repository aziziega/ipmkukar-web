export enum Department {
  SENI_BUDAYA = "Seni dan Budaya",
  SOSIAL_KEAGAMAAN = "Sosial dan Keagamaan",
  INFOKOM = "Informasi dan Komunikasi",
  PENGEMBANGAN_ORGANISASI = "Pengembangan Organisasi",
  OLAHRAGA = "Olahraga",
  KAJIAN_PENDIDIKAN = "Kajian Strategi dan Pendidikan",
}

export enum ActivityType {
  EVENT = "Event",
  WORKSHOP = "Workshop",
  SOSIAL = "Sosial",
  OLAHRAGA = "Olahraga",
  KAJIAN = "Kajian",
  KADERISASI = "Kaderisasi",
  GATHERING = "Gathering",
}

export interface Activity {
  id: string
  title: string
  description: string
  images: string[]
  department: Department
  date: string // ISO date format
  year: number
  type: ActivityType
  participants?: number
  location: string
}

export interface ActivityFilters {
  departments: Department[]
  years: number[]
  types: ActivityType[]
  searchQuery: string
}

export type ViewMode = "grid" | "timeline"

export type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc"

export const DEPARTMENT_COLORS: Record<Department, string> = {
  [Department.SENI_BUDAYA]: "bg-purple-100 text-purple-700 border-purple-200",
  [Department.SOSIAL_KEAGAMAAN]: "bg-green-100 text-green-700 border-green-200",
  [Department.INFOKOM]: "bg-blue-100 text-blue-700 border-blue-200",
  [Department.PENGEMBANGAN_ORGANISASI]: "bg-amber-100 text-amber-700 border-amber-200",
  [Department.OLAHRAGA]: "bg-red-100 text-red-700 border-red-200",
  [Department.KAJIAN_PENDIDIKAN]: "bg-indigo-100 text-indigo-700 border-indigo-200",
}

export const DEPARTMENT_DOT_COLORS: Record<Department, string> = {
  [Department.SENI_BUDAYA]: "bg-purple-500",
  [Department.SOSIAL_KEAGAMAAN]: "bg-green-500",
  [Department.INFOKOM]: "bg-blue-500",
  [Department.PENGEMBANGAN_ORGANISASI]: "bg-amber-500",
  [Department.OLAHRAGA]: "bg-red-500",
  [Department.KAJIAN_PENDIDIKAN]: "bg-indigo-500",
}
