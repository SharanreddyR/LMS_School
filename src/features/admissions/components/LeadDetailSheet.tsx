import { format } from 'date-fns'
import { Mail, Phone, User, GraduationCap, Tag } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { StageBadge } from './StageBadge'
import { PriorityBadge } from './PriorityBadge'
import { NotesSection } from './NotesSection'
import { ActivityLog } from './ActivityLog'
import {
  PIPELINE_STAGES,
  SOURCE_LABELS,
  type AdmissionLead,
  type PipelineStage,
} from '../types'

interface LeadDetailSheetProps {
  lead: AdmissionLead | null
  open: boolean
  onClose: () => void
  onStageChange: (leadId: string, stage: PipelineStage) => void
  onAddNote: (leadId: string, content: string) => void
}

export function LeadDetailSheet({
  lead,
  open,
  onClose,
  onStageChange,
  onAddNote,
}: LeadDetailSheetProps) {
  if (!lead) return null

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={lead.studentName}
      description={`${lead.id} · ${lead.gradeApplying}`}
    >
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Avatar name={lead.studentName} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              <StageBadge stage={lead.stage} />
              <PriorityBadge priority={lead.priority} />
              {lead.applicationType && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                  {lead.applicationType}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Move to stage</label>
          <Select
            value={lead.stage}
            onChange={(e) => onStageChange(lead.id, e.target.value as PipelineStage)}
          >
            {PIPELINE_STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </Select>
        </div>

        <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          <InfoRow icon={User} label="Parent" value={lead.parentName} />
          <InfoRow icon={Mail} label="Email" value={lead.email} />
          <InfoRow icon={Phone} label="Phone" value={lead.phone} />
          <InfoRow icon={GraduationCap} label="Grade" value={lead.gradeApplying} />
          <InfoRow icon={Tag} label="Source" value={SOURCE_LABELS[lead.source]} />
          <InfoRow icon={User} label="Assigned" value={lead.assignedTo} />
          {lead.interviewDate && (
            <InfoRow
              icon={GraduationCap}
              label="Interview"
              value={format(new Date(lead.interviewDate), 'MMM d, yyyy')}
            />
          )}
          {lead.convertedStudentId && (
            <InfoRow icon={GraduationCap} label="Student ID" value={lead.convertedStudentId} />
          )}
        </div>

        {lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {lead.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                {tag}
              </span>
            ))}
          </div>
        )}

        <Tabs defaultValue="notes">
          <TabsList className="w-full">
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="notes">
            <NotesSection
              notes={lead.notes}
              onAddNote={(content) => onAddNote(lead.id, content)}
            />
          </TabsContent>
          <TabsContent value="activity">
            <ActivityLog activities={lead.activities} />
          </TabsContent>
        </Tabs>
      </div>
    </Sheet>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
