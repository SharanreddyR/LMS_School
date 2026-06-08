import { Loader2 } from 'lucide-react'

interface PageLoaderProps {
  label?: string
}

export function PageLoader({ label = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
