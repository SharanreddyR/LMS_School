export interface StatMetric {
  id: string
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ModuleId =
  | 'admissions'
  | 'students'
  | 'teachers'
  | 'parents'
  | 'lms'
  | 'academics'
  | 'attendance'
  | 'examinations'
  | 'fees'
  | 'reports'
  | 'announcements'
  | 'timetable'
  | 'transport'
  | 'library'
  | 'homework'
