import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ASSIGNEES, GRADES } from '../data/mock-data'
import {
  PIPELINE_STAGES,
  SOURCE_LABELS,
  PRIORITY_LABELS,
  type AdmissionFilters,
} from '../types'

interface AdmissionsFiltersProps {
  filters: AdmissionFilters
  onChange: (patch: Partial<AdmissionFilters>) => void
  onReset: () => void
  hideStage?: boolean
}

export function AdmissionsFiltersPanel({ filters, onChange, onReset, hideStage }: AdmissionsFiltersProps) {
  const [expanded, setExpanded] = useState(false)

  const activeCount = [
    filters.stage !== 'all' && !hideStage,
    filters.source !== 'all',
    filters.priority !== 'all',
    filters.applicationType !== 'all',
    filters.assignedTo !== 'all',
    filters.grade !== 'all',
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
              {activeCount}
            </span>
          )}
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {!hideStage && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Stage</label>
                <Select
                  value={filters.stage}
                  onChange={(e) => onChange({ stage: e.target.value as AdmissionFilters['stage'] })}
                >
                  <option value="all">All stages</option>
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Source</label>
              <Select
                value={filters.source}
                onChange={(e) => onChange({ source: e.target.value as AdmissionFilters['source'] })}
              >
                <option value="all">All sources</option>
                {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <Select
                value={filters.priority}
                onChange={(e) => onChange({ priority: e.target.value as AdmissionFilters['priority'] })}
              >
                <option value="all">All priorities</option>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Application Type</label>
              <Select
                value={filters.applicationType}
                onChange={(e) => onChange({ applicationType: e.target.value as AdmissionFilters['applicationType'] })}
              >
                <option value="all">All types</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="none">No application yet</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
              <Select
                value={filters.assignedTo}
                onChange={(e) => onChange({ assignedTo: e.target.value })}
              >
                <option value="all">Anyone</option>
                {ASSIGNEES.filter((a) => a !== 'All Team').map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Grade</label>
              <Select
                value={filters.grade}
                onChange={(e) => onChange({ grade: e.target.value })}
              >
                <option value="all">All grades</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">From Date</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onChange({ dateFrom: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">To Date</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onChange({ dateTo: e.target.value })}
              />
            </div>
          </div>

          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="mt-3 gap-1" onClick={onReset}>
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
