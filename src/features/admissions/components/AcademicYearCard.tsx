import { useState } from 'react'
import { Pencil, Trash2, Star, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ADMISSION_FEATURE_META,
  type AcademicYear,
  type AdmissionFeatureKey,
} from '../types/setup'

interface AcademicYearCardProps {
  year: AcademicYear
  onEdit: (year: AcademicYear) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
  onSetCurrent: (id: string) => void
  onToggleFeature: (yearId: string, feature: AdmissionFeatureKey) => void
}

const FEATURE_GROUPS = [
  { id: 'admissions' as const, label: 'Admission Process' },
  { id: 'academics' as const, label: 'Academic Modules' },
]

export function AcademicYearCard({
  year,
  onEdit,
  onDelete,
  onToggleStatus,
  onSetCurrent,
  onToggleFeature,
}: AcademicYearCardProps) {
  const [expanded, setExpanded] = useState(false)

  const enabledCount = Object.values(year.features).filter(Boolean).length
  const totalFeatures = Object.keys(year.features).length

  return (
    <Card className={year.isCurrent ? 'border-brand-300 ring-1 ring-brand-200' : undefined}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">{year.label}</CardTitle>
              {year.isCurrent && (
                <Badge variant="default">
                  <Star className="mr-1 h-3 w-3" />
                  Current
                </Badge>
              )}
              <Badge variant={year.status === 'active' ? 'success' : 'secondary'}>
                {year.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(year.startDate)} — {formatDate(year.endDate)}
            </p>
            <p className="text-xs text-muted-foreground">
              {enabledCount} of {totalFeatures} modules enabled
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {!year.isCurrent && (
              <Button variant="outline" size="sm" onClick={() => onSetCurrent(year.id)}>
                Set Current
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(year.id)}
              title={year.status === 'active' ? 'Deactivate year' : 'Activate year'}
            >
              <Power className="mr-1.5 h-3.5 w-3.5" />
              {year.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(year)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(year.id)}
              disabled={year.isCurrent}
              title={year.isCurrent ? 'Cannot delete current year' : 'Delete year'}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Hide' : 'Show'} admission modules
        </Button>

        {expanded && (
          <div className="space-y-6">
            {FEATURE_GROUPS.map((group) => {
              const features = (Object.keys(ADMISSION_FEATURE_META) as AdmissionFeatureKey[]).filter(
                (key) => ADMISSION_FEATURE_META[key].group === group.id,
              )

              return (
                <div key={group.id} className="space-y-3">
                  <h4 className="text-sm font-semibold">{group.label}</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {features.map((feature) => {
                      const meta = ADMISSION_FEATURE_META[feature]
                      const enabled = year.features[feature]
                      const disabled = year.status === 'inactive'

                      return (
                        <Checkbox
                          key={feature}
                          label={meta.label}
                          description={meta.description}
                          checked={enabled}
                          disabled={disabled}
                          onChange={() => onToggleFeature(year.id, feature)}
                        />
                      )
                    })}
                  </div>
                  {year.status === 'inactive' && (
                    <p className="text-xs text-amber-600">
                      Activate this academic year to enable or disable modules.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
