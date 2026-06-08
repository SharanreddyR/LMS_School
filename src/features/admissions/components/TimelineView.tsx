import { format } from 'date-fns'
import {
  Phone,
  Mail,
  FileText,
  Users,
  ArrowRight,
  StickyNote,
  Calendar,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StageBadge } from './StageBadge'
import type { AdmissionLead, Activity } from '../types'

const ACTIVITY_ICONS: Record<Activity['type'], typeof Phone> = {
  call: Phone,
  email: Mail,
  document: FileText,
  meeting: Users,
  status_change: ArrowRight,
  note: StickyNote,
  follow_up: Calendar,
}

interface TimelineViewProps {
  leads: AdmissionLead[]
  loading?: boolean
  onLeadClick: (lead: AdmissionLead) => void
}

export function TimelineView({ leads, loading, onLeadClick }: TimelineViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  const events = leads
    .flatMap((lead) =>
      lead.activities.map((activity) => ({
        ...activity,
        lead,
      })),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (events.length === 0) {
    return null
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-5 top-2 bottom-2 w-px bg-border" />
      {events.map((event) => {
        const Icon = ACTIVITY_ICONS[event.type]
        return (
          <div key={event.id} className="relative flex gap-4 pb-6">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <Icon className="h-4 w-4 text-brand-600" />
            </div>
            <Card
              className="flex-1 cursor-pointer transition-shadow hover:shadow-[var(--shadow-elevated)]"
              onClick={() => onLeadClick(event.lead)}
            >
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {event.lead.studentName} · {event.lead.id}
                    </p>
                  </div>
                  <StageBadge stage={event.lead.stage} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{event.user}</span>
                  <span>·</span>
                  <span>{format(new Date(event.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
