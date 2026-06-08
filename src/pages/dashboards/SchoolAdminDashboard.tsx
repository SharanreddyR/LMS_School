import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, GraduationCap, UserPlus, Wallet, BookOpen, FileText } from 'lucide-react'
import { fetchDashboardStats } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { StatMetric } from '@/types/common'

const QUICK_ACTIONS = [
  { to: '/admissions', label: 'Admissions', icon: UserPlus },
  { to: '/students', label: 'Students', icon: GraduationCap },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/fees', label: 'Fees', icon: Wallet },
  { to: '/lms/courses', label: 'LMS', icon: BookOpen },
  { to: '/examinations', label: 'Exams', icon: FileText },
]

export function SchoolAdminDashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: queryKeys.dashboard.stats, queryFn: fetchDashboardStats })

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <PageHeader title="School Dashboard" description="Loading..." />
        <LoadingGrid count={4} />
      </div>
    )
  }

  const metrics: StatMetric[] = [
    { id: '1', label: 'Total Students', value: stats.students.toLocaleString(), change: 4, changeLabel: 'this term', trend: 'up' },
    { id: '2', label: 'Pending Admissions', value: stats.pendingAdmissions, change: 15, changeLabel: 'new inquiries', trend: 'up' },
    { id: '3', label: 'Attendance Today', value: `${stats.attendanceRate}%`, change: 1.2, changeLabel: 'vs yesterday', trend: 'up' },
    { id: '4', label: 'Fee Collection', value: `${stats.feeCollection}%`, change: -3, changeLabel: 'this month', trend: 'down' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Dashboard"
        description="Greenwood International — real-time overview"
        actions={<Link to="/reports"><Button variant="outline">Export Report</Button></Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={metrics[0]} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard metric={metrics[1]} icon={<UserPlus className="h-5 w-5" />} />
        <StatCard metric={metrics[2]} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard metric={metrics[3]} icon={<Wallet className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart
            title="Monthly Attendance Rate"
            data={[
              { name: 'Jan', value: 92 }, { name: 'Feb', value: 93 }, { name: 'Mar', value: 91 },
              { name: 'Apr', value: 94 }, { name: 'May', value: 95 }, { name: 'Jun', value: stats.attendanceRate },
            ]}
            color="#10b981"
          />
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:bg-muted">
                <Icon className="h-4 w-4 text-brand-600" />{label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center justify-between p-4">
          <div><p className="text-sm text-muted-foreground">Active Courses</p><p className="text-2xl font-bold">{stats.activeCourses}</p></div>
          <Badge variant="success">LMS</Badge>
        </CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-4">
          <div><p className="text-sm text-muted-foreground">Upcoming Exams</p><p className="text-2xl font-bold">{stats.upcomingExams}</p></div>
          <Badge variant="warning">Exams</Badge>
        </CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-4">
          <div><p className="text-sm text-muted-foreground">Overdue Fees</p><p className="text-2xl font-bold">{stats.overdueFees}</p></div>
          <Badge variant="destructive">Fees</Badge>
        </CardContent></Card>
      </div>
    </div>
  )
}
