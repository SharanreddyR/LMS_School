import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdmissionsPageShell } from '../components/AdmissionsPageShell'
import { AdmissionsToolbar } from '../components/AdmissionsToolbar'
import { AdmissionsFiltersPanel } from '../components/AdmissionsFilters'
import { LeadsView } from '../components/LeadsView'
import { useAdmissions } from '../hooks/useAdmissions'
import { useMemo } from 'react'

export function ExternalApplicationsPage() {
  const admissions = useAdmissions({ initialApplicationType: 'external' })

  const externalLeads = useMemo(
    () => admissions.filteredLeads.filter((l) => l.applicationType === 'external'),
    [admissions.filteredLeads],
  )

  const paginated = useMemo(() => {
    const start = (admissions.page - 1) * admissions.pageSize
    return externalLeads.slice(start, start + admissions.pageSize)
  }, [externalLeads, admissions.page, admissions.pageSize])

  const totalPages = Math.max(1, Math.ceil(externalLeads.length / admissions.pageSize))

  return (
    <AdmissionsPageShell
      title="External Applications"
      description="Transfer students and applications from other institutions"
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="warning">{externalLeads.length} applications</Badge>
          <Button variant="outline">Import CSV</Button>
        </div>
      }
      selectedLead={admissions.selectedLead}
      onCloseLead={() => admissions.setSelectedLead(null)}
      onStageChange={admissions.updateLeadStage}
      onAddNote={admissions.addNote}
    >
      <div className="space-y-4">
        <AdmissionsToolbar
          search={admissions.filters.search}
          onSearchChange={(v) => admissions.updateFilters({ search: v })}
          viewMode={admissions.viewMode}
          onViewModeChange={admissions.setViewMode}
          resultCount={externalLeads.length}
          viewModes={['table', 'timeline']}
        />
        <AdmissionsFiltersPanel
          filters={{ ...admissions.filters, applicationType: 'external' }}
          onChange={admissions.updateFilters}
          onReset={admissions.resetFilters}
        />
        <LeadsView
          leads={admissions.leads}
          paginatedLeads={paginated}
          allFilteredLeads={externalLeads}
          loading={admissions.loading}
          viewMode={admissions.viewMode === 'kanban' ? 'table' : admissions.viewMode}
          page={admissions.page}
          totalPages={totalPages}
          pageSize={admissions.pageSize}
          onLeadClick={admissions.setSelectedLead}
          onPageChange={admissions.setPage}
          emptyTitle="No external applications"
          emptyDescription="Transfer and external student applications will appear here once submitted."
        />
      </div>
    </AdmissionsPageShell>
  )
}
