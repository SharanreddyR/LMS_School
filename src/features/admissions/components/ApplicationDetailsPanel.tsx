import type { ApplicationFormData } from '../types/application'
import { APPLICATION_FIELD_GROUPS } from '../types/application'

interface ApplicationDetailsPanelProps {
  form: ApplicationFormData
}

function formatValue(key: keyof ApplicationFormData, value: unknown): string {
  if (value === undefined || value === null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (key === 'dateOfBirth' && typeof value === 'string') {
    try {
      return new Date(value).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return value
    }
  }
  if (key === 'gender' && typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  if (key === 'fatherAnnualIncome' || key === 'motherAnnualIncome') {
    const num = Number(value)
    return Number.isFinite(num) && num > 0 ? `₹${num.toLocaleString()}` : String(value)
  }
  return String(value)
}

export function ApplicationDetailsPanel({ form }: ApplicationDetailsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-muted px-2.5 py-1">
          Transport: {form.transportRequired ? 'Required' : 'Not required'}
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 capitalize">
          Type: {form.applicationType}
        </span>
        {form.correspondenceSameAsResidential && (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">
            Correspondence same as residential
          </span>
        )}
      </div>

      {APPLICATION_FIELD_GROUPS.map((group) => {
        if (group.title === 'Correspondence Address' && (form.permanentSameAsComm || form.correspondenceSameAsResidential)) {
          return null
        }

        return (
          <div key={group.title} className="rounded-lg border border-border bg-muted/20 p-3">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </h4>
            <dl className="grid gap-2 sm:grid-cols-2">
              {group.fields.map(({ key, label }) => (
                <div key={key}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium">{formatValue(key, form[key])}</dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}

      {form.additionalNotes && (
        <div className="rounded-lg border border-border p-3">
          <h4 className="mb-1 text-xs font-semibold text-muted-foreground">Additional Notes</h4>
          <p className="text-sm">{form.additionalNotes}</p>
        </div>
      )}
    </div>
  )
}
