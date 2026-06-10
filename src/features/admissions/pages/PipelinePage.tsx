import { AdmissionsPageShell } from '../components/AdmissionsPageShell'
import { AdmissionFeatureGuard } from '../components/AdmissionFeatureGuard'
import { AdmissionsToolbar } from '../components/AdmissionsToolbar'
import { AdmissionsFiltersPanel } from '../components/AdmissionsFilters'
import { LeadsView } from '../components/LeadsView'
import { useAdmissions } from '../hooks/useAdmissions'

export function PipelinePage() {
  const admissions = useAdmissions({ initialViewMode: 'kanban' })

  return (
    <AdmissionsPageShell
      title="Lead Pipeline"
      description="Visual kanban pipeline from enquiry to enrollment"
      {...admissions.leadSheetProps}
    >
      <AdmissionFeatureGuard feature="enquiry">
      <div className="space-y-4">
        <AdmissionsToolbar
          search={admissions.filters.search}
          onSearchChange={(v) => admissions.updateFilters({ search: v })}
          viewMode={admissions.viewMode}
          onViewModeChange={admissions.setViewMode}
          resultCount={admissions.filteredLeads.filter((l) => l.stage !== 'lost').length}
        />
        <AdmissionsFiltersPanel
          filters={admissions.filters}
          onChange={admissions.updateFilters}
          onReset={admissions.resetFilters}
        />
        <LeadsView
          leads={admissions.leads}
          paginatedLeads={admissions.paginatedLeads}
          allFilteredLeads={admissions.filteredLeads.filter((l) => l.stage !== 'lost')}
          loading={admissions.loading}
          viewMode={admissions.viewMode}
          page={admissions.page}
          totalPages={admissions.totalPages}
          pageSize={admissions.pageSize}
          onLeadClick={admissions.setSelectedLead}
          onPageChange={admissions.setPage}
          onStageChange={admissions.updateLeadStage}
          kanbanStages={['enquiry', 'contacted', 'qualified', 'application', 'interview', 'accepted', 'enrolled']}
          emptyTitle="Pipeline is empty"
          emptyDescription="No leads in the pipeline. Add enquiries to start building your funnel."
        />
      </div>
      </AdmissionFeatureGuard>
    </AdmissionsPageShell>
  )
}
