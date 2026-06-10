import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { StageBadge } from './StageBadge'
import { PriorityBadge } from './PriorityBadge'
import { ENQUIRY_SOURCE_LABELS, type AdmissionLead } from '../types'

interface AdmissionsTableProps {
  leads: AdmissionLead[]
  loading?: boolean
  onLeadClick: (lead: AdmissionLead) => void
}

export function AdmissionsTable({ leads, loading, onLeadClick }: AdmissionsTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-xl border border-border bg-card p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (leads.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead className="hidden md:table-cell">Parent</TableHead>
            <TableHead className="hidden lg:table-cell">Grade</TableHead>
            <TableHead className="hidden sm:table-cell">Source</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Assigned</TableHead>
            <TableHead className="hidden xl:table-cell">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer"
              onClick={() => onLeadClick(lead)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={lead.studentName} size="sm" />
                  <div>
                    <p className="font-medium">{lead.studentName}</p>
                    <p className="text-xs text-muted-foreground">{lead.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {lead.parentName}
              </TableCell>
              <TableCell className="hidden lg:table-cell">{lead.gradeApplying}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {ENQUIRY_SOURCE_LABELS[lead.source]}
              </TableCell>
              <TableCell><StageBadge stage={lead.stage} /></TableCell>
              <TableCell className="hidden md:table-cell">
                <PriorityBadge priority={lead.priority} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {lead.assignedTo}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-muted-foreground">
                {format(new Date(lead.createdAt), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
