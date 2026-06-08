import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Download } from 'lucide-react'
import { fetchStudents } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTableToolbar } from '@/components/shared/DataTableToolbar'
import { LoadingGrid, LoadingTable } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { ProfilePhoto } from '@/components/shared/ProfilePhoto'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'

export function StudentsPage() {
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState('all')
  const { data: students = [], isLoading } = useQuery({ queryKey: queryKeys.students.all, queryFn: fetchStudents })

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase()
      const matchSearch = !q || [s.name, s.id, s.email, s.rollNo].join(' ').toLowerCase().includes(q)
      const matchGrade = grade === 'all' || s.grade === grade
      return matchSearch && matchGrade
    })
  }, [students, search, grade])

  const grades = [...new Set(students.map((s) => s.grade))].sort()
  const active = students.filter((s) => s.status === 'active').length
  const avgAttendance = Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length)

  return (
    <div className="space-y-6">
      <PageHeader title="Student Management" description="Directory, profiles, and academic records" actions={
        <><Button variant="outline" className="gap-1.5"><Download className="h-4 w-4" />Export</Button><Button className="gap-1.5"><Plus className="h-4 w-4" />Add Student</Button></>
      } />

      {isLoading ? <LoadingGrid count={3} /> : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard metric={{ id: '1', label: 'Total Students', value: students.length, trend: 'neutral' }} icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard metric={{ id: '2', label: 'Active', value: active, trend: 'neutral' }} />
          <StatCard metric={{ id: '3', label: 'Avg Attendance', value: `${avgAttendance}%`, trend: 'up', change: 1.2, changeLabel: 'this month' }} />
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <DataTableToolbar search={search} onSearchChange={setSearch} placeholder="Search students..." resultCount={filtered.length} />
            <Select value={grade} onChange={(e) => setGrade(e.target.value)} wrapperClassName="w-full sm:w-40">
              <option value="all">All grades</option>
              {grades.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </div>

          {isLoading ? <LoadingTable /> : filtered.length === 0 ? (
            <EmptyState icon={GraduationCap} title="No students found" description="Try adjusting your search or filters." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Roll No</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="hidden md:table-cell">Parent</TableHead>
                  <TableHead className="hidden lg:table-cell">Attendance</TableHead>
                  <TableHead className="hidden lg:table-cell">GPA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProfilePhoto name={s.name} src={s.avatarUrl} size="md" ring={false} className="!h-10 !w-10 rounded-full" />
                        <div><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.id}</p></div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{s.rollNo}</TableCell>
                    <TableCell>{s.grade} {s.section}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{s.parentName}</TableCell>
                    <TableCell className="hidden lg:table-cell">{s.attendance}%</TableCell>
                    <TableCell className="hidden lg:table-cell">{s.gpa}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
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
