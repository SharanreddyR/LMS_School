import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Megaphone, Pin, Plus } from 'lucide-react'
import { fetchAnnouncements } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingTable } from '@/components/shared/LoadingGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const AUDIENCE_LABELS = {
  all: 'Everyone',
  students: 'Students',
  parents: 'Parents',
  teachers: 'Teachers',
  staff: 'Staff',
} as const

export function AnnouncementsPage() {
  const [search, setSearch] = useState('')
  const { data: items = [], isLoading } = useQuery({
    queryKey: queryKeys.announcements.all,
    queryFn: fetchAnnouncements,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const sorted = [...items].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
    if (!q) return sorted
    return sorted.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q),
    )
  }, [items, search])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="School-wide notices for students, parents, teachers, and staff"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Announcement
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} resultCount={filtered.length} />
          {isLoading ? (
            <LoadingTable />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements" description="Published notices will appear here." />
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {item.pinned && <Pin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />}
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={item.priority === 'urgent' ? 'destructive' : item.priority === 'important' ? 'warning' : 'secondary'}>
                        {item.priority}
                      </Badge>
                      <Badge variant="outline">{AUDIENCE_LABELS[item.audience]}</Badge>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {item.author} · {format(new Date(item.publishedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
