import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ClipboardList, Plus } from 'lucide-react'
import { fetchAssignments } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingTable } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AssignmentsPage() {
  const [search, setSearch] = useState('')
  const { data: assignments = [], isLoading } = useQuery({ queryKey: queryKeys.lms.assignments, queryFn: fetchAssignments })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return assignments.filter((a) => !q || [a.title, a.course].join(' ').toLowerCase().includes(q))
  }, [assignments, search])

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Create, distribute, and grade student assignments" actions={
        <Button className="gap-1.5"><Plus className="h-4 w-4" />New Assignment</Button>
      } />
      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} resultCount={filtered.length} />
          {isLoading ? <LoadingTable /> : filtered.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No assignments" description="Create an assignment for your courses." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead className="hidden sm:table-cell">Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{a.course}</TableCell>
                    <TableCell>{format(new Date(a.dueDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{a.submissions}/{a.total}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
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
