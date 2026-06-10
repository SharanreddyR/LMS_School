import { useState } from 'react'
import { format } from 'date-fns'
import { Mail, Phone, User, GraduationCap, Tag, FileText, Wallet, UserCheck } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { StageBadge } from './StageBadge'
import { PriorityBadge } from './PriorityBadge'
import { NotesSection } from './NotesSection'
import { ActivityLog } from './ActivityLog'
import { ApplicationFormSheet } from './ApplicationFormSheet'
import { ApplicationDetailsPanel } from './ApplicationDetailsPanel'
import { FeePaymentSheet } from './FeePaymentSheet'
import {
  EnquiryProcessSteps,
  canFillApplication,
  canRecordFee,
  canConvertToStudent,
} from './EnquiryProcessSteps'
import {
  PIPELINE_STAGES,
  SOURCE_LABELS,
  type AdmissionLead,
  type PipelineStage,
} from '../types'
import type { ApplicationFormData, FeePaymentMode } from '../types/application'

interface LeadDetailSheetProps {
  lead: AdmissionLead | null
  open: boolean
  onClose: () => void
  onStageChange: (leadId: string, stage: PipelineStage) => void
  onAddNote: (leadId: string, content: string) => void
  onSubmitApplication: (leadId: string, form: ApplicationFormData) => void
  onRecordFeePayment: (leadId: string, amount: number, mode: FeePaymentMode) => void
  onConvertToStudent: (leadId: string) => string | null
}

export function LeadDetailSheet({
  lead,
  open,
  onClose,
  onStageChange,
  onAddNote,
  onSubmitApplication,
  onRecordFeePayment,
  onConvertToStudent,
}: LeadDetailSheetProps) {
  const [applicationOpen, setApplicationOpen] = useState(false)
  const [feeOpen, setFeeOpen] = useState(false)
  const [convertMessage, setConvertMessage] = useState<string | null>(null)

  if (!lead) return null

  const showFillApplication = canFillApplication(lead)
  const showRecordFee = canRecordFee(lead)
  const showConvert = canConvertToStudent(lead)

  const handleConvert = () => {
    const studentId = onConvertToStudent(lead.id)
    if (studentId) {
      setConvertMessage(studentId)
      setTimeout(() => setConvertMessage(null), 4000)
    }
  }

  return (
    <>
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

          <EnquiryProcessSteps lead={lead} />

          {(showFillApplication || showRecordFee || showConvert) && (
            <div className="flex flex-wrap gap-2">
              {showFillApplication && (
                <Button className="gap-2" onClick={() => setApplicationOpen(true)}>
                  <FileText className="h-4 w-4" />
                  Fill Application
                </Button>
              )}
              {showRecordFee && (
                <Button variant="outline" className="gap-2" onClick={() => setFeeOpen(true)}>
                  <Wallet className="h-4 w-4" />
                  Record Fee Payment
                </Button>
              )}
              {showConvert && (
                <Button variant="default" className="gap-2 bg-green-600 hover:bg-green-700" onClick={handleConvert}>
                  <UserCheck className="h-4 w-4" />
                  Convert to Student
                </Button>
              )}
            </div>
          )}

          {convertMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
              Successfully enrolled as student <strong>{convertMessage}</strong>
            </div>
          )}

          {lead.applicationForm?.submittedAt && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs text-amber-900">
              Application submitted on {format(new Date(lead.applicationForm.submittedAt), 'MMM d, yyyy h:mm a')}
            </div>
          )}

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

          <Tabs defaultValue={lead.applicationForm?.submittedAt ? 'application' : 'notes'}>
            <TabsList className="w-full">
              {lead.applicationForm?.submittedAt && (
                <TabsTrigger value="application" className="flex-1">Application</TabsTrigger>
              )}
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
            </TabsList>
            {lead.applicationForm?.submittedAt && (
              <TabsContent value="application">
                <ApplicationDetailsPanel form={lead.applicationForm} />
              </TabsContent>
            )}
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

      <ApplicationFormSheet
        lead={lead}
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        onSubmit={onSubmitApplication}
      />

      <FeePaymentSheet
        lead={lead}
        open={feeOpen}
        onClose={() => setFeeOpen(false)}
        onSubmit={onRecordFeePayment}
      />
    </>
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
