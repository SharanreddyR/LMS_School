import { PRIORITY_LABELS, type Priority } from '../types'

const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
