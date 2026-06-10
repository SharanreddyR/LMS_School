import type { ModuleId } from '@/types/common'
import type { UserRole } from '@/types/auth'
import { ROUTES } from './routes'
import { canAccessModule } from './permissions'

/** Maps route paths to the module that guards them. null = any authenticated user. */
export const ROUTE_MODULE_MAP: Record<string, ModuleId | null> = {
  [ROUTES.DASHBOARD]: null,
  [ROUTES.PROFILE]: null,

  [ROUTES.ADMISSIONS.ROOT]: 'admissions',
  [ROUTES.ADMISSIONS.SETUP]: 'admissions',
  [ROUTES.ADMISSIONS.ENQUIRIES]: 'admissions',
  [ROUTES.ADMISSIONS.PIPELINE]: 'admissions',
  [ROUTES.ADMISSIONS.FOLLOW_UPS]: 'admissions',
  [ROUTES.ADMISSIONS.INTERNAL_APPS]: 'admissions',
  [ROUTES.ADMISSIONS.EXTERNAL_APPS]: 'admissions',
  [ROUTES.ADMISSIONS.CONVERSION]: 'admissions',

  [ROUTES.STUDENTS]: 'students',
  [ROUTES.TEACHERS]: 'teachers',
  [ROUTES.PARENTS]: 'parents',

  [ROUTES.LMS.COURSES]: 'lms',
  [ROUTES.LMS.ASSIGNMENTS]: 'lms',

  [ROUTES.ATTENDANCE]: 'attendance',
  [ROUTES.TIMETABLE]: 'timetable',
  [ROUTES.HOMEWORK]: 'homework',
  [ROUTES.ANNOUNCEMENTS]: 'announcements',
  [ROUTES.EXAMINATIONS]: 'examinations',
  [ROUTES.FEES]: 'fees',
  [ROUTES.TRANSPORT]: 'transport',
  [ROUTES.LIBRARY]: 'library',
  [ROUTES.REPORTS]: 'reports',
}

/** Roles allowed on the profile page (not module-based) */
export const PROFILE_ROLES: UserRole[] = ['student', 'parent']

export function getModuleForPath(path: string): ModuleId | null | undefined {
  return ROUTE_MODULE_MAP[path]
}

export function canAccessPath(role: UserRole, path: string): boolean {
  const module = ROUTE_MODULE_MAP[path]
  if (module === undefined) return true
  if (module === null) return true
  return canAccessModule(role, module)
}
