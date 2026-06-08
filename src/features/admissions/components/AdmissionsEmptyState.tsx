import { UserPlus } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

interface AdmissionsEmptyStateProps {
  title?: string
  description?: string
  onAction?: () => void
}

export function AdmissionsEmptyState({
  title = 'No leads found',
  description = 'Try adjusting your filters or search terms. You can also add a new enquiry to get started.',
  onAction,
}: AdmissionsEmptyStateProps) {
  return (
    <EmptyState
      icon={UserPlus}
      title={title}
      description={description}
      actionLabel={onAction ? 'Add Enquiry' : undefined}
      onAction={onAction}
    />
  )
}
