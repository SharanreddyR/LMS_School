import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ViewToggle } from './ViewToggle'
import type { ViewMode } from '../types'

interface AdmissionsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  resultCount: number
  onAddNew?: () => void
  addLabel?: string
  viewModes?: ViewMode[]
}

export function AdmissionsToolbar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  resultCount,
  onAddNew,
  addLabel = 'Add Enquiry',
  viewModes,
}: AdmissionsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{resultCount}</span> results
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ViewToggle value={viewMode} onChange={onViewModeChange} modes={viewModes} />
        {onAddNew && (
          <Button onClick={onAddNew} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{addLabel}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
