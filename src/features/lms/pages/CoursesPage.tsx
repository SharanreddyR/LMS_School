import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Plus, Users } from 'lucide-react'
import { fetchCourses } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function CoursesPage() {
  const [search, setSearch] = useState('')
  const { data: courses = [], isLoading } = useQuery({ queryKey: queryKeys.lms.courses, queryFn: fetchCourses })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return courses.filter((c) => !q || [c.title, c.code, c.teacher].join(' ').toLowerCase().includes(q))
  }, [courses, search])

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" description="Course catalog, content, and student enrollment" actions={
        <Button className="gap-1.5"><Plus className="h-4 w-4" />New Course</Button>
      } />
      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} placeholder="Search courses..." resultCount={filtered.length} />
          {isLoading ? <LoadingGrid count={3} /> : filtered.length === 0 ? (
            <EmptyState icon={BookOpen} title="No courses" description="Create your first course to get started." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <div key={c.id} className="rounded-xl border border-border p-5 transition-all hover:border-brand-300 hover:shadow-[var(--shadow-elevated)]">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                      <BookOpen className="h-5 w-5 text-brand-600" />
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <h3 className="mt-3 font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.code} · {c.grade}</p>
                  <p className="mt-1 text-sm">{c.teacher}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" />{c.students}</span>
                    <span className="font-medium text-brand-600">{c.progress}% complete</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${c.progress}%` }} />
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
