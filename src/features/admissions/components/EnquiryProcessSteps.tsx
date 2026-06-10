import {
  CheckCircle2,
  ClipboardList,
  FileCheck,
  GraduationCap,
  MessageSquare,
  PhoneCall,
  SearchCheck,
  UserCheck,
  Wallet,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdmissionLead } from '../types'
import {
  APPLICATION_STATUS_LABELS,
  FEE_STATUS_LABELS,
  areMandatoryDocumentsComplete,
  canConvertToStudent,
  canFillApplication,
  canRecordFee,
} from '../types/application'
import { ENQUIRY_STATUS_LABELS } from '../types/enquiry'

export type AdmissionStepAction = 'fillApplication' | 'recordFee' | 'convert'

const STEPS = [
  { id: 'enquiry', label: 'Enquiry', short: 'Submitted', icon: MessageSquare, hint: 'Enquiry captured' },
  { id: 'followup', label: 'Follow-up', short: 'Counsellor', icon: PhoneCall, hint: 'Schedule follow-up' },
  { id: 'visit', label: 'Visit', short: 'School visit', icon: MapPin, hint: 'Campus interaction' },
  { id: 'application', label: 'Application', short: 'Form opened', icon: ClipboardList, hint: 'Fill application' },
  { id: 'documents', label: 'Documents', short: 'Uploads', icon: FileCheck, hint: 'Upload documents' },
  { id: 'review', label: 'Review', short: 'Admission review', icon: SearchCheck, hint: 'Under review' },
  { id: 'fee', label: 'Fee', short: 'Payment', icon: Wallet, hint: 'Record fee' },
  { id: 'confirmed', label: 'Confirmed', short: 'Admission', icon: UserCheck, hint: 'Confirm admission' },
  { id: 'student', label: 'Student ID', short: 'Enrolled', icon: GraduationCap, hint: 'Generate ID' },
] as const

type StepId = (typeof STEPS)[number]['id']

function isFollowUpDone(lead: AdmissionLead) {
  return (
    ['contacted', 'follow_up', 'visit_scheduled', 'application_sent', 'converted'].includes(lead.enquiryStatus) ||
    ['contacted', 'qualified', 'application', 'interview', 'accepted', 'enrolled'].includes(lead.stage)
  )
}

function isVisitDone(lead: AdmissionLead) {
  return (
    ['visit_scheduled', 'application_sent', 'converted'].includes(lead.enquiryStatus) ||
    ['interview', 'application', 'accepted', 'enrolled'].includes(lead.stage) ||
    Boolean(lead.interviewDate)
  )
}

function isApplicationDone(lead: AdmissionLead) {
  const s = lead.applicationStatus ?? 'not_started'
  return s === 'submitted' || s === 'approved' || lead.stage === 'application' || ['accepted', 'enrolled'].includes(lead.stage)
}

function isDocumentsDone(lead: AdmissionLead) {
  return lead.applicationForm ? areMandatoryDocumentsComplete(lead.applicationForm) : false
}

function isReviewDone(lead: AdmissionLead) {
  return lead.applicationStatus === 'approved' || ['accepted', 'enrolled'].includes(lead.stage)
}

function isFeeDone(lead: AdmissionLead) {
  return lead.fee?.status === 'paid' || lead.fee?.status === 'partial'
}

function isConfirmed(lead: AdmissionLead) {
  return ['accepted', 'enrolled'].includes(lead.stage) || lead.enquiryStatus === 'converted'
}

function isStudentIdDone(lead: AdmissionLead) {
  return lead.stage === 'enrolled' && Boolean(lead.convertedStudentId)
}

function getStepComplete(lead: AdmissionLead, stepId: StepId): boolean {
  if (lead.stage === 'lost' || lead.enquiryStatus === 'closed') return stepId === 'enquiry'
  switch (stepId) {
    case 'enquiry':
      return true
    case 'followup':
      return isFollowUpDone(lead)
    case 'visit':
      return isVisitDone(lead)
    case 'application':
      return isApplicationDone(lead)
    case 'documents':
      return isDocumentsDone(lead)
    case 'review':
      return isReviewDone(lead)
    case 'fee':
      return isFeeDone(lead)
    case 'confirmed':
      return isConfirmed(lead)
    case 'student':
      return isStudentIdDone(lead)
    default:
      return false
  }
}

