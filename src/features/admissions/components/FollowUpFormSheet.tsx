import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ASSIGNEES } from '../data/mock-data'
import { PRIORITY_LABELS, type AdmissionLead, type Priority } from '../types'

export interface FollowUpFormValues {
  leadId: string
  title: string
  description: string
  dueDate: string
  assignedTo: string
  priority: Priority
  type: 'call' | 'email' | 'visit' | 'meeting'
}

interface FollowUpFormSheetProps {
  open: boolean
  onClose: () => void
  leads: AdmissionLead[]
  onSubmit: (values: FollowUpFormValues) => void
}

export function FollowUpFormSheet({ open, onClose, leads, onSubmit }: FollowUpFormSheetProps) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 16)

  const [form, setForm] = useState<FollowUpFormValues>({
    leadId: leads[0]?.id ?? '',
    title: '',
    description: '',
    dueDate: tomorrow,
    assignedTo: ASSIGNEES[0],
    priority: 'medium',
    type: 'call',
  })

  const update = (patch: Partial<FollowUpFormValues>) => setForm((f) => ({ ...f, ...patch }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.leadId || !form.title.trim()) return
    onSubmit(form)
    setForm({
      leadId: leads[0]?.id ?? '',
      title: '',
      description: '',
      dueDate: tomorrow,
      assignedTo: ASSIGNEES[0],
      priority: 'medium',
      type: 'call',
    })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Schedule Follow-up"
      description="Plan a call, email, visit, or meeting with a prospective family"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
          <CalendarClock className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-muted-foreground">
            Follow-ups keep enquiries moving through the admission pipeline.
          </p>
        </div>

        <div className="grid gap-4">
          <Field label="Lead / Enquiry *">
            <Select value={form.leadId} onChange={(e) => update({ leadId: e.target.value })} required>
              <option value="">Select lead</option>
              {leads.filter((l) => l.stage !== 'enrolled' && l.stage !== 'lost').map((l) => (
                <option key={l.id} value={l.id}>
                  {l.studentName} — {l.gradeApplying}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Title *">
            <Input value={form.title} onChange={(e) => update({ title: e.target.value })} placeholder="Campus tour call" required />
          </Field>
          <Field label="Description">
            <Input value={form.description} onChange={(e) => update({ description: e.target.value })} placeholder="Optional notes" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Due Date & Time">
              <Input type="datetime-local" value={form.dueDate} onChange={(e) => update({ dueDate: e.target.value })} />
            </Field>
            <Field label="Type">
              <Select value={form.type} onChange={(e) => update({ type: e.target.value as FollowUpFormValues['type'] })}>
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="visit">Campus Visit</option>
                <option value="meeting">Meeting</option>
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} onChange={(e) => update({ priority: e.target.value as Priority })}>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </Field>
            <Field label="Assigned To">
              <Select value={form.assignedTo} onChange={(e) => update({ assignedTo: e.target.value })}>
                {ASSIGNEES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Schedule</Button>
        </div>
      </form>
    </Sheet>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
