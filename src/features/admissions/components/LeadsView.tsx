import { AdmissionsTable } from './AdmissionsTable'
import { KanbanBoard } from './KanbanBoard'
import { TimelineView } from './TimelineView'
import { AdmissionsEmptyState } from './AdmissionsEmptyState'
import { Pagination } from './Pagination'
import type { AdmissionLead, PipelineStage, ViewMode } from '../types'

interface LeadsViewProps {
  leads: AdmissionLead[]
  paginatedLeads: AdmissionLead[]
  allFilteredLeads: AdmissionLead[]
  loading: boolean
  viewMode: ViewMode
  page: number
  totalPages: number
  pageSize: number
  onLeadClick: (lead: AdmissionLead) => void
  onPageChange: (page: number) => void
  onStageChange?: (leadId: string, stage: PipelineStage) => void
  kanbanStages?: PipelineStage[]
  showPagination?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function LeadsView({
  paginatedLeads,
  allFilteredLeads,
  loading,
  viewMode,
  page,
  totalPages,
  pageSize,
  onLeadClick,
  onPageChange,
  onStageChange,
  kanbanStages,
  showPagination = true,
  emptyTitle,
  emptyDescription,
}: LeadsViewProps) {
  const isEmpty = !loading && allFilteredLeads.length === 0

  if (isEmpty) {
    return <AdmissionsEmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="space-y-4">
      {viewMode === 'table' && (
        <>
          <AdmissionsTable leads={paginatedLeads} loading={loading} onLeadClick={onLeadClick} />
          {showPagination && !loading && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={allFilteredLeads.length}
              pageSize={pageSize}
            />
          )}
        </>
      )}

      {viewMode === 'kanban' && (
        <KanbanBoard
          leads={allFilteredLeads}
          loading={loading}
          onLeadClick={onLeadClick}
          onStageChange={onStageChange}
          stages={kanbanStages}
        />
      )}

      {viewMode === 'timeline' && (
        <TimelineView
          leads={allFilteredLeads}
          loading={loading}
          onLeadClick={onLeadClick}
        />
      )}
    </div>
  )
}
