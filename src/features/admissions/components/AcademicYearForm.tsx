import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet } from '@/components/ui/sheet'
import {
  ADMISSION_FEATURE_META,
  DEFAULT_ADMISSION_FEATURES,
  type AcademicYear,
  type AcademicYearInput,
  type AdmissionFeatureKey,
} from '../types/setup'

interface AcademicYearFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: AcademicYearInput) => void
  initial?: AcademicYear | null
}

const EMPTY_FORM: AcademicYearInput = {
  label: '',
  startDate: '',
  endDate: '',
  status: 'inactive',
  isCurrent: false,
  features: { ...DEFAULT_ADMISSION_FEATURES },
}

export function AcademicYearForm({ open, onClose, onSubmit, initial }: AcademicYearFormProps) {
  const [form, setForm] = useState<AcademicYearInput>(EMPTY_FORM)

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              label: initial.label,
              startDate: initial.startDate,
              endDate: initial.endDate,
              status: initial.status,
              isCurrent: initial.isCurrent,
              features: { ...initial.features },
            }
          : { ...EMPTY_FORM, features: { ...DEFAULT_ADMISSION_FEATURES } },
      )
    }
  }, [open, initial])

  const updateFeature = (feature: AdmissionFeatureKey, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      features: { ...prev.features, [feature]: checked },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label.trim() || !form.startDate || !form.endDate) return
    onSubmit(form)
    onClose()
  }

  const featureKeys = Object.keys(ADMISSION_FEATURE_META) as AdmissionFeatureKey[]

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Academic Year' : 'Add Academic Year'}
      description="Configure the academic year and select which admission modules are active."
    >
      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="year-label" className="text-sm font-medium">
              Academic Year Label
            </label>
            <Input
              id="year-label"
              placeholder="e.g. 2026-27"
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="start-date" className="text-sm font-medium">
              Start Date
            </label>
            <Input
              id="start-date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="end-date" className="text-sm font-medium">
              End Date
            </label>
            <Input
              id="end-date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="year-status" className="text-sm font-medium">
              Status
            </label>
            <Select
              id="year-status"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value as AcademicYearInput['status'] }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Checkbox
              label="Set as current academic year"
              checked={form.isCurrent}
              onChange={(e) => setForm((p) => ({ ...p, isCurrent: e.target.checked }))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold">Active Modules</h4>
            <p className="text-xs text-muted-foreground">
              Check the modules that should be available for this academic year. Unchecked modules
              will be hidden from the admission process.
            </p>
          </div>
          <div className="grid gap-2">
            {featureKeys.map((feature) => {
              const meta = ADMISSION_FEATURE_META[feature]
              return (
                <Checkbox
                  key={feature}
                  label={meta.label}
                  description={meta.description}
                  checked={form.features[feature]}
                  disabled={form.status === 'inactive'}
                  onChange={(e) => updateFeature(feature, e.target.checked)}
                />
              )
            })}
          </div>
          {form.status === 'inactive' && (
            <p className="text-xs text-amber-600">
              Set status to Active to enable module selection.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initial ? 'Save Changes' : 'Add Academic Year'}</Button>
        </div>
      </form>
    </Sheet>
  )
}
