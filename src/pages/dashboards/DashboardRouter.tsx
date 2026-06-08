import { useAuthStore } from '@/stores/auth.store'
import { SuperAdminDashboard } from './SuperAdminDashboard'
import { SchoolAdminDashboard } from './SchoolAdminDashboard'
import { AdmissionDashboard } from './AdmissionDashboard'
import { TeacherDashboard } from './TeacherDashboard'
import { StudentDashboard } from './StudentDashboard'
import { ParentDashboard } from './ParentDashboard'

export function DashboardRouter() {
  const role = useAuthStore((s) => s.user?.role)

  switch (role) {
    case 'super_admin':
      return <SuperAdminDashboard />
    case 'school_admin':
      return <SchoolAdminDashboard />
    case 'admission_team':
      return <AdmissionDashboard />
    case 'teacher':
      return <TeacherDashboard />
    case 'student':
      return <StudentDashboard />
    case 'parent':
      return <ParentDashboard />
    default:
      return <SchoolAdminDashboard />
  }
}
