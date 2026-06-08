import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS, type UserRole } from '@/types/auth'

const ROLE_VARIANTS: Record<UserRole, 'default' | 'secondary' | 'success' | 'warning'> = {
  super_admin: 'default',
  school_admin: 'default',
  admission_team: 'warning',
  teacher: 'success',
  student: 'secondary',
  parent: 'secondary',
}

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant={ROLE_VARIANTS[role]}>{ROLE_LABELS[role]}</Badge>
}
