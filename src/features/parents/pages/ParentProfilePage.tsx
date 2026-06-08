import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Mail, Phone, HeartHandshake, GraduationCap } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { fetchParentProfile } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { ProfilePhoto, PersonCard } from '@/components/shared/ProfilePhoto'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function ParentProfilePage() {
  const user = useAuthStore((s) => s.user)
  const parentId = user?.parentId

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.parents.profile(parentId ?? ''),
    queryFn: () => fetchParentProfile(parentId!),
    enabled: !!parentId,
  })

  if (!parentId && user?.role === 'parent') {
    return <Navigate to="/dashboard" replace />
  }

  if (!parentId) {
    return <EmptyState icon={HeartHandshake} title="No parent profile" description="Account not linked to a parent record." />
  }

  if (isLoading) return <LoadingGrid count={2} />

  if (isError || !data) {
    return <EmptyState icon={HeartHandshake} title="Profile not found" description={`No profile for ${parentId}`} />
  }

  const { parent, children } = data

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-[var(--shadow-elevated)]">
        <div className="h-32 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-900 dark:via-teal-800" />
        <CardContent className="relative px-6 pb-8">
          <div className="-mt-14 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <ProfilePhoto name={parent.name} src={parent.avatarUrl} size="2xl" />
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-bold sm:text-3xl">{parent.name}</h1>
                <StatusBadge status={parent.status} />
              </div>
              <p className="mt-1 text-muted-foreground">{parent.id} · Parent / Guardian</p>
              <p className="mt-1 text-sm text-muted-foreground">{user?.schoolName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PersonCard
        name={parent.name}
        src={parent.avatarUrl}
        role="Parent Account"
        subtitle={parent.email}
        details={[
          { label: 'Parent ID', value: parent.id },
          { label: 'Email', value: parent.email },
          { label: 'Phone', value: parent.phone },
          { label: 'Children', value: String(children.length) },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-5 w-5 text-brand-600" />
            My Children
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <div
              key={child.id}
              className="flex gap-4 rounded-2xl border border-border p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]"
            >
              <ProfilePhoto name={child.name} src={child.avatarUrl} size="lg" />
              <div className="flex-1">
                <p className="font-semibold">{child.name}</p>
                <p className="text-sm text-muted-foreground">{child.id} · Roll {child.rollNo}</p>
                <p className="text-sm">{child.grade} — Section {child.section}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="success">Attendance {child.attendance}%</Badge>
                  <Badge variant="default">GPA {child.gpa}</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/fees"><Button>View Fees</Button></Link>
        <Link to="/attendance"><Button variant="outline">Attendance</Button></Link>
        <Link to="/examinations"><Button variant="outline">Exam Results</Button></Link>
      </div>
    </div>
  )
}
