import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_ROUTE_BY_ROLE } from '@/config/permissions'
import type { UserRole } from '@/types/auth'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={DEFAULT_ROUTE_BY_ROLE[user.role]} replace />
  }

  return <Outlet />
}
