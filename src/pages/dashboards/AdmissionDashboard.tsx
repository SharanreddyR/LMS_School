import { Clock, FileText, UserCheck, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { StatMetric } from '@/types/common'

const METRICS: StatMetric[] = [
  { id: '1', label: 'New Inquiries', value: 42, change: 18, changeLabel: 'this week', trend: 'up' },
  { id: '2', label: 'Applications', value: 28, change: 5, changeLabel: 'pending review', trend: 'neutral' },
  { id: '3', label: 'Interviews Scheduled', value: 12, change: 3, changeLabel: 'this week', trend: 'up' },
  { id: '4', label: 'Enrolled (MTD)', value: 8, change: 2, changeLabel: 'vs target', trend: 'up' },
]

const PIPELINE = [
  { stage: 'Inquiry', count: 42, color: 'bg-blue-100 text-blue-700' },
  { stage: 'Application', count: 28, color: 'bg-amber-100 text-amber-700' },
  { stage: 'Interview', count: 12, color: 'bg-purple-100 text-purple-700' },
  { stage: 'Accepted', count: 8, color: 'bg-green-100 text-green-700' },
]

export function AdmissionDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions Pipeline"
        description="Track inquiries, applications, and enrollment"
        actions={<Button>Add Inquiry</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard metric={METRICS[0]} icon={<UserPlus className="h-5 w-5" />} />
        <StatCard metric={METRICS[1]} icon={<FileText className="h-5 w-5" />} />
        <StatCard metric={METRICS[2]} icon={<Clock className="h-5 w-5" />} />
        <StatCard metric={METRICS[3]} icon={<UserCheck className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admission Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            {PIPELINE.map((stage) => (
              <div key={stage.stage} className="rounded-xl border border-border p-4 text-center">
                <Badge className={stage.color}>{stage.stage}</Badge>
                <p className="mt-3 text-3xl font-bold">{stage.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
