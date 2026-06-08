import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, CalendarCheck, ClipboardList, Users } from 'lucide-react'
import { fetchAssignments, fetchCourses } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const SCHEDULE = [
  { time: '08:00', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 204' },
  { time: '09:30', subject: 'Mathematics', class: 'Grade 10-B', room: 'Room 204' },
  { time: '11:00', subject: 'Advanced Algebra', class: 'Grade 11-A', room: 'Room 301' },
]

export function TeacherDashboard() {
  const { data: courses = [], isLoading: lc } = useQuery({ queryKey: queryKeys.lms.courses, queryFn: fetchCourses })
  const { data: assignments = [], isLoading: la } = useQuery({ queryKey: queryKeys.lms.assignments, queryFn: fetchAssignments })

  if (lc || la) return <div className="space-y-6"><PageHeader title="Teacher Portal" description="Loading..." /><LoadingGrid count={4} /></div>

  const pendingGrading = assignments.filter((a) => a.status === 'grading').length

  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Portal" description="Your classes, schedule, and tasks for today" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={{ id: '1', label: 'My Courses', value: courses.length, trend: 'neutral' }} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard metric={{ id: '2', label: 'Students', value: courses.reduce((a, c) => a + c.students, 0), trend: 'neutral' }} icon={<Users className="h-5 w-5" />} />
        <StatCard metric={{ id: '3', label: 'Pending Grading', value: pendingGrading, trend: 'up' }} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard metric={{ id: '4', label: 'Classes Today', value: SCHEDULE.length, trend: 'neutral' }} icon={<CalendarCheck className="h-5 w-5" />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Today&apos;s Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {SCHEDULE.map((item) => (
              <div key={item.time} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <p className="text-sm font-bold text-brand-600">{item.time}</p>
                <div className="flex-1"><p className="font-medium">{item.subject}</p><p className="text-sm text-muted-foreground">{item.class} · {item.room}</p></div>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Assignments</CardTitle>
            <Link to="/lms/assignments"><Button variant="ghost" size="sm">View all</Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.slice(0, 3).map((a) => (
              <div key={a.id} className="flex justify-between rounded-lg border border-border p-3">
                <div><p className="font-medium">{a.title}</p><p className="text-sm text-muted-foreground">{a.submissions}/{a.total} submitted</p></div>
                <Badge variant={a.status === 'grading' ? 'warning' : 'default'}>{a.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
