import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdmissionsPageShell } from '../components/AdmissionsPageShell'
import { AdmissionsToolbar } from '../components/AdmissionsToolbar'
import { AdmissionsFiltersPanel } from '../components/AdmissionsFilters'
import { LeadsView } from '../components/LeadsView'
import { useAdmissions } from '../hooks/useAdmissions'
import { useMemo } from 'react'

export function InternalApplicationsPage() {
  const admissions = useAdmissions({ initialApplicationType: 'internal' })

  const internalLeads = useMemo(
    () => admissions.filteredLeads.filter((l) => l.applicationType === 'internal'),
    [admissions.filteredLeads],
  )

  const paginated = useMemo(() => {
    const start = (admissions.page - 1) * admissions.pageSize
    return internalLeads.slice(start, start + admissions.pageSize)
  }, [internalLeads, admissions.page, admissions.pageSize])

  const totalPages = Math.max(1, Math.ceil(internalLeads.length / admissions.pageSize))

  return (
    <AdmissionsPageShell
      title="Internal Applications"
      description="Applications submitted through the school's online portal"
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="default">{internalLeads.length} applications</Badge>
          <Button variant="outline">Export</Button>
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
          resultCount={internalLeads.length}
          viewModes={['table', 'timeline']}
        />
        <AdmissionsFiltersPanel
          filters={{ ...admissions.filters, applicationType: 'internal' }}
          onChange={admissions.updateFilters}
          onReset={admissions.resetFilters}
        />
        <LeadsView
          leads={admissions.leads}
          paginatedLeads={paginated}
          allFilteredLeads={internalLeads}
          loading={admissions.loading}
          viewMode={admissions.viewMode === 'kanban' ? 'table' : admissions.viewMode}
          page={admissions.page}
          totalPages={totalPages}
          pageSize={admissions.pageSize}
          onLeadClick={admissions.setSelectedLead}
          onPageChange={admissions.setPage}
          emptyTitle="No internal applications"
          emptyDescription="Internal applications submitted via the school portal will appear here."
        />
      </div>
    </AdmissionsPageShell>
  )
}
