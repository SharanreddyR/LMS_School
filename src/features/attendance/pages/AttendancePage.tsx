import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarCheck, CheckCircle, XCircle } from 'lucide-react'
import { fetchAttendance } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingGrid, LoadingTable } from '@/components/shared/LoadingGrid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AttendancePage() {
  const [search, setSearch] = useState('')
  const { data: records = [], isLoading } = useQuery({ queryKey: queryKeys.attendance.all, queryFn: fetchAttendance })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return records.filter((r) => !q || [r.grade, r.section, r.markedBy].join(' ').toLowerCase().includes(q))
  }, [records, search])

  const today = records.filter((r) => format(new Date(r.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
  const totalPresent = today.reduce((a, r) => a + r.present, 0)
  const totalStudents = today.reduce((a, r) => a + r.total, 0)
  const rate = totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Daily attendance tracking and reports" actions={
        <Button>Mark Attendance</Button>
      } />

      {isLoading ? <LoadingGrid count={3} /> : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard metric={{ id: '1', label: 'Today\'s Rate', value: `${rate}%`, trend: 'up', change: 1.2, changeLabel: 'vs yesterday' }} icon={<CalendarCheck className="h-5 w-5" />} />
          <StatCard metric={{ id: '2', label: 'Present', value: totalPresent, trend: 'neutral' }} icon={<CheckCircle className="h-5 w-5" />} />
          <StatCard metric={{ id: '3', label: 'Absent', value: today.reduce((a, r) => a + r.absent, 0), trend: 'neutral' }} icon={<XCircle className="h-5 w-5" />} />
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-6">
          <DataTableToolbar search={search} onSearchChange={setSearch} resultCount={filtered.length} />
          {isLoading ? <LoadingTable /> : filtered.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No records" description="Attendance records will appear here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead className="hidden sm:table-cell">Late</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="hidden md:table-cell">Marked By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const pct = Math.round((r.present / r.total) * 100)
                  return (
                    <TableRow key={r.id}>
                      <TableCell>{format(new Date(r.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="font-medium">{r.grade} {r.section}</TableCell>
                      <TableCell className="text-green-600">{r.present}</TableCell>
                      <TableCell className="text-red-600">{r.absent}</TableCell>
                      <TableCell className="hidden sm:table-cell text-amber-600">{r.late}</TableCell>
                      <TableCell><span className={pct >= 90 ? 'text-green-600' : 'text-amber-600'}>{pct}%</span></TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{r.markedBy}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
