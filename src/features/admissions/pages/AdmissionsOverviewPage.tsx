import { Link } from 'react-router-dom'
import {
  UserPlus,
  GitBranch,
  CalendarClock,
  FileInput,
  Globe,
  UserCheck,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/common/StatCard'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { AdmissionsSubNav } from '../components/AdmissionsSubNav'
import { PageHeader } from '@/components/common/PageHeader'
import { useAdmissions } from '../hooks/useAdmissions'
import { getDashboardStats, MOCK_FOLLOW_UPS } from '../data/mock-data'
import { PIPELINE_STAGES } from '../types'
import type { StatMetric } from '@/types/common'

const QUICK_LINKS = [
  { to: '/admissions/enquiries', label: 'Enquiries', icon: UserPlus, desc: 'Manage new leads' },
  { to: '/admissions/pipeline', label: 'Pipeline', icon: GitBranch, desc: 'Kanban view' },
  { to: '/admissions/follow-ups', label: 'Follow-ups', icon: CalendarClock, desc: 'Due tasks' },
  { to: '/admissions/applications/internal', label: 'Internal Apps', icon: FileInput, desc: 'In-house forms' },
  { to: '/admissions/applications/external', label: 'External Apps', icon: Globe, desc: 'Transfer students' },
  { to: '/admissions/conversion', label: 'Conversion', icon: UserCheck, desc: 'Enroll students' },
]

export function AdmissionsOverviewPage() {
  const { leads, loading } = useAdmissions()

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admissions" description="Loading dashboard..." />
        <AdmissionsSubNav />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  const stats = getDashboardStats(leads)
  const metrics: StatMetric[] = [
    { id: '1', label: 'New Enquiries', value: stats.totalEnquiries, change: 18, changeLabel: 'this week', trend: 'up' },
    { id: '2', label: 'Active Pipeline', value: stats.activeLeads, change: 5, changeLabel: 'in progress', trend: 'up' },
    { id: '3', label: 'Interviews', value: stats.interviews, change: 3, changeLabel: 'scheduled', trend: 'up' },
    { id: '4', label: 'Conversion Rate', value: `${stats.conversionRate}%`, change: 2, changeLabel: 'vs last term', trend: 'up' },
  ]

  const funnelData = PIPELINE_STAGES.filter((s) => s.id !== 'lost').map((s) => ({
    name: s.label,
    value: leads.filter((l) => l.stage === s.id).length,
  }))

  const pendingFollowUps = MOCK_FOLLOW_UPS.filter((f) => !f.completed).slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions Dashboard"
        description="Overview of enquiries, pipeline, and enrollment progress"
        actions={
          <Link to="/admissions/enquiries">
            <Button>Add Enquiry</Button>
          </Link>
        }
      />
      <AdmissionsSubNav />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={metrics[0]} icon={<UserPlus className="h-5 w-5" />} />
        <StatCard metric={metrics[1]} icon={<GitBranch className="h-5 w-5" />} />
        <StatCard metric={metrics[2]} icon={<CalendarClock className="h-5 w-5" />} />
        <StatCard metric={metrics[3]} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      {stats.overdueFollowUps > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <p>
            <span className="font-semibold">{stats.overdueFollowUps} overdue follow-up(s)</span>
            {' '}need attention.{' '}
            <Link to="/admissions/follow-ups" className="font-medium text-brand-600 hover:underline">
              View follow-ups
            </Link>
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart title="Pipeline Distribution" data={funnelData} color="#6366f1" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Follow-ups</CardTitle>
            <Link to="/admissions/follow-ups">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingFollowUps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending follow-ups</p>
            ) : (
              pendingFollowUps.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.leadName}</p>
                  </div>
                  <Badge variant={f.priority === 'urgent' ? 'destructive' : 'warning'}>
                    {f.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Access</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(({ to, label, icon: Icon, desc }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-brand-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <Icon className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {PIPELINE_STAGES.filter((s) => s.id !== 'lost').map((stage) => {
              const count = leads.filter((l) => l.stage === stage.id).length
              return (
                <div key={stage.id} className="rounded-xl border border-border p-3 text-center">
                  <div className={`mx-auto mb-2 h-2 w-8 rounded-full ${stage.color}`} />
                  <p className="text-xs font-medium text-muted-foreground">{stage.label}</p>
                  <p className="mt-1 text-2xl font-bold">{count}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