function getStepState(lead: AdmissionLead, stepId: StepId, index: number): 'complete' | 'current' | 'pending' {
  if (getStepComplete(lead, stepId)) return 'complete'
  const prevComplete = index === 0 || getStepComplete(lead, STEPS[index - 1].id)
  if (prevComplete) return 'current'
  return 'pending'
}

function getStepAction(stepId: StepId, lead: AdmissionLead): AdmissionStepAction | null {
  if (stepId === 'application' && canFillApplication(lead) && !isApplicationDone(lead)) return 'fillApplication'
  if (stepId === 'fee' && canRecordFee(lead)) return 'recordFee'
  if (stepId === 'student' && canConvertToStudent(lead)) return 'convert'
  return null
}

interface EnquiryProcessStepsProps {
  lead: AdmissionLead
  onAction?: (action: AdmissionStepAction) => void
}

export function EnquiryProcessSteps({ lead, onAction }: EnquiryProcessStepsProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Admission Workflow
        </p>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
          Enquiry: {ENQUIRY_STATUS_LABELS[lead.enquiryStatus]} · {lead.enquiryNumber}
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[640px] items-start gap-0">
          {STEPS.map((step, index) => {
            const state = getStepState(lead, step.id, index)
            const action = state === 'current' ? getStepAction(step.id, lead) : null
            const Icon = step.icon
            const clickable = Boolean(action && onAction)

            return (
              <div key={step.id} className="flex flex-1 items-start">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => action && onAction?.(action)}
                  className={cn(
                    'group flex flex-1 flex-col items-center gap-1 rounded-lg px-0.5 py-1 transition-colors',
                    clickable && 'cursor-pointer hover:bg-brand-50/80',
                    !clickable && 'cursor-default',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                      state === 'complete' && 'border-green-500 bg-green-500 text-white',
                      state === 'current' && 'border-brand-600 bg-brand-50 text-brand-600 shadow-sm',
                      state === 'pending' && 'border-muted-foreground/25 bg-muted/40 text-muted-foreground',
                      clickable && 'group-hover:scale-105',
                    )}
                  >
                    {state === 'complete' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <span className={cn('text-[9px] font-semibold text-center leading-tight sm:text-[10px]', state === 'current' && 'text-brand-700', state === 'complete' && 'text-green-700')}>
                    {step.label}
                  </span>
                  {state === 'current' && clickable && (
                    <span className="flex items-center gap-0.5 text-[9px] font-medium text-brand-600">
                      {step.hint}<ChevronRight className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
                {index < STEPS.length - 1 && (
                  <div className={cn('mt-4 h-0.5 w-full min-w-[4px] max-w-[12px]', getStepComplete(lead, step.id) ? 'bg-green-400' : 'bg-border')} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <StatusPill icon={ClipboardList} label={`Application: ${APPLICATION_STATUS_LABELS[lead.applicationStatus ?? 'not_started']}`} active={isApplicationDone(lead)} />
        {lead.applicationForm && (
          <StatusPill icon={FileCheck} label={`Documents: ${isDocumentsDone(lead) ? 'Complete' : 'Pending'}`} active={isDocumentsDone(lead)} />
        )}
        {lead.fee && (
          <StatusPill icon={Wallet} label={`Fee: ${FEE_STATUS_LABELS[lead.fee.status]}`} active={isFeeDone(lead)} />
        )}
        {lead.convertedStudentId && (
          <StatusPill icon={GraduationCap} label={`ID: ${lead.convertedStudentId}`} active />
        )}
      </div>
    </div>
  )
}

function StatusPill({ icon: Icon, label, active }: { icon: typeof ClipboardList; label: string; active?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1', active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground')}>
      <Icon className="h-3 w-3" />{label}
    </span>
  )
}

export { canFillApplication, canRecordFee, canConvertToStudent }
