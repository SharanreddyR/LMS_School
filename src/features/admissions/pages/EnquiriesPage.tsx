import { Button } from '@/components/ui/button'
import { AdmissionsPageShell } from '../components/AdmissionsPageShell'
import { AdmissionFeatureGuard } from '../components/AdmissionFeatureGuard'
import { AdmissionsToolbar } from '../components/AdmissionsToolbar'
import { AdmissionsFiltersPanel } from '../components/AdmissionsFilters'
import { LeadsView } from '../components/LeadsView'
import { useAdmissions } from '../hooks/useAdmissions'

export function EnquiriesPage() {
  const admissions = useAdmissions({ initialStageFilter: 'enquiry' })

  return (
    <AdmissionsPageShell
      title="Enquiry Management"
      description="Capture, track, and nurture admission enquiries from all sources"
      actions={<Button onClick={() => {}}>Add Enquiry</Button>}
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
    </AdmissionsPageShell>
  )
}
