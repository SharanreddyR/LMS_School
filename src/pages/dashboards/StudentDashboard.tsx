import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, CalendarCheck, ClipboardList, Trophy } from 'lucide-react'
import { fetchAssignments, fetchCourses } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export function StudentDashboard() {
  const { data: assignments = [], isLoading: la } = useQuery({ queryKey: queryKeys.lms.assignments, queryFn: fetchAssignments })
  const { data: courses = [], isLoading: lc } = useQuery({ queryKey: queryKeys.lms.courses, queryFn: fetchCourses })
  const isLoading = la || lc

  if (isLoading) return <div className="space-y-6"><PageHeader title="My Learning" description="Loading..." /><LoadingGrid count={4} /></div>

  const dueSoon = assignments.filter((a) => a.status === 'open')

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning"
        description="Welcome back — here's your academic overview"
        actions={
          <Link to="/profile"><Button variant="outline">View My Profile</Button></Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={{ id: '1', label: 'Attendance', value: '96%', change: 1, changeLabel: 'this month', trend: 'up' }} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard metric={{ id: '2', label: 'Assignments Due', value: dueSoon.length, trend: 'neutral' }} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard metric={{ id: '3', label: 'Courses', value: courses.length, trend: 'neutral' }} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard metric={{ id: '4', label: 'GPA', value: '3.8', change: 0.2, changeLabel: 'this term', trend: 'up' }} icon={<Trophy className="h-5 w-5" />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            <Link to="/lms/assignments"><Button variant="ghost" size="sm">View all</Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueSoon.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><p className="font-medium">{a.title}</p><p className="text-sm text-muted-foreground">{format(new Date(a.dueDate), 'MMM d')}</p></div>
                <Badge variant="warning">due</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">My Courses</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {courses.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div className="h-2 w-2 rounded-full bg-brand-500" />
                <span className="text-sm font-medium">{c.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.progress}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
