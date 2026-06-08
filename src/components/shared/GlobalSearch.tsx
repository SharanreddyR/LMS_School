import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, GraduationCap, Users, BookOpen, FileText, UserPlus, HeartHandshake } from 'lucide-react'
import { globalSearch } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { SearchResult } from '@/lib/mock-api/types'

const TYPE_ICONS = {
  student: GraduationCap,
  teacher: Users,
  parent: HeartHandshake,
  course: BookOpen,
  exam: FileText,
  lead: UserPlus,
}

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const { data: results = [], isLoading } = useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => globalSearch(query),
    enabled: open && query.length >= 2,
  })

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const handleSelect = (result: SearchResult) => {
    navigate(result.href)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="absolute left-1/2 top-[15%] w-full max-w-lg -translate-x-1/2 px-4">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students, teachers, courses..."
              className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline">ESC</kbd>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {query.length < 2 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </p>
            ) : isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
            ) : (
              results.map((result) => {
                const Icon = TYPE_ICONS[result.type]
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                      <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{result.subtitle} · {result.type}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SearchTrigger({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-muted',
        className,
      )}
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left">Search everywhere...</span>
      <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs sm:inline">⌘K</kbd>
    </button>
  )
}

export function useGlobalSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpen()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onOpen])
}
