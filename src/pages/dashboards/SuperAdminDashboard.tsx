import { useQuery } from '@tanstack/react-query'
import { Building2, GraduationCap, Users, Wallet } from 'lucide-react'
import { fetchDashboardStats } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StatMetric } from '@/types/common'

export function SuperAdminDashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: queryKeys.dashboard.stats, queryFn: fetchDashboardStats })

  if (isLoading || !stats) {
    return <div className="space-y-6"><PageHeader title="Platform Overview" description="Loading..." /><LoadingGrid count={4} /></div>
  }

  const metrics: StatMetric[] = [
    { id: '1', label: 'Total Students', value: stats.students.toLocaleString(), change: 12, changeLabel: 'vs last year', trend: 'up' },
    { id: '2', label: 'Teachers', value: stats.teachers, change: 5, changeLabel: 'vs last year', trend: 'up' },
    { id: '3', label: 'Attendance Rate', value: `${stats.attendanceRate}%`, change: 1.2, changeLabel: 'today', trend: 'up' },
    { id: '4', label: 'Fee Collection', value: `${stats.feeCollection}%`, change: -2, changeLabel: 'this month', trend: 'down' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Overview" description="Multi-school analytics and system health" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={metrics[0]} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard metric={metrics[1]} icon={<Users className="h-5 w-5" />} />
        <StatCard metric={metrics[2]} icon={<Building2 className="h-5 w-5" />} />
        <StatCard metric={metrics[3]} icon={<Wallet className="h-5 w-5" />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardChart title="Enrollment Growth" data={[
          { name: 'Jan', value: 1100 }, { name: 'Feb', value: 1140 }, { name: 'Mar', value: 1180 },
          { name: 'Apr', value: 1200 }, { name: 'May', value: 1220 }, { name: 'Jun', value: stats.students },
        ]} />
        <Card>
          <CardHeader><CardTitle className="text-base">System Health</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Active Courses', value: stats.activeCourses, status: 'Active' },
              { label: 'Pending Admissions', value: stats.pendingAdmissions, status: 'Pending' },
              { label: 'Upcoming Exams', value: stats.upcomingExams, status: 'Scheduled' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><p className="font-medium">{item.label}</p><p className="text-2xl font-bold">{item.value}</p></div>
                <Badge variant="success">{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
