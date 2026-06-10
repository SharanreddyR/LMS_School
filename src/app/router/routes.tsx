import { Suspense, type ReactNode } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { PublicApplyLayout } from '@/components/layout/PublicApplyLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PageLoader } from '@/components/common/PageLoader'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGuard } from './RoleGuard'
import { ModuleGuard } from './ModuleGuard'
import { ROUTES } from '@/config/routes'
import { PROFILE_ROLES } from '@/config/route-access'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_ROUTE_BY_ROLE } from '@/config/permissions'
import * as Pages from './lazy-pages'

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated || !user) return <Navigate to={ROUTES.LOGIN} replace />
  return <Navigate to={DEFAULT_ROUTE_BY_ROLE[user.role]} replace />
}

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function withModule(module: Parameters<typeof ModuleGuard>[0]['module'], page: ReactNode) {
  return (
    <Lazy>
      <ModuleGuard module={module}>{page}</ModuleGuard>
    </Lazy>
  )
}

function withProfile(page: ReactNode) {
  return (
    <Lazy>
      <RoleGuard allowedRoles={PROFILE_ROLES}>{page}</RoleGuard>
    </Lazy>
  )
}

function withAdminSetup(page: ReactNode) {
  return (
    <Lazy>
      <RoleGuard allowedRoles={['super_admin', 'school_admin']}>{page}</RoleGuard>
    </Lazy>
  )
}

function withLazy(page: ReactNode) {
  return <Lazy>{page}</Lazy>
}

export const routes: RouteObject[] = [
  { path: ROUTES.HOME, element: <RootRedirect /> },

  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <Lazy>
            <Pages.LoginPage />
          </Lazy>
        ),
      },
    ],
  },

  {
    element: <PublicApplyLayout />,
    children: [
      {
        path: ROUTES.APPLY.EXTERNAL,
        element: (
          <Lazy>
            <Pages.PublicExternalApplicationPage />
          </Lazy>
        ),
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: withLazy(<Pages.DashboardRouter />) },

          // Admissions
          { path: ROUTES.ADMISSIONS.ROOT, element: withModule('admissions', <Pages.AdmissionsOverviewPage />) },
          { path: ROUTES.ADMISSIONS.SETUP, element: withModule('admissions', withAdminSetup(<Pages.AdmissionSetupPage />)) },
          { path: ROUTES.ADMISSIONS.ENQUIRIES, element: withModule('admissions', <Pages.EnquiriesPage />) },
          { path: ROUTES.ADMISSIONS.PIPELINE, element: withModule('admissions', <Pages.PipelinePage />) },
          { path: ROUTES.ADMISSIONS.FOLLOW_UPS, element: withModule('admissions', <Pages.FollowUpsPage />) },
          { path: ROUTES.ADMISSIONS.INTERNAL_APPS, element: withModule('admissions', <Pages.InternalApplicationsPage />) },
          { path: ROUTES.ADMISSIONS.EXTERNAL_APPS, element: withModule('admissions', <Pages.ExternalApplicationsPage />) },
          { path: ROUTES.ADMISSIONS.CONVERSION, element: withModule('admissions', <Pages.StudentConversionPage />) },
          { path: '/admissions/inquiries', element: <Navigate to={ROUTES.ADMISSIONS.ENQUIRIES} replace /> },
          { path: '/admissions/applications', element: <Navigate to={ROUTES.ADMISSIONS.INTERNAL_APPS} replace /> },
          { path: '/admissions/enrollment', element: <Navigate to={ROUTES.ADMISSIONS.CONVERSION} replace /> },

          // Profile (student / parent only)
          { path: ROUTES.PROFILE, element: withProfile(<Pages.ProfileRouter />) },

          // Core modules
          { path: ROUTES.STUDENTS, element: withModule('students', <Pages.StudentsPage />) },
          { path: ROUTES.TEACHERS, element: withModule('teachers', <Pages.TeachersPage />) },
          { path: ROUTES.PARENTS, element: withModule('parents', <Pages.ParentsPage />) },

          // LMS
          { path: ROUTES.LMS.COURSES, element: withModule('lms', <Pages.CoursesPage />) },
          { path: ROUTES.LMS.ASSIGNMENTS, element: withModule('lms', <Pages.AssignmentsPage />) },
          { path: ROUTES.LMS.ROOT, element: <Navigate to={ROUTES.LMS.COURSES} replace /> },

          // Attendance & Exams
          { path: ROUTES.ATTENDANCE, element: withModule('attendance', <Pages.AttendancePage />) },
          { path: ROUTES.TIMETABLE, element: withModule('timetable', <Pages.TimetablePage />) },
          { path: ROUTES.HOMEWORK, element: withModule('homework', <Pages.HomeworkPage />) },
          { path: ROUTES.ANNOUNCEMENTS, element: withModule('announcements', <Pages.AnnouncementsPage />) },
          { path: ROUTES.EXAMINATIONS, element: withModule('examinations', <Pages.ExamsPage />) },
          { path: '/examinations/schedule', element: <Navigate to={ROUTES.EXAMINATIONS} replace /> },
          { path: '/examinations/results', element: <Navigate to={ROUTES.EXAMINATIONS} replace /> },

          // Fees & Reports
          { path: ROUTES.FEES, element: withModule('fees', <Pages.FeesPage />) },
          { path: '/fees/structure', element: <Navigate to={ROUTES.FEES} replace /> },
          { path: '/fees/payments', element: <Navigate to={ROUTES.FEES} replace /> },
          { path: ROUTES.TRANSPORT, element: withModule('transport', <Pages.TransportPage />) },
          { path: ROUTES.LIBRARY, element: withModule('library', <Pages.LibraryPage />) },
          { path: ROUTES.REPORTS, element: withModule('reports', <Pages.ReportsPage />) },

          // Legacy redirects
          { path: '/academics', element: <Navigate to={ROUTES.LMS.COURSES} replace /> },
          { path: '/academics/timetable', element: <Navigate to={ROUTES.TIMETABLE} replace /> },
          { path: '/academics/syllabus', element: <Navigate to={ROUTES.LMS.COURSES} replace /> },
          { path: '/lms/resources', element: <Navigate to={ROUTES.LMS.COURSES} replace /> },
          { path: '/students/classes', element: <Navigate to={ROUTES.STUDENTS} replace /> },
          { path: ROUTES.SETTINGS, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          {
            path: '/schools',
            element: (
              <RoleGuard allowedRoles={['super_admin']}>
                <Navigate to={ROUTES.DASHBOARD} replace />
              </RoleGuard>
            ),
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: (
      <Lazy>
        <Pages.NotFoundPage />
      </Lazy>
    ),
  },
]
