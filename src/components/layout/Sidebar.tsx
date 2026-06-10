import { GraduationCap, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { RoleBadge } from '@/components/common/RoleBadge'
import { SidebarNav } from './SidebarNav'
import { getNavigationForRole } from '@/config/navigation'
import { DEFAULT_ROUTE_BY_ROLE } from '@/config/permissions'
import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { ROLE_LABELS, type UserRole } from '@/types/auth'

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

const DEMO_ROLES = Object.keys(ROLE_LABELS) as UserRole[]

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const user = useAuthStore((s) => s.user)
  const switchRole = useAuthStore((s) => s.switchRole)
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const navigate = useNavigate()

  if (!user) return null

  const navItems = getNavigationForRole(user.role)
  const collapsed = !mobile && sidebarCollapsed

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role)
    navigate(DEFAULT_ROUTE_BY_ROLE[role], { replace: true })
    onClose?.()
  }

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-all duration-300',
        mobile ? 'w-72' : collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      {/* Logo + collapse toggle */}
      <div
        className={cn(
          'border-b border-border',
          collapsed
            ? 'flex flex-col items-center gap-2 px-2 py-3'
            : 'flex h-16 items-center gap-3 px-4',
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">EduNexus</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.schoolName ?? 'School ERP + LMS'}
            </p>
          </div>
        )}
        {!mobile && (
          <Button
            variant="ghost"
            size="icon"
            className={cn('shrink-0', collapsed && 'h-8 w-8')}
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <SidebarNav items={navItems} collapsed={collapsed} onNavigate={onClose} />
      </div>

      {/* User */}
      {!collapsed && (
        <div className="border-t border-border p-4">
          <div className="space-y-3 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <RoleBadge role={user.role} />
              </div>
            </div>
            {env.useMockApi && (
              <div className="space-y-1.5">
                <label htmlFor="demo-role-switch" className="text-xs font-medium text-muted-foreground">
                  Switch user
                </label>
                <Select
                  id="demo-role-switch"
                  value={user.role}
                  onChange={(e) => handleRoleSwitch(e.target.value as UserRole)}
                  className="h-9 text-xs"
                >
                  {DEMO_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
