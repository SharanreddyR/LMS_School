import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_ROUTE_BY_ROLE } from '@/config/permissions'
import type { UserRole } from '@/types/auth'
import type { ReactNode } from 'react'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={user ? DEFAULT_ROUTE_BY_ROLE[user.role] : '/login'} replace />
  }

  return children
}
