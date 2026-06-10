import { CheckCircle2, Circle, FileText, Wallet, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdmissionLead } from '../types'
import {
  APPLICATION_STATUS_LABELS,
  FEE_STATUS_LABELS,
  canConvertToStudent,
  canFillApplication,
  canRecordFee,
} from '../types/application'

const STEPS = [
  { id: 'enquiry', label: 'Enquiry' },
  { id: 'application', label: 'Application' },
  { id: 'fee', label: 'Fee Payment' },
  { id: 'enrolled', label: 'Student' },
] as const

function getStepState(lead: AdmissionLead, stepId: (typeof STEPS)[number]['id']) {
  switch (stepId) {
    case 'enquiry':
      return lead.stage !== 'lost' ? 'complete' : 'pending'
    case 'application':
      if (lead.applicationStatus === 'submitted' || lead.applicationStatus === 'approved') return 'complete'
      if (canFillApplication(lead)) return 'current'
      return 'pending'
    case 'fee':
      if (lead.fee?.status === 'paid' || lead.fee?.status === 'partial') return 'complete'
      if (lead.applicationStatus === 'submitted' || lead.applicationStatus === 'approved') return 'current'
      return 'pending'
    case 'enrolled':
      if (lead.stage === 'enrolled') return 'complete'
      if (canConvertToStudent(lead)) return 'current'
      return 'pending'
    default:
      return 'pending'
  }
}

export function EnquiryProcessSteps({ lead }: { lead: AdmissionLead }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Admission Progress
      </p>
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((step, index) => {
          const state = getStepState(lead, step.id)
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2',
                    state === 'complete' && 'border-green-500 bg-green-500 text-white',
                    state === 'current' && 'border-brand-600 bg-brand-50 text-brand-600',
                    state === 'pending' && 'border-muted-foreground/30 text-muted-foreground',
                  )}
                >
                  {state === 'complete' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-center leading-tight sm:text-xs">
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-1 h-0.5 flex-1',
                    state === 'complete' ? 'bg-green-400' : 'bg-border',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <StatusPill
          icon={FileText}
          label={`Application: ${APPLICATION_STATUS_LABELS[lead.applicationStatus ?? 'not_started']}`}
          active={lead.applicationStatus === 'submitted' || lead.applicationStatus === 'approved'}
        />
        {lead.fee && (
          <StatusPill
            icon={Wallet}
            label={`Fee: ${FEE_STATUS_LABELS[lead.fee.status]} (₹${lead.fee.paidAmount.toLocaleString()} / ₹${lead.fee.totalAmount.toLocaleString()})`}
            active={lead.fee.status !== 'pending'}
          />
        )}
        {lead.stage === 'enrolled' && lead.convertedStudentId && (
          <StatusPill icon={UserCheck} label={`Student: ${lead.convertedStudentId}`} active />
        )}
      </div>
    </div>
  )
}

function StatusPill({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof FileText
  label: string
  active?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
        active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground',
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

export { canFillApplication, canRecordFee, canConvertToStudent }
