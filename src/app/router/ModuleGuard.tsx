import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { canAccessModule, DEFAULT_ROUTE_BY_ROLE } from '@/config/permissions'
import type { ModuleId } from '@/types/common'

interface ModuleGuardProps {
  module: ModuleId
  children: ReactNode
}

/**
 * Enforces role-based access for a module at the route level.
 * Redirects unauthorized users to their default dashboard.
 */
export function ModuleGuard({ module, children }: ModuleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!canAccessModule(user.role, module)) {
    return <Navigate to={DEFAULT_ROUTE_BY_ROLE[user.role]} replace />
  }

  return children
}
