import { lazy } from 'react'

/** Code-split page imports — each becomes its own chunk at build time */
export const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
export const DashboardRouter = lazy(() =>
  import('@/pages/dashboards/DashboardRouter').then((m) => ({ default: m.DashboardRouter })),
)
export const ProfileRouter = lazy(() =>
  import('@/pages/profile/ProfileRouter').then((m) => ({ default: m.ProfileRouter })),
)
export const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

// Admissions
export const AdmissionsOverviewPage = lazy(() =>
  import('@/features/admissions/pages/AdmissionsOverviewPage').then((m) => ({ default: m.AdmissionsOverviewPage })),
)
export const AdmissionSetupPage = lazy(() =>
  import('@/features/admissions/pages/AdmissionSetupPage').then((m) => ({ default: m.AdmissionSetupPage })),
)
export const EnquiriesPage = lazy(() =>
  import('@/features/admissions/pages/EnquiriesPage').then((m) => ({ default: m.EnquiriesPage })),
)
export const PipelinePage = lazy(() =>
  import('@/features/admissions/pages/PipelinePage').then((m) => ({ default: m.PipelinePage })),
)
export const FollowUpsPage = lazy(() =>
  import('@/features/admissions/pages/FollowUpsPage').then((m) => ({ default: m.FollowUpsPage })),
)
export const InternalApplicationsPage = lazy(() =>
  import('@/features/admissions/pages/InternalApplicationsPage').then((m) => ({ default: m.InternalApplicationsPage })),
)
export const ExternalApplicationsPage = lazy(() =>
  import('@/features/admissions/pages/ExternalApplicationsPage').then((m) => ({ default: m.ExternalApplicationsPage })),
)
export const StudentConversionPage = lazy(() =>
  import('@/features/admissions/pages/StudentConversionPage').then((m) => ({ default: m.StudentConversionPage })),
)

// Core modules
export const StudentsPage = lazy(() =>
  import('@/features/students/pages/StudentsPage').then((m) => ({ default: m.StudentsPage })),
)
export const TeachersPage = lazy(() =>
  import('@/features/teachers/pages/TeachersPage').then((m) => ({ default: m.TeachersPage })),
)
export const ParentsPage = lazy(() =>
  import('@/features/parents/pages/ParentsPage').then((m) => ({ default: m.ParentsPage })),
)

// LMS
export const CoursesPage = lazy(() =>
  import('@/features/lms/pages/CoursesPage').then((m) => ({ default: m.CoursesPage })),
)
export const AssignmentsPage = lazy(() =>
  import('@/features/lms/pages/AssignmentsPage').then((m) => ({ default: m.AssignmentsPage })),
)

// Operations
export const AttendancePage = lazy(() =>
  import('@/features/attendance/pages/AttendancePage').then((m) => ({ default: m.AttendancePage })),
)
export const ExamsPage = lazy(() =>
  import('@/features/examinations/pages/ExamsPage').then((m) => ({ default: m.ExamsPage })),
)
export const FeesPage = lazy(() =>
  import('@/features/fees/pages/FeesPage').then((m) => ({ default: m.FeesPage })),
)
export const ReportsPage = lazy(() =>
  import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
)

export const AnnouncementsPage = lazy(() =>
  import('@/features/announcements/pages/AnnouncementsPage').then((m) => ({ default: m.AnnouncementsPage })),
)
export const TimetablePage = lazy(() =>
  import('@/features/timetable/pages/TimetablePage').then((m) => ({ default: m.TimetablePage })),
)
export const TransportPage = lazy(() =>
  import('@/features/transport/pages/TransportPage').then((m) => ({ default: m.TransportPage })),
)
export const LibraryPage = lazy(() =>
  import('@/features/library/pages/LibraryPage').then((m) => ({ default: m.LibraryPage })),
)
export const HomeworkPage = lazy(() =>
  import('@/features/homework/pages/HomeworkPage').then((m) => ({ default: m.HomeworkPage })),
)

export const PublicExternalApplicationPage = lazy(() =>
  import('@/features/admissions/pages/PublicExternalApplicationPage').then((m) => ({
    default: m.PublicExternalApplicationPage,
  })),
)
