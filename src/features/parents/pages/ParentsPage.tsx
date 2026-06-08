import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { HeartHandshake, Mail, Phone } from 'lucide-react'
import { fetchParents } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingTable } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ProfilePhoto } from '@/components/shared/ProfilePhoto'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export function ParentsPage() {
  const [search, setSearch] = useState('')
  const { data: parents = [], isLoading } = useQuery({ queryKey: queryKeys.parents.all, queryFn: fetchParents })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return parents.filter((p) => !q || [p.name, p.email, ...p.children.map((c) => c.name)].join(' ').toLowerCase().includes(q))
  }, [parents, search])

  return (
    <div className="space-y-6">
      <PageHeader title="Parent Portal" description="Parent accounts, child linking, and communications" />

      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} placeholder="Search parents..." resultCount={filtered.length} />
          {isLoading ? <LoadingTable /> : filtered.length === 0 ? (
            <EmptyState icon={HeartHandshake} title="No parents found" description="Try a different search." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-2xl border border-border transition-shadow hover:shadow-[var(--shadow-elevated)]">
                  <div className="flex items-center gap-4 bg-muted/30 p-5">
                    <ProfilePhoto name={p.name} src={p.avatarUrl} size="lg" ring={false} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold">{p.name}</p>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">{p.id}</p>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1.5 truncate"><Mail className="h-3.5 w-3.5 shrink-0" />{p.email}</p>
                        <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" />{p.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Children</p>
                    <div className="space-y-2">
                      {p.children.map((c) => (
                        <div key={c.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-2">
                          <ProfilePhoto name={c.name} src={c.avatarUrl} size="md" ring={false} className="!h-12 !w-12 rounded-xl" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.id}</p>
                          </div>
                          <Badge variant="default">{c.grade}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
