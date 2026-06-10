import type { UserRole } from '@/types/auth'
import type { ModuleId } from '@/types/common'

export const MODULE_ACCESS: Record<ModuleId, UserRole[]> = {
  admissions: ['super_admin', 'school_admin', 'admission_team'],
  students: ['super_admin', 'school_admin', 'admission_team', 'teacher'],
  teachers: ['super_admin', 'school_admin'],
  parents: ['super_admin', 'school_admin', 'parent'],
  lms: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  academics: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  attendance: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  examinations: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  fees: ['super_admin', 'school_admin', 'parent'],
  reports: ['super_admin', 'school_admin', 'teacher'],
  announcements: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  timetable: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  transport: ['super_admin', 'school_admin', 'parent'],
  library: ['super_admin', 'school_admin', 'teacher', 'student'],
  homework: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
}

export function canAccessModule(role: UserRole, module: ModuleId): boolean {
  return MODULE_ACCESS[module].includes(role)
}

export const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  super_admin: '/dashboard',
  school_admin: '/dashboard',
  admission_team: '/admissions',
  teacher: '/dashboard',
  student: '/dashboard',
  parent: '/dashboard',
}
