import { NavLink, useLocation } from 'react-router-dom'
import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  MessageSquare,
  GitBranch,
  CalendarClock,
  FileInput,
  Globe,
  UserCheck,
  Settings2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/stores/auth.store'
import { useAdmissionSetup } from '../hooks/useAdmissionSetup'
import type { AdmissionFeatureKey } from '../types/setup'
import type { UserRole } from '@/types/auth'

type NavFeature = AdmissionFeatureKey | null

interface NavLinkItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  end?: boolean
  feature: NavFeature
  roles?: UserRole[]
}

const LINKS: NavLinkItem[] = [
  { to: ROUTES.ADMISSIONS.ROOT, label: 'Dashboard', icon: LayoutDashboard, end: true, feature: null },
  {
    to: ROUTES.ADMISSIONS.SETUP,
    label: 'Setup',
    icon: Settings2,
    feature: null,
    roles: ['super_admin', 'school_admin'],
  },
  { to: ROUTES.ADMISSIONS.ENQUIRIES, label: 'Enquiries', icon: MessageSquare, feature: 'enquiry' },
  { to: ROUTES.ADMISSIONS.PIPELINE, label: 'Pipeline', icon: GitBranch, feature: 'enquiry' },
  { to: ROUTES.ADMISSIONS.FOLLOW_UPS, label: 'Follow-ups', icon: CalendarClock, feature: 'followUps' },
  {
    to: ROUTES.ADMISSIONS.INTERNAL_APPS,
    label: 'Internal Apps',
    icon: FileInput,
    feature: 'internalApplication',
  },
  {
    to: ROUTES.ADMISSIONS.EXTERNAL_APPS,
    label: 'External Apps',
    icon: Globe,
    feature: 'externalApplication',
  },
  { to: ROUTES.ADMISSIONS.CONVERSION, label: 'Conversion', icon: UserCheck, feature: 'conversion' },
]

function isLinkVisible(
  link: NavLinkItem,
  role: UserRole,
  isYearActive: boolean,
  isFeatureEnabled: (f: AdmissionFeatureKey) => boolean,
  pathname: string,
) {
  if (link.roles && !link.roles.includes(role)) return false
  if (link.to === ROUTES.ADMISSIONS.SETUP) return true
  if (link.to === ROUTES.ADMISSIONS.ROOT) return true
  if (pathname.startsWith(link.to)) return true
  if (!isYearActive) return false
  if (!link.feature) return true
  return isFeatureEnabled(link.feature)
}

export function AdmissionsSubNav() {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const { isYearActive, isFeatureEnabled } = useAdmissionSetup()
  const role = user?.role ?? 'student'

  const visibleLinks = LINKS.filter((link) =>
    isLinkVisible(link, role, isYearActive, isFeatureEnabled, pathname),
  )

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 scrollbar-thin">
      {visibleLinks.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
