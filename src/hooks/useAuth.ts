import { useAuthStore } from '@/stores/auth.store'
import { canAccessModule } from '@/config/permissions'
import type { ModuleId } from '@/types/common'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  const hasModuleAccess = (module: ModuleId) =>
    user ? canAccessModule(user.role, module) : false

  return { user, isAuthenticated, login, logout, hasModuleAccess }
}
