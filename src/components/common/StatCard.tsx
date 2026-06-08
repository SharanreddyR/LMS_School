import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StatMetric } from '@/types/common'

interface StatCardProps {
  metric: StatMetric
  icon?: React.ReactNode
}

export function StatCard({ metric, icon }: StatCardProps) {
  const TrendIcon =
    metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus

  return (
    <Card className="hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
            {metric.change !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                <TrendIcon
                  className={cn(
                    'h-3.5 w-3.5',
                    metric.trend === 'up' && 'text-success',
                    metric.trend === 'down' && 'text-destructive',
                    metric.trend === 'neutral' && 'text-muted-foreground',
                  )}
                />
                <span
                  className={cn(
                    'font-medium',
                    metric.trend === 'up' && 'text-success',
                    metric.trend === 'down' && 'text-destructive',
                    metric.trend === 'neutral' && 'text-muted-foreground',
                  )}
                >
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
                </span>
                {metric.changeLabel && (
                  <span className="text-muted-foreground">{metric.changeLabel}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
