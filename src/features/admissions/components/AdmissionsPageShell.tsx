import type { ReactNode } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AdmissionsSubNav } from './AdmissionsSubNav'
import { AcademicYearSelector } from './AcademicYearSelector'
import { LeadDetailSheet } from './LeadDetailSheet'
import type { AdmissionLead, PipelineStage } from '../types'
import type { ApplicationFormData, FeePaymentMode } from '../types/application'

interface AdmissionsPageShellProps {
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
  selectedLead: AdmissionLead | null
  onCloseLead: () => void
  onStageChange: (leadId: string, stage: PipelineStage) => void
  onAddNote: (leadId: string, content: string) => void
  onSubmitApplication: (leadId: string, form: ApplicationFormData) => void
  onRecordFeePayment: (leadId: string, amount: number, mode: FeePaymentMode) => void
  onConvertToStudent: (leadId: string) => string | null
  onSendApplicationLink?: (leadId: string) => Promise<{
    success: boolean
    email?: import('../lib/application-link-email').ApplicationLinkEmail
    reason?: string
  }>
}

export function AdmissionsPageShell({
  title,
  description,
  actions,
  children,
  selectedLead,
  onCloseLead,
  onStageChange,
  onAddNote,
  onSubmitApplication,
  onRecordFeePayment,
  onConvertToStudent,
  onSendApplicationLink,
}: AdmissionsPageShellProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <AcademicYearSelector />
            {actions}
          </div>
        }
      />
      <AdmissionsSubNav />
      {children}
      <LeadDetailSheet
        lead={selectedLead}
        open={!!selectedLead}
        onClose={onCloseLead}
        onStageChange={onStageChange}
        onAddNote={onAddNote}
        onSubmitApplication={onSubmitApplication}
        onRecordFeePayment={onRecordFeePayment}
        onConvertToStudent={onConvertToStudent}
        onSendApplicationLink={onSendApplicationLink}
      />
    </div>
  )
}
