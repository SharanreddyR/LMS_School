import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Users } from 'lucide-react'
import { fetchTeachers } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingGrid, LoadingTable } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
export function TeachersPage() {
  const [search, setSearch] = useState('')
  const { data: teachers = [], isLoading } = useQuery({ queryKey: queryKeys.teachers.all, queryFn: fetchTeachers })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return teachers.filter((t) => !q || [t.name, t.department, ...t.subjects].join(' ').toLowerCase().includes(q))
  }, [teachers, search])

  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Management" description="Faculty profiles, subjects, and class assignments" actions={
        <Button className="gap-1.5"><Plus className="h-4 w-4" />Add Teacher</Button>
      } />

      {isLoading ? <LoadingGrid count={2} /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard metric={{ id: '1', label: 'Total Teachers', value: teachers.length, trend: 'neutral' }} icon={<Users className="h-5 w-5" />} />
          <StatCard metric={{ id: '2', label: 'Active', value: teachers.filter((t) => t.status === 'active').length, trend: 'neutral' }} />
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} placeholder="Search teachers..." resultCount={filtered.length} />
          {isLoading ? <LoadingTable /> : filtered.length === 0 ? (
            <EmptyState icon={Users} title="No teachers found" description="Try a different search term." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((t) => (
                <div key={t.id} className="flex gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]">
                  <Avatar name={t.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.department} · {t.experience}y exp</p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {t.subjects.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{t.classes.join(' · ')}</p>
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
