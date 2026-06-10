import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { NotebookPen, Plus } from 'lucide-react'
import { fetchHomework } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingGrid, LoadingTable } from '@/components/shared/LoadingGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const STATUS_LABELS = {
  assigned: 'Assigned',
  submitted: 'Submitted',
  graded: 'Graded',
} as const

export function HomeworkPage() {
  const [search, setSearch] = useState('')
  const { data: items = [], isLoading } = useQuery({
    queryKey: queryKeys.homework.all,
    queryFn: fetchHomework,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter(
      (h) =>
        !q ||
        [h.title, h.subject, h.grade, h.teacher].join(' ').toLowerCase().includes(q),
    )
  }, [items, search])

  const assigned = items.filter((h) => h.status === 'assigned').length
  const graded = items.filter((h) => h.status === 'graded').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homework"
        description="Assign, track submissions, and grade student work"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Assign Homework
          </Button>
        }
      />

      {isLoading ? (
        <LoadingGrid count={2} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard metric={{ id: '1', label: 'Open Assignments', value: assigned, trend: 'neutral' }} icon={<NotebookPen className="h-5 w-5" />} />
          <StatCard metric={{ id: '2', label: 'Graded This Week', value: graded, trend: 'up', change: 2, changeLabel: 'completed' }} icon={<NotebookPen className="h-5 w-5" />} />
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} resultCount={filtered.length} />
          {isLoading ? (
            <LoadingTable />
          ) : filtered.length === 0 ? (
            <EmptyState icon={NotebookPen} title="No homework" description="Assigned homework will appear here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{h.title}</TableCell>
                    <TableCell>{h.subject}</TableCell>
                    <TableCell>{h.grade}</TableCell>
                    <TableCell>{h.teacher}</TableCell>
                    <TableCell>{format(new Date(h.dueDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{h.submissions} / {h.total}</TableCell>
                    <TableCell>
                      <Badge variant={h.status === 'graded' ? 'success' : h.status === 'submitted' ? 'secondary' : 'warning'}>
                        {STATUS_LABELS[h.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
