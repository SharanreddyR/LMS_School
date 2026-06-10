import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdmissionsPageShell } from '../components/AdmissionsPageShell'
import { AdmissionFeatureGuard } from '../components/AdmissionFeatureGuard'
import { AdmissionsToolbar } from '../components/AdmissionsToolbar'
import { AdmissionsFiltersPanel } from '../components/AdmissionsFilters'
import { LeadsView } from '../components/LeadsView'
import { EnquiryFormSheet } from '../components/EnquiryFormSheet'
import { ApplicationLinkEmailDialog } from '../components/ApplicationLinkEmailDialog'
import { useAdmissions } from '../hooks/useAdmissions'
import { useAdmissionSetup } from '../hooks/useAdmissionSetup'
import { useAdmissionsStore } from '../stores/admissions.store'
import type { ApplicationLinkEmail } from '../lib/application-link-email'

type EmailDialogState = {
  email: ApplicationLinkEmail
  autoSent: boolean
  failed?: boolean
  errorMessage?: string
  previewUrl?: string
  provider?: 'smtp' | 'ethereal'
}

export function EnquiriesPage() {
  const admissions = useAdmissions({ excludeStages: ['enrolled', 'lost'] })
  const { currentYear, isFeatureEnabled } = useAdmissionSetup()
  const [enquiryFormOpen, setEnquiryFormOpen] = useState(false)
  const [emailPreview, setEmailPreview] = useState<EmailDialogState | null>(null)

  const canAddEnquiry = isFeatureEnabled('enquiry')
  const canSendAppLink =
    isFeatureEnabled('onlineAdmissionForm') && isFeatureEnabled('externalApplication')

  const handleEnquirySubmit = async (values: Parameters<typeof admissions.addEnquiry>[0]) => {
    const lead = admissions.addEnquiry(values)

    if (canSendAppLink && values.email.trim()) {
      const result = await admissions.sendApplicationLinkEmail(lead.id)
      if (result.email) {
        setEmailPreview({
          email: result.email,
          autoSent: result.success,
          failed: !result.success,
          errorMessage: result.success ? undefined : result.error,
          previewUrl: result.success ? result.previewUrl : undefined,
          provider: result.success ? result.provider : undefined,
        })
      }
    }

    const updated = useAdmissionsStore.getState().getLeadById(lead.id) ?? lead
    admissions.setSelectedLead(updated)
  }

  return (
    <AdmissionsPageShell
      title="Enquiry Management"
      description="Capture, track, and nurture admission enquiries from all sources"
      actions={
        canAddEnquiry ? (
          <Button onClick={() => setEnquiryFormOpen(true)}>Add Enquiry</Button>
        ) : undefined
      }
      {...admissions.leadSheetProps}
    >
      <AdmissionFeatureGuard feature="enquiry">
      <div className="space-y-4">
        <AdmissionsToolbar
          search={admissions.filters.search}
          onSearchChange={(v) => admissions.updateFilters({ search: v })}
          viewMode={admissions.viewMode}
          onViewModeChange={admissions.setViewMode}
          resultCount={admissions.filteredLeads.length}
          addLabel="Add Enquiry"
          onAddNew={canAddEnquiry ? () => setEnquiryFormOpen(true) : undefined}
        />
        <AdmissionsFiltersPanel
          filters={admissions.filters}
          onChange={admissions.updateFilters}
          onReset={admissions.resetFilters}
          hideStage
        />
        <LeadsView
          leads={admissions.leads}
          paginatedLeads={admissions.paginatedLeads}
          allFilteredLeads={admissions.filteredLeads}
          loading={admissions.loading}
          viewMode={admissions.viewMode}
          page={admissions.page}
          totalPages={admissions.totalPages}
          pageSize={admissions.pageSize}
          onLeadClick={admissions.setSelectedLead}
          onPageChange={admissions.setPage}
          emptyTitle="No enquiries found"
          emptyDescription="No enquiries match your current filters. Try broadening your search or add a new enquiry."
        />
      </div>
      </AdmissionFeatureGuard>

      {canAddEnquiry && (
        <EnquiryFormSheet
          open={enquiryFormOpen}
          onClose={() => setEnquiryFormOpen(false)}
          defaultAcademicYear={currentYear?.label ?? '2026-27'}
          sendApplicationLinkOnSave={canSendAppLink}
          onSubmit={handleEnquirySubmit}
        />
      )}

      <ApplicationLinkEmailDialog
        open={Boolean(emailPreview)}
        email={emailPreview?.email ?? null}
        autoSent={emailPreview?.autoSent}
        failed={emailPreview?.failed}
        errorMessage={emailPreview?.errorMessage}
        previewUrl={emailPreview?.previewUrl}
        provider={emailPreview?.provider}
        onClose={() => setEmailPreview(null)}
      />
    </AdmissionsPageShell>
  )
}
