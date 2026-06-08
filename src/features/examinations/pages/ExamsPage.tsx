import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { FileText, Plus, Trophy } from 'lucide-react'
import { fetchExams, fetchExamResults } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingTable } from '@/components/shared/LoadingGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function ExamsPage() {
  const { data: exams = [], isLoading: loadingExams } = useQuery({ queryKey: queryKeys.exams.schedule, queryFn: fetchExams })
  const { data: results = [], isLoading: loadingResults } = useQuery({ queryKey: queryKeys.exams.results, queryFn: fetchExamResults })

  return (
    <div className="space-y-6">
      <PageHeader title="Examinations" description="Exam schedules, results, and report cards" actions={
        <Button className="gap-1.5"><Plus className="h-4 w-4" />Schedule Exam</Button>
      } />

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="p-6">
              {loadingExams ? <LoadingTable /> : exams.length === 0 ? (
                <EmptyState icon={FileText} title="No exams scheduled" description="Schedule your first examination." />
              ) : (
                <div className="space-y-3">
                  {exams.map((e) => (
                    <div key={e.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{e.name}</p>
                          <StatusBadge status={e.status} />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{e.subject} · {e.grade}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>{format(new Date(e.date), 'MMM d, yyyy')}</span>
                        <span>{e.startTime} · {e.duration}</span>
                        <span className="text-muted-foreground">{e.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardContent className="p-6">
              {loadingResults ? <LoadingTable /> : results.length === 0 ? (
                <EmptyState icon={Trophy} title="No results" description="Exam results will appear after grading." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="hidden sm:table-cell">Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.studentName}</TableCell>
                        <TableCell className="text-muted-foreground">{r.examName}</TableCell>
                        <TableCell>{r.score}/{r.maxScore}</TableCell>
                        <TableCell><Badge variant="default">{r.grade}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell">#{r.rank}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
