import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { ApplicationFormFields } from './ApplicationFormFields'
import type { AdmissionLead } from '../types'
import { areDeclarationsComplete, createApplicationFormFromLead, type ApplicationFormData } from '../types/application'

interface ApplicationFormSheetProps {
  lead: AdmissionLead | null
  open: boolean
  onClose: () => void
  onSubmit: (leadId: string, form: ApplicationFormData) => void
}

export function ApplicationFormSheet({ lead, open, onClose, onSubmit }: ApplicationFormSheetProps) {
  const [form, setForm] = useState<ApplicationFormData | null>(null)

  useEffect(() => {
    if (open && lead) {
      setForm(createApplicationFormFromLead(lead))
    }
  }, [open, lead])

  if (!lead || !form) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!areDeclarationsComplete(form)) {
      alert('Please accept all required declarations before submitting.')
      return
    }
    onSubmit(lead.id, form)
    onClose()
  }

  const update = <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Fill Application"
      description={`Complete admission form for ${lead.studentName} · enquiry ${lead.id}`}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-4">
        <div className="rounded-lg border border-brand-200 bg-brand-50/50 px-4 py-3 text-sm text-brand-800">
          Collect all student and family details in one form. This information is stored permanently
          so parents are not asked again during enrollment.
        </div>

        <ApplicationFormFields form={form} onChange={update} />

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-card py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <FileText className="h-4 w-4" />
            Submit Application
          </Button>
        </div>
      </form>
    </Sheet>
  )
}
