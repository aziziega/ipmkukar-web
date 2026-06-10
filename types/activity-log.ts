/**
 * Activity Log Types and Enums
 * For tracking admin activities in the system
 */

// Action types that can be logged
export enum ActivityAction {
  // CRUD Operations
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  
  // Auth Operations
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  
  // Special Operations
  REORDER = 'reorder',
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
}

// Entity types that can be tracked
export enum EntityType {
  USER = 'user',
  HERO_SLIDE = 'hero_slide',
  TESTIMONIAL = 'testimonial',
  STATISTICS = 'statistics',
  ORGANIZATIONAL_STRUCTURE = 'organizational_structure',
  ACTIVITY = 'activity',
  SESSION = 'session',
}

// Main activity log interface
export interface ActivityLog {
  id: string
  user_id: string | null
  user_name?: string // Joined from users table
  user_email?: string // Joined from users table
  action: ActivityAction
  entity_type: EntityType | null
  entity_id: string | null
  details: Record<string, any> | null // JSONB details
  ip_address: string | null
  created_at: string // ISO timestamp
}

// Request filters for fetching activity logs
export interface ActivityLogFilters {
  user_id?: string
  action?: ActivityAction
  entity_type?: EntityType
  date_from?: string // ISO date
  date_to?: string // ISO date
  search?: string
  page?: number
  limit?: number
}

// API Response for activity logs list
export interface ActivityLogsResponse {
  success: boolean
  logs: ActivityLog[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
  error?: string
}

// For logging function parameters
export interface LogActivityParams {
  user_id: string
  action: ActivityAction
  entity_type?: EntityType
  entity_id?: string
  details?: Record<string, any>
  ip_address?: string
}

// Color coding for actions in UI
export const ACTION_COLORS: Record<ActivityAction, string> = {
  [ActivityAction.CREATE]: 'bg-green-100 text-green-700 border-green-200',
  [ActivityAction.UPDATE]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ActivityAction.DELETE]: 'bg-red-100 text-red-700 border-red-200',
  [ActivityAction.LOGIN]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [ActivityAction.LOGOUT]: 'bg-gray-100 text-gray-700 border-gray-200',
  [ActivityAction.LOGIN_FAILED]: 'bg-orange-100 text-orange-700 border-orange-200',
  [ActivityAction.REORDER]: 'bg-purple-100 text-purple-700 border-purple-200',
  [ActivityAction.ACTIVATE]: 'bg-teal-100 text-teal-700 border-teal-200',
  [ActivityAction.DEACTIVATE]: 'bg-slate-100 text-slate-700 border-slate-200',
}

// Icon colors for actions
export const ACTION_DOT_COLORS: Record<ActivityAction, string> = {
  [ActivityAction.CREATE]: 'bg-green-500',
  [ActivityAction.UPDATE]: 'bg-blue-500',
  [ActivityAction.DELETE]: 'bg-red-500',
  [ActivityAction.LOGIN]: 'bg-emerald-500',
  [ActivityAction.LOGOUT]: 'bg-gray-500',
  [ActivityAction.LOGIN_FAILED]: 'bg-orange-500',
  [ActivityAction.REORDER]: 'bg-purple-500',
  [ActivityAction.ACTIVATE]: 'bg-teal-500',
  [ActivityAction.DEACTIVATE]: 'bg-slate-500',
}

// Human-readable labels
export const ACTION_LABELS: Record<ActivityAction, string> = {
  [ActivityAction.CREATE]: 'Created',
  [ActivityAction.UPDATE]: 'Updated',
  [ActivityAction.DELETE]: 'Deleted',
  [ActivityAction.LOGIN]: 'Logged In',
  [ActivityAction.LOGOUT]: 'Logged Out',
  [ActivityAction.LOGIN_FAILED]: 'Login Failed',
  [ActivityAction.REORDER]: 'Reordered',
  [ActivityAction.ACTIVATE]: 'Activated',
  [ActivityAction.DEACTIVATE]: 'Deactivated',
}

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  [EntityType.USER]: 'User',
  [EntityType.HERO_SLIDE]: 'Hero Slide',
  [EntityType.TESTIMONIAL]: 'Testimonial',
  [EntityType.STATISTICS]: 'Statistics',
  [EntityType.ORGANIZATIONAL_STRUCTURE]: 'Organizational Structure',
  [EntityType.ACTIVITY]: 'Activity',
  [EntityType.SESSION]: 'Session',
}
