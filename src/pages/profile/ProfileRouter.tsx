import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { StudentProfilePage } from '@/features/students/pages/StudentProfilePage'
import { ParentProfilePage } from '@/features/parents/pages/ParentProfilePage'

export function ProfileRouter() {
  const role = useAuthStore((s) => s.user?.role)

  if (role === 'student') return <StudentProfilePage />
  if (role === 'parent') return <ParentProfilePage />

  return <Navigate to="/dashboard" replace />
}
