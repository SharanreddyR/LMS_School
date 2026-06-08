import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, ClipboardList, GraduationCap, Wallet } from 'lucide-react'
import { fetchParentProfile, fetchFeePayments } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { useAuthStore } from '@/stores/auth.store'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { ProfilePhoto } from '@/components/shared/ProfilePhoto'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function ParentDashboard() {
  const parentId = useAuthStore((s) => s.user?.parentId)

  const { data: profileData, isLoading: lp } = useQuery({
    queryKey: queryKeys.parents.profile(parentId ?? ''),
    queryFn: () => fetchParentProfile(parentId!),
    enabled: !!parentId,
  })
  const { data: payments = [], isLoading: lf } = useQuery({
    queryKey: queryKeys.fees.payments,
    queryFn: fetchFeePayments,
  })

  if (lp || lf) {
    return (
      <div className="space-y-6">
        <PageHeader title="Parent Portal" description="Loading..." />
        <LoadingGrid count={4} />
      </div>
    )
  }

  const parent = profileData?.parent
  const children = profileData?.children ?? []
  const dueFees = payments.filter((p) => p.dueAmount > 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Portal"
        description="Monitor your children's progress and school updates"
        actions={
          <>
            <Link to="/profile"><Button variant="outline">My Profile</Button></Link>
            <Link to="/fees"><Button>Pay Fees</Button></Link>
          </>
        }
      />

      {parent && (
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:from-emerald-950/30 dark:to-teal-950/30 sm:flex-row">
            <ProfilePhoto name={parent.name} src={parent.avatarUrl} size="xl" />
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Welcome back</p>
              <h2 className="text-xl font-bold">{parent.name}</h2>
              <p className="text-sm text-muted-foreground">{parent.email}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={{ id: '1', label: 'Children', value: children.length, trend: 'neutral' }} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard metric={{ id: '2', label: 'Avg Attendance', value: children.length ? `${Math.round(children.reduce((a, c) => a + c.attendance, 0) / children.length)}%` : '—', trend: 'up' }} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard metric={{ id: '3', label: 'Fee Due', value: `$${dueFees.reduce((a, p) => a + p.dueAmount, 0).toLocaleString()}`, trend: 'neutral' }} icon={<Wallet className="h-5 w-5" />} />
        <StatCard metric={{ id: '4', label: 'Assignments', value: 3, trend: 'neutral' }} icon={<ClipboardList className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">My Children</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <div key={child.id} className="flex items-center gap-4 rounded-2xl border border-border p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]">
              <ProfilePhoto name={child.name} src={child.avatarUrl} size="lg" />
              <div className="flex-1">
                <p className="font-semibold">{child.name}</p>
                <p className="text-sm text-muted-foreground">{child.grade} · {child.id}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="success">Attendance {child.attendance}%</Badge>
                  <Badge variant="default">GPA {child.gpa}</Badge>
                </div>
              </div>
              <Link to="/profile"><Button variant="outline" size="sm">Profile</Button></Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
