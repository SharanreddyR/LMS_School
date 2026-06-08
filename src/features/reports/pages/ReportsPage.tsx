import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { BarChart3, Download, FileText, TrendingUp, Users, Wallet } from 'lucide-react'
import { fetchReports } from '@/lib/mock-api'
import { queryKeys } from '@/lib/api/query-keys'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingGrid } from '@/components/shared/LoadingGrid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardChart } from '@/components/charts/DashboardChart'

const CATEGORY_ICONS = {
  academic: TrendingUp,
  attendance: Users,
  financial: Wallet,
  admissions: FileText,
}

export function ReportsPage() {
  const { data: reports = [], isLoading } = useQuery({ queryKey: queryKeys.reports.all, queryFn: fetchReports })

  const chartData = [
    { name: 'Jan', value: 42 },
    { name: 'Feb', value: 58 },
    { name: 'Mar', value: 51 },
    { name: 'Apr', value: 67 },
    { name: 'May', value: 73 },
    { name: 'Jun', value: 69 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="Generate and export institutional reports" actions={
        <Button className="gap-1.5"><Download className="h-4 w-4" />Generate Report</Button>
      } />

      <DashboardChart title="Reports Generated (Monthly)" data={chartData} color="#10b981" />

      {isLoading ? <LoadingGrid count={3} /> : reports.length === 0 ? (
        <EmptyState icon={BarChart3} title="No reports" description="Generate your first report." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => {
            const Icon = CATEGORY_ICONS[r.category]
            return (
              <Card key={r.id} className="transition-shadow hover:shadow-[var(--shadow-elevated)]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                      <Icon className="h-5 w-5 text-brand-600" />
                    </div>
                    <Badge variant="secondary" className="uppercase">{r.format}</Badge>
                  </div>
                  <h3 className="mt-3 font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Last: {format(new Date(r.lastGenerated), 'MMM d, yyyy')}
                    </span>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3.5 w-3.5" />Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
