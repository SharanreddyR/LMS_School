import type { LucideIcon } from 'lucide-react'
import type { UserRole } from './auth'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
  children?: NavItem[]
  roles: UserRole[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
