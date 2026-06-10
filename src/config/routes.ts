/**
 * Single source of truth for all application routes.
 * Use these constants instead of hardcoded path strings.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  ADMISSIONS: {
    ROOT: '/admissions',
    SETUP: '/admissions/setup',
    ENQUIRIES: '/admissions/enquiries',
    PIPELINE: '/admissions/pipeline',
    FOLLOW_UPS: '/admissions/follow-ups',
    INTERNAL_APPS: '/admissions/applications/internal',
    EXTERNAL_APPS: '/admissions/applications/external',
    CONVERSION: '/admissions/conversion',
  },

  STUDENTS: '/students',
  TEACHERS: '/teachers',
  PARENTS: '/parents',

  LMS: {
    ROOT: '/lms',
    COURSES: '/lms/courses',
    ASSIGNMENTS: '/lms/assignments',
  },

  ATTENDANCE: '/attendance',
  EXAMINATIONS: '/examinations',
  FEES: '/fees',
  REPORTS: '/reports',
  ANNOUNCEMENTS: '/announcements',
  TIMETABLE: '/timetable',
  TRANSPORT: '/transport',
  LIBRARY: '/library',
  HOMEWORK: '/homework',
  APPLY: {
    EXTERNAL: '/apply/external',
  },
  SETTINGS: '/settings',
} as const
