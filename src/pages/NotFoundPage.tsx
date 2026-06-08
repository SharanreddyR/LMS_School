import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg font-medium">Page not found</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The page you are looking for does not exist or you may not have permission to view it.
      </p>
      <Link to={ROUTES.DASHBOARD} className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  )
}
