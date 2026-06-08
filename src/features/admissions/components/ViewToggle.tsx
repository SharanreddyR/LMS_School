import { LayoutGrid, List, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ViewMode } from '../types'

interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  modes?: ViewMode[]
}

const MODE_CONFIG: Record<ViewMode, { icon: typeof List; label: string }> = {
  table: { icon: List, label: 'Table' },
  kanban: { icon: LayoutGrid, label: 'Kanban' },
  timeline: { icon: GitBranch, label: 'Timeline' },
}

export function ViewToggle({ value, onChange, modes = ['table', 'kanban', 'timeline'] }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
      {modes.map((mode) => {
        const { icon: Icon, label } = MODE_CONFIG[mode]
        return (
          <Button
            key={mode}
            variant="ghost"
            size="sm"
            onClick={() => onChange(mode)}
            className={cn(
              'h-8 gap-1.5 px-2.5',
              value === mode && 'bg-card shadow-sm',
            )}
            aria-pressed={value === mode}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        )
      })}
    </div>
  )
}
