import { PIPELINE_STAGES, type AdmissionLead, type PipelineStage } from '../types'
import { LeadCard } from './LeadCard'
import { Skeleton } from '@/components/ui/skeleton'

interface KanbanBoardProps {
  leads: AdmissionLead[]
  loading?: boolean
  onLeadClick: (lead: AdmissionLead) => void
  stages?: PipelineStage[]
}

export function KanbanBoard({ leads, loading, onLeadClick, stages }: KanbanBoardProps) {
  const columns = stages
    ? PIPELINE_STAGES.filter((s) => stages.includes(s.id))
    : PIPELINE_STAGES.filter((s) => s.id !== 'lost')

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="w-72 shrink-0 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map((col) => {
        const columnLeads = leads.filter((l) => l.stage === col.id)
        return (
          <div key={col.id} className="flex w-72 shrink-0 flex-col">
            <div className="mb-3 flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {columnLeads.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 rounded-xl bg-muted/40 p-2 min-h-[200px]">
              {columnLeads.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">No leads</p>
              ) : (
                columnLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={onLeadClick} compact />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
