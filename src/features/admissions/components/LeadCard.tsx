import { Calendar, Mail, Phone, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { StageBadge } from './StageBadge'
import { PriorityBadge } from './PriorityBadge'
import { ENQUIRY_SOURCE_LABELS, type AdmissionLead } from '../types'
import { format } from 'date-fns'

interface LeadCardProps {
  lead: AdmissionLead
  onClick: (lead: AdmissionLead) => void
  compact?: boolean
}

export function LeadCard({ lead, onClick, compact }: LeadCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:border-brand-300 hover:shadow-[var(--shadow-elevated)]"
      onClick={() => onClick(lead)}
    >
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-start gap-3">
          <Avatar name={lead.studentName} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold">{lead.studentName}</p>
                <p className="truncate text-xs text-muted-foreground">{lead.id}</p>
              </div>
              <PriorityBadge priority={lead.priority} />
            </div>

            {!compact && (
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  {lead.parentName}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  {lead.email}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </p>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StageBadge stage={lead.stage} />
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{lead.gradeApplying}</span>
              <span className="text-xs text-muted-foreground">{ENQUIRY_SOURCE_LABELS[lead.source]}</span>
            </div>

            {lead.nextFollowUp && !compact && (
              <p className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                <Calendar className="h-3 w-3" />
                Follow-up: {format(new Date(lead.nextFollowUp), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
