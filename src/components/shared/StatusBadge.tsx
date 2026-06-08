import { Badge } from '@/components/ui/badge'

const STATUS_MAP: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  paid: 'success',
  completed: 'success',
  open: 'default',
  scheduled: 'default',
  pending: 'warning',
  partial: 'warning',
  grading: 'warning',
  on_leave: 'warning',
  inactive: 'secondary',
  draft: 'secondary',
  closed: 'secondary',
  overdue: 'destructive',
  archived: 'secondary',
  ongoing: 'warning',
}

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_MAP[status] ?? 'secondary'
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace(/_/g, ' ')}
    </Badge>
  )
}
