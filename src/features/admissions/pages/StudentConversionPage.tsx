import { useMemo, useState } from 'react'
import { UserCheck, GraduationCap, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@/components/ui/avatar'
import { AdmissionsPageShell } from '../components/AdmissionsPageShell'
import { AdmissionFeatureGuard } from '../components/AdmissionFeatureGuard'
import { AdmissionsEmptyState } from '../components/AdmissionsEmptyState'
import { StageBadge } from '../components/StageBadge'
import { useAdmissions } from '../hooks/useAdmissions'
import { canConvertToStudent } from '../types/application'

export function StudentConversionPage() {
  const admissions = useAdmissions()
  const [convertedId, setConvertedId] = useState<string | null>(null)

  const readyToConvert = useMemo(
    () => admissions.leads.filter((l) => canConvertToStudent(l)),
    [admissions.leads],
  )

  const recentlyEnrolled = useMemo(
    () => admissions.leads.filter((l) => l.stage === 'enrolled'),
    [admissions.leads],
  )

  const handleConvert = (leadId: string) => {
    const studentId = admissions.convertToStudent(leadId)
    if (studentId) {
      setConvertedId(studentId)
      setTimeout(() => setConvertedId(null), 4000)
    }
  }

  return (
    <AdmissionsPageShell
      title="Student Conversion"
      description="Convert applicants to students after application submission and fee payment"
      {...admissions.leadSheetProps}
    >
      <AdmissionFeatureGuard feature="conversion">
      {convertedId && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p>
            Successfully converted to student <span className="font-semibold">{convertedId}</span>
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Ready for Conversion</CardTitle>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {readyToConvert.length} pending
            </span>
          </CardHeader>
          <CardContent>
            {admissions.loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : readyToConvert.length === 0 ? (
              <AdmissionsEmptyState
                title="No applicants ready"
                description="Applicants appear here after application is submitted and fee (full or installment) is paid."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden sm:table-cell">Grade</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readyToConvert.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.studentName} size="sm" />
                          <div>
                            <p className="font-medium">{lead.studentName}</p>
                            <p className="text-xs text-muted-foreground">{lead.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{lead.gradeApplying}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">
                        {lead.applicationType ?? '—'}
                      </TableCell>
                      <TableCell><StageBadge stage={lead.stage} /></TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleConvert(lead.id)}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Convert
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4" />
              Recently Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {admissions.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : recentlyEnrolled.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent enrollments</p>
            ) : (
              recentlyEnrolled.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => admissions.setSelectedLead(lead)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                >
                  <Avatar name={lead.studentName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{lead.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.convertedStudentId} · {format(new Date(lead.updatedAt), 'MMM d')}
                    </p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      </AdmissionFeatureGuard>
    </AdmissionsPageShell>
  )
}
