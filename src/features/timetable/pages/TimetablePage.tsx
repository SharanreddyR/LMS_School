import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Clock } from 'lucide-react'
import { fetchTimetable } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingTable } from '@/components/shared/LoadingGrid'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

export function TimetablePage() {
  const [grade, setGrade] = useState('Grade 10')
  const [section, setSection] = useState('A')

  const { data: slots = [], isLoading } = useQuery({
    queryKey: queryKeys.timetable.all,
    queryFn: fetchTimetable,
  })

  const filtered = useMemo(
    () => slots.filter((s) => s.grade === grade && s.section === section),
    [slots, grade, section],
  )

  const grades = useMemo(() => [...new Set(slots.map((s) => s.grade))], [slots])

  const grid = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const day of DAYS) {
      map.set(day, filtered.filter((s) => s.day === day).sort((a, b) => a.period - b.period))
    }
    return map
  }, [filtered])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Timetable"
        description="Weekly schedule by grade and section"
        actions={
          <div className="flex gap-2">
            <Select value={grade} onChange={(e) => setGrade(e.target.value)} wrapperClassName="w-36">
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
            <Select value={section} onChange={(e) => setSection(e.target.value)} wrapperClassName="w-24">
              <option value="A">Sec A</option>
              <option value="B">Sec B</option>
            </Select>
          </div>
        }
      />

      {isLoading ? (
        <LoadingTable />
      ) : filtered.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No timetable" description="No slots found for this class." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {DAYS.map((day) => (
            <Card key={day}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(grid.get(day) ?? []).map((slot) => (
                  <div key={slot.id} className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                    <p className="font-medium">{slot.subject}</p>
                    <p className="text-xs text-muted-foreground">{slot.teacher}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {slot.startTime}–{slot.endTime} · {slot.room}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Full Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Room</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.day}</TableCell>
                  <TableCell>P{s.period}</TableCell>
                  <TableCell className="font-medium">{s.subject}</TableCell>
                  <TableCell>{s.teacher}</TableCell>
                  <TableCell>{s.startTime}–{s.endTime}</TableCell>
                  <TableCell>{s.room}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
