import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/api'

interface ErrorStateProps {
  error?: unknown
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  error,
  title = 'Failed to load data',
  description,
  onRetry,
}: ErrorStateProps) {
  const message = description ?? (error ? getErrorMessage(error) : 'Please try again.')

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 px-6 py-12 text-center dark:border-red-900/30 dark:bg-red-900/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5 gap-2" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
