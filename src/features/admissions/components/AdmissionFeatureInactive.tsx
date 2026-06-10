import { AlertCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ADMISSION_FEATURE_META, type AdmissionFeatureKey } from '../types/setup'

interface AdmissionFeatureInactiveProps {
  feature: AdmissionFeatureKey
  yearLabel?: string
  reason?: 'year-inactive' | 'feature-disabled'
  onGoToSetup?: () => void
}

export function AdmissionFeatureInactive({
  feature,
  yearLabel,
  reason = 'feature-disabled',
  onGoToSetup,
}: AdmissionFeatureInactiveProps) {
  const meta = ADMISSION_FEATURE_META[feature]

  const title =
    reason === 'year-inactive'
      ? `Academic year ${yearLabel ?? ''} is inactive`
      : `${meta.label} is inactive for ${yearLabel ?? 'this academic year'}`

  const description =
    reason === 'year-inactive'
      ? 'Activate the academic year in Admission Setup to use admission features.'
      : `Enable "${meta.label}" in Admission Setup for this academic year to access this section.`

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        {onGoToSetup && (
          <Button className="mt-6" onClick={onGoToSetup}>
            <Settings className="mr-2 h-4 w-4" />
            Go to Admission Setup
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
