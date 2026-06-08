import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface DataTableToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  placeholder?: string
  resultCount?: number
  actions?: React.ReactNode
}

export function DataTableToolbar({
  search,
  onSearchChange,
  placeholder = 'Search...',
  resultCount,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={placeholder} className="pl-9" />
        </div>
        {resultCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{resultCount}</span> results
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
