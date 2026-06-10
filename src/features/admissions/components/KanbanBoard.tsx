import { useState } from 'react'
import { PIPELINE_STAGES, type AdmissionLead, type PipelineStage } from '../types'
import { LeadCard } from './LeadCard'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  leads: AdmissionLead[]
  loading?: boolean
  onLeadClick: (lead: AdmissionLead) => void
  onStageChange?: (leadId: string, stage: PipelineStage) => void
  stages?: PipelineStage[]
}

export function KanbanBoard({
  leads,
  loading,
  onLeadClick,
  onStageChange,
  stages,
}: KanbanBoardProps) {
  const [dragLeadId, setDragLeadId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<PipelineStage | null>(null)

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

  const handleDrop = (stage: PipelineStage) => {
    if (dragLeadId && onStageChange) {
      onStageChange(dragLeadId, stage)
    }
    setDragLeadId(null)
    setDropTarget(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map((col) => {
        const columnLeads = leads.filter((l) => l.stage === col.id)
        const isDropTarget = dropTarget === col.id
        return (
          <div
            key={col.id}
            className="flex w-72 shrink-0 flex-col"
            onDragOver={(e) => {
              if (!onStageChange || !dragLeadId) return
              e.preventDefault()
              setDropTarget(col.id)
            }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={(e) => {
              e.preventDefault()
              handleDrop(col.id)
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {columnLeads.length}
              </span>
            </div>
            <div
              className={cn(
                'flex flex-1 flex-col gap-2 rounded-xl bg-muted/40 p-2 min-h-[200px] transition-colors',
                isDropTarget && 'ring-2 ring-brand-400 ring-offset-2',
              )}
            >
              {columnLeads.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  {onStageChange ? 'Drop leads here' : 'No leads'}
                </p>
              ) : (
                columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable={Boolean(onStageChange)}
                    onDragStart={() => setDragLeadId(lead.id)}
                    onDragEnd={() => {
                      setDragLeadId(null)
                      setDropTarget(null)
                    }}
                    className={cn(onStageChange && 'cursor-grab active:cursor-grabbing')}
                  >
                    <LeadCard lead={lead} onClick={onLeadClick} compact />
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
