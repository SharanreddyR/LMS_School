import type { ReactNode } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AdmissionsSubNav } from './AdmissionsSubNav'
import { LeadDetailSheet } from './LeadDetailSheet'
import type { AdmissionLead, PipelineStage } from '../types'

interface AdmissionsPageShellProps {
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
  selectedLead: AdmissionLead | null
  onCloseLead: () => void
  onStageChange: (leadId: string, stage: PipelineStage) => void
  onAddNote: (leadId: string, content: string) => void
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
}: AdmissionsPageShellProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} actions={actions} />
      <AdmissionsSubNav />
      {children}
      <LeadDetailSheet
        lead={selectedLead}
        open={!!selectedLead}
        onClose={onCloseLead}
        onStageChange={onStageChange}
        onAddNote={onAddNote}
      />
    </div>
  )
}
