import { format, isPast, isToday } from 'date-fns'
import { Phone, Mail, MapPin, Users, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from './PriorityBadge'
import type { FollowUp } from '../types'
import { cn } from '@/lib/utils'

const TYPE_ICONS = {
  call: Phone,
  email: Mail,
  visit: MapPin,
  meeting: Users,
}

interface FollowUpCardProps {
  followUp: FollowUp
  onToggle: (id: string) => void
  onLeadClick?: (leadId: string) => void
}

export function FollowUpCard({ followUp, onToggle, onLeadClick }: FollowUpCardProps) {
  const Icon = TYPE_ICONS[followUp.type]
  const due = new Date(followUp.dueDate)
  const overdue = !followUp.completed && isPast(due) && !isToday(due)
  const dueToday = !followUp.completed && isToday(due)

  return (
    <Card className={cn(overdue && 'border-red-200 bg-red-50/30', dueToday && 'border-amber-200 bg-amber-50/30')}>
      <CardContent className="flex items-start gap-4 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => onToggle(followUp.id)}
          aria-label={followUp.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {followUp.completed ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50">
              <Icon className="h-3.5 w-3.5 text-brand-600" />
            </div>
            <p className={cn('font-medium', followUp.completed && 'line-through text-muted-foreground')}>
              {followUp.title}
            </p>
            <PriorityBadge priority={followUp.priority} />
          </div>

          {followUp.description && (
            <p className="mt-1 text-sm text-muted-foreground">{followUp.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <button
              type="button"
              className="font-medium text-brand-600 hover:underline"
              onClick={() => onLeadClick?.(followUp.leadId)}
            >
              {followUp.leadName}
            </button>
            <span>·</span>
            <span>{followUp.assignedTo}</span>
            <span>·</span>
            <span className={cn(overdue && 'font-medium text-red-600', dueToday && 'font-medium text-amber-600')}>
              {overdue ? 'Overdue — ' : dueToday ? 'Due today — ' : 'Due '}
              {format(due, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
