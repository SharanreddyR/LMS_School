import { Navigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Trophy,
  CalendarCheck,
  Wallet,
  ClipboardList,
  Heart,
  Bus,
  GraduationCap,
  Users,
  School,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useStudentProfile } from '../hooks/useStudentProfile'
import { GuardianCard } from '../components/GuardianCard'
import { StatCard } from '@/components/common/StatCard'
import { LoadingGrid, LoadingTable } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ProfilePhoto } from '@/components/shared/ProfilePhoto'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { EmptyState } from '@/components/common/EmptyState'

function InfoItem({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-muted/40 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
        <Icon className="h-4 w-4 text-brand-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

const ATTENDANCE_STATUS: Record<string, string> = {
  present: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export function StudentProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading, isError } = useStudentProfile()

  if (!user?.studentId && user?.role === 'student') {
    return <Navigate to="/dashboard" replace />
  }

  if (!user?.studentId) {
    return (
      <EmptyState
        icon={User}
        title="No student profile linked"
        description="Your account is not linked to a student record. Contact the school admin."
      />
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingGrid count={2} />
        <LoadingTable rows={4} />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={User}
        title="Profile not found"
        description={`Could not load profile for student ID: ${user.studentId}`}
      />
    )
  }

  const { profile, courses, assignments, examResults, feePayments, upcomingExams } = data

  return (
    <div className="space-y-6">
      {/* Hero — single student photo */}
      <Card className="overflow-hidden border-0 shadow-[var(--shadow-elevated)]">
        <div className="relative h-32 bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-500 sm:h-36 dark:from-brand-900 dark:via-brand-800 dark:to-indigo-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
        </div>
        <CardContent className="relative px-4 pb-6 pt-0 sm:px-6 sm:pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-5">
              <ProfilePhoto
                name={profile.name}
                src={profile.avatarUrl}
                size="2xl"
                className="rounded-2xl shadow-xl"
              />
              <div className="text-center sm:pb-2 sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-bold sm:text-3xl">{profile.name}</h1>
                  <StatusBadge status={profile.status} />
                </div>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-muted-foreground sm:justify-start">
                  <GraduationCap className="h-4 w-4" />
                  {profile.id} · Roll {profile.rollNo}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Badge variant="default">{profile.grade} — Section {profile.section}</Badge>
                  <Badge variant="secondary">{profile.house}</Badge>
                  <Badge variant="outline">{profile.academicYear}</Badge>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-2 rounded-2xl border border-border bg-card/80 p-3 backdrop-blur-sm sm:gap-3 sm:p-4 lg:w-auto">
              <div className="text-center">
                <p className="text-xl font-bold text-brand-600 sm:text-2xl">{profile.gpa}</p>
                <p className="text-xs text-muted-foreground">GPA</p>
              </div>
              <div className="border-x border-border text-center">
                <p className="text-xl font-bold text-green-600 sm:text-2xl">{profile.attendance}%</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold sm:text-2xl">{courses.length}</p>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family & guardians */}
      {profile.guardians.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold">Family & Guardians</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.guardians.map((guardian) => (
              <GuardianCard key={guardian.id} guardian={guardian} />
            ))}
          </div>
        </section>
      )}

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={{ id: '1', label: 'Subjects', value: profile.subjects.length, trend: 'neutral' }} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard metric={{ id: '2', label: 'Assignments Due', value: assignments.filter((a) => a.status === 'open').length, trend: 'neutral' }} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard metric={{ id: '3', label: 'Upcoming Exams', value: upcomingExams.length, trend: 'neutral' }} icon={<Trophy className="h-5 w-5" />} />
        <StatCard metric={{ id: '4', label: 'Exam Results', value: examResults.length, trend: 'neutral' }} icon={<CalendarCheck className="h-5 w-5" />} />
      </div>

      {/* Main content: sidebar + tabs */}
      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact & Personal</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <InfoItem icon={Mail} label="Email" value={profile.email} />
              <InfoItem icon={Phone} label="Phone" value={profile.phone} />
              <InfoItem icon={Calendar} label="Date of Birth" value={format(new Date(profile.dateOfBirth), 'MMM d, yyyy')} />
              <InfoItem icon={User} label="Gender" value={profile.gender} />
              <InfoItem icon={Heart} label="Blood Group" value={profile.bloodGroup} />
              <InfoItem icon={User} label="Nationality" value={profile.nationality} />
              <InfoItem icon={MapPin} label="Address" value={`${profile.address}, ${profile.city} ${profile.postalCode}`} />
              {profile.transportRoute && <InfoItem icon={Bus} label="Transport" value={profile.transportRoute} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <School className="h-4 w-4" />
                School
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-900/20">
                <p className="font-semibold">{user.schoolName ?? 'Greenwood International'}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Admitted {format(new Date(profile.admissionDate), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Enrolled {format(new Date(profile.enrolledAt), 'MMMM yyyy')}
                </p>
              </div>
              {profile.medicalNotes && (
                <InfoItem icon={Heart} label="Medical Notes" value={profile.medicalNotes} />
              )}
              <InfoItem icon={Phone} label="Emergency Line" value={profile.emergencyPhone} />
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-8">
          <Tabs defaultValue="academics">
            <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
            </TabsList>

            <TabsContent value="academics" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base">Enrolled Subjects</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {profile.subjects.map((sub) => (
                      <div key={sub.name} className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/30">
                        <div className="flex items-start justify-between">
                          <p className="font-medium">{sub.name}</p>
                          <Badge variant="secondary">{sub.room}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Teacher: {sub.teacher}</p>
                        <p className="text-xs text-muted-foreground">{sub.schedule}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base">My Courses (LMS)</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {courses.map((c) => (
                        <div key={c.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                          <div>
                            <p className="font-medium">{c.title}</p>
                            <p className="text-xs text-muted-foreground">{c.code} · {c.teacher}</p>
                          </div>
                          <span className="text-sm font-semibold text-brand-600">{c.progress}%</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-base">Assignments</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {assignments.map((a) => (
                        <div key={a.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                          <div>
                            <p className="text-sm font-medium">{a.title}</p>
                            <p className="text-xs text-muted-foreground">Due {format(new Date(a.dueDate), 'MMM d')}</p>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                <DashboardChart
                  title="Monthly Attendance (%)"
                  data={profile.attendanceHistory.map((h) => ({ name: h.month, value: h.rate }))}
                  color="#10b981"
                />
                <Card>
                  <CardHeader><CardTitle className="text-base">Last 7 Days</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {profile.recentAttendance.map((day) => (
                      <div key={day.date} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                        <span className="text-sm font-medium">{format(new Date(day.date), 'EEE, MMM d')}</span>
                        <div className="flex items-center gap-2">
                          {day.remark && <span className="text-xs text-muted-foreground">{day.remark}</span>}
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ATTENDANCE_STATUS[day.status]}`}>
                            {day.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="exams" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base">Upcoming Exams</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingExams.map((e) => (
                      <div key={e.id} className="rounded-xl border border-border p-4">
                        <p className="font-medium">{e.name}</p>
                        <p className="text-sm text-muted-foreground">{e.subject} · {e.room}</p>
                        <p className="mt-1 text-sm">{format(new Date(e.date), 'MMM d, yyyy')} · {e.startTime}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Exam Results</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exam</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {examResults.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium">{r.examName}</TableCell>
                            <TableCell>{r.score}/{r.maxScore}</TableCell>
                            <TableCell><Badge variant="default">{r.grade}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fees" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wallet className="h-4 w-4" /> Fee Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feePayments.map((f) => (
                        <TableRow key={f.id}>
                          <TableCell>Tuition — {f.grade}</TableCell>
                          <TableCell>${f.amount.toLocaleString()}</TableCell>
                          <TableCell className={f.dueAmount > 0 ? 'text-amber-600' : 'text-green-600'}>
                            ${f.dueAmount.toLocaleString()}
                          </TableCell>
                          <TableCell><StatusBadge status={f.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
