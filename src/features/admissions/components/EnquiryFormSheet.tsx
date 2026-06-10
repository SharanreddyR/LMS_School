import { useState } from 'react'
import { format } from 'date-fns'
import { MessageSquare } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ASSIGNEES, GRADES } from '../data/mock-data'
import { GENDERS, GENDER_LABELS, INDIAN_STATES } from '../data/enquiry-form.constants'
import {
  ENQUIRY_SOURCE_LABELS,
  ENQUIRY_STATUS_LABELS,
  PARENT_RELATIONSHIP_LABELS,
  type EnquiryFormValues,
  type EnquiryStatus,
  type LeadSource,
  type ParentRelationship,
} from '../types/enquiry'

export type { EnquiryFormValues }

interface EnquiryFormSheetProps {
  open: boolean
  onClose: () => void
  defaultAcademicYear: string
  /** When true, parent email is required and an application link is emailed on save */
  sendApplicationLinkOnSave?: boolean
  onSubmit: (values: EnquiryFormValues) => void | Promise<void>
}

const emptyForm = (academicYear: string): EnquiryFormValues => ({
  studentName: '',
  dateOfBirth: '',
  gender: '',
  gradeApplying: 'Grade 1',
  academicYear,
  parentName: '',
  parentRelationship: 'father',
  phone: '',
  email: '',
  city: '',
  state: '',
  currentSchool: '',
  source: 'website',
  assignedTo: ASSIGNEES[0],
})

export function EnquiryFormSheet({
  open,
  onClose,
  defaultAcademicYear,
  sendApplicationLinkOnSave,
  onSubmit,
}: EnquiryFormSheetProps) {
  const [form, setForm] = useState(() => emptyForm(defaultAcademicYear))
  const [trackingStatus, setTrackingStatus] = useState<EnquiryStatus>('new')

  const update = (patch: Partial<EnquiryFormValues>) => setForm((f) => ({ ...f, ...patch }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.studentName.trim() || !form.parentName.trim() || !form.phone.trim()) return
    if (sendApplicationLinkOnSave && !form.email.trim()) return
    await onSubmit({ ...form, enquiryStatus: trackingStatus })
    setForm(emptyForm(defaultAcademicYear))
    setTrackingStatus('new')
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="New Enquiry"
      description="Step 1 — collect minimal details only. Full application comes later."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50/50 px-4 py-3">
          <MessageSquare className="h-5 w-5 shrink-0 text-brand-600" />
          <p className="text-sm text-muted-foreground">
            Keep it short — 8–10 fields so parents are not overwhelmed. Enquiry number is auto-generated on save.
            {sendApplicationLinkOnSave && (
              <> When you enter the parent&apos;s email, the online application link is sent automatically after submit.</>
            )}
          </p>
        </div>

        <FormBlock title="Student Information">
          <Grid>
            <Field label="Student Name *" required><Input value={form.studentName} onChange={(e) => update({ studentName: e.target.value })} required /></Field>
            <Field label="Date of Birth *" required><Input type="date" value={form.dateOfBirth} onChange={(e) => update({ dateOfBirth: e.target.value })} required /></Field>
            <Field label="Gender *" required>
              <Select value={form.gender} onChange={(e) => update({ gender: e.target.value })} required>
                <option value="">Select</option>
                {GENDERS.map((g) => <option key={g} value={g}>{GENDER_LABELS[g]}</option>)}
              </Select>
            </Field>
            <Field label="Class Applying For *" required>
              <Select value={form.gradeApplying} onChange={(e) => update({ gradeApplying: e.target.value })} required>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </Select>
            </Field>
            <Field label="Academic Year Applying For *" required>
              <Input value={form.academicYear} onChange={(e) => update({ academicYear: e.target.value })} required />
            </Field>
          </Grid>
        </FormBlock>

        <FormBlock title="Parent Information">
          <Grid>
            <Field label="Parent / Guardian Name *" required><Input value={form.parentName} onChange={(e) => update({ parentName: e.target.value })} required /></Field>
            <Field label="Relationship">
              <Select value={form.parentRelationship} onChange={(e) => update({ parentRelationship: e.target.value as ParentRelationship })}>
                {Object.entries(PARENT_RELATIONSHIP_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
            <Field label="Mobile Number *" required><Input value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+91" required /></Field>
            <Field label={sendApplicationLinkOnSave ? 'Email Address *' : 'Email Address'} required={sendApplicationLinkOnSave}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="Parent email — application link will be sent here"
                required={sendApplicationLinkOnSave}
              />
            </Field>
          </Grid>
        </FormBlock>

        <FormBlock title="Address Information">
          <Grid>
            <Field label="City *" required><Input value={form.city} onChange={(e) => update({ city: e.target.value })} required /></Field>
            <Field label="State *" required>
              <Select value={form.state} onChange={(e) => update({ state: e.target.value })} required>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </Grid>
        </FormBlock>

        <FormBlock title="Additional Information">
          <Grid>
            <Field label="Current School Name"><Input value={form.currentSchool} onChange={(e) => update({ currentSchool: e.target.value })} placeholder="If applicable" /></Field>
            <Field label="How did you hear about us?">
              <Select value={form.source} onChange={(e) => update({ source: e.target.value as LeadSource })}>
                {Object.entries(ENQUIRY_SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
          </Grid>
        </FormBlock>

        <FormBlock title="Admission Team Tracking">
          <Grid>
            <Field label="Enquiry Date"><Input value={format(new Date(), 'yyyy-MM-dd')} readOnly className="bg-muted" /></Field>
            <Field label="Enquiry Number"><Input value="Auto on save" readOnly className="bg-muted font-mono text-xs" /></Field>
            <Field label="Counsellor Assigned">
              <Select value={form.assignedTo} onChange={(e) => update({ assignedTo: e.target.value })}>
                {ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={trackingStatus} onChange={(e) => setTrackingStatus(e.target.value as EnquiryStatus)}>
                {Object.entries(ENQUIRY_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
          </Grid>
        </FormBlock>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit Enquiry</Button>
        </div>
      </form>
    </Sheet>
  )
}

function FormBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}{required && <span className="text-red-500"> *</span>}</label>
      {children}
    </div>
  )
}
