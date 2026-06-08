import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { NavItem } from '@/types/navigation'

interface SidebarNavProps {
  items: NavItem[]
  collapsed?: boolean
  onNavigate?: () => void
}

export function SidebarNav({ items, collapsed, onNavigate }: SidebarNavProps) {
  const location = useLocation()
  const [expanded, setExpanded] = useState<string[]>([])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0
        const active = isActive(item.href)
        const isExpanded = expanded.includes(item.id) || active

        if (hasChildren) {
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-brand-50 text-brand-700' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && <Badge variant="warning">{item.badge}</Badge>}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                  </>
                )}
              </button>
              {!collapsed && isExpanded && item.children && (
                <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.href}
                      onClick={onNavigate}
                      className={({ isActive: childActive }) =>
                        cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                          childActive
                            ? 'bg-brand-50 font-medium text-brand-700'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      <child.icon className="h-4 w-4" />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        }

        return (
          <NavLink
            key={item.id}
            to={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive: linkActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                linkActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && <Badge variant="warning">{item.badge}</Badge>}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
