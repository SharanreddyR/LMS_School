import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  GitBranch,
  CalendarClock,
  FileInput,
  Globe,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/admissions', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admissions/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admissions/pipeline', label: 'Pipeline', icon: GitBranch },
  { to: '/admissions/follow-ups', label: 'Follow-ups', icon: CalendarClock },
  { to: '/admissions/applications/internal', label: 'Internal Apps', icon: FileInput },
  { to: '/admissions/applications/external', label: 'External Apps', icon: Globe },
  { to: '/admissions/conversion', label: 'Conversion', icon: UserCheck },
]

export function AdmissionsSubNav() {
  return (
    <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 scrollbar-thin">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
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
