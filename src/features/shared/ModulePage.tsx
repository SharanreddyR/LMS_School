import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { FileText } from 'lucide-react'

interface ModulePageProps {
  title: string
  description: string
}

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={FileText}
        title="Module scaffold ready"
        description="This module page is wired into the routing architecture. Connect your API and build feature-specific components here."
        actionLabel="Learn more in ARCHITECTURE.md"
        onAction={() => window.open('/ARCHITECTURE.md', '_blank')}
      />
    </div>
  )
}
