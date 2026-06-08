import { Skeleton } from '@/components/ui/skeleton'

export function LoadingGrid({ count = 4, cols = 4 }: { count?: number; cols?: number }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full" />
      ))}
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
