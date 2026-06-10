import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet } from '@/components/ui/sheet'
import { GRADES } from '../data/mock-data'
import {
  BLOOD_GROUPS,
  BOARDS,
  CATEGORIES,
  INDIAN_STATES,
  PREVIOUS_CLASSES,
  RELIGIONS,
} from '../data/application-form.constants'
import type { AdmissionLead, ApplicationType } from '../types'
import {
  createApplicationFormFromLead,
  type ApplicationFormData,
} from '../types/application'

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

        <FormSection title="Student Details">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Student Name" required>
              <Input value={form.studentName} onChange={(e) => update('studentName', e.target.value)} required />
            </Field>
            <Field label="Date of Birth" required>
              <Input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} required />
            </Field>
            <Field label="Gender" required>
              <Select value={form.gender} onChange={(e) => update('gender', e.target.value)} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field label="Blood Group" required>
              <Select value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)} required>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </Select>
            </Field>
            <Field label="Category" required>
              <Select value={form.category} onChange={(e) => update('category', e.target.value)} required>
                <option value="">Select</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Caste">
              <Input value={form.caste} onChange={(e) => update('caste', e.target.value)} placeholder="Caste" />
            </Field>
            <Field label="Religion">
              <Select value={form.religion} onChange={(e) => update('religion', e.target.value)}>
                <option value="">Select</option>
                {RELIGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Nationality">
              <Input value={form.nationality} onChange={(e) => update('nationality', e.target.value)} />
            </Field>
            <Field label="Student Aadhaar No." required>
              <Input
                value={form.studentAadhaar}
                onChange={(e) => update('studentAadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="12-digit Aadhaar"
                maxLength={12}
                required
              />
            </Field>
            <Field label="PEN Number" required>
              <Input
                value={form.penNumber}
                onChange={(e) => update('penNumber', e.target.value.toUpperCase())}
                placeholder="Permanent Education Number"
                required
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Father Details">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Father Name" required>
              <Input value={form.fatherName} onChange={(e) => update('fatherName', e.target.value)} required />
            </Field>
            <Field label="Occupation">
              <Input value={form.fatherOccupation} onChange={(e) => update('fatherOccupation', e.target.value)} />
            </Field>
            <Field label="Phone" required>
              <Input value={form.fatherPhone} onChange={(e) => update('fatherPhone', e.target.value)} required />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.fatherEmail} onChange={(e) => update('fatherEmail', e.target.value)} />
            </Field>
            <Field label="Father Aadhaar No." required>
              <Input
                value={form.fatherAadhaar}
                onChange={(e) => update('fatherAadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="12-digit Aadhaar"
                maxLength={12}
                required
              />
            </Field>
            <Field label="Annual Income (₹)" required>
              <Input
                type="number"
                min={0}
                value={form.fatherAnnualIncome}
                onChange={(e) => update('fatherAnnualIncome', e.target.value)}
                placeholder="e.g. 500000"
                required
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Mother Details">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Mother Name" required>
              <Input value={form.motherName} onChange={(e) => update('motherName', e.target.value)} required />
            </Field>
            <Field label="Occupation">
              <Input value={form.motherOccupation} onChange={(e) => update('motherOccupation', e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={form.motherPhone} onChange={(e) => update('motherPhone', e.target.value)} />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.motherEmail} onChange={(e) => update('motherEmail', e.target.value)} />
            </Field>
            <Field label="Mother Aadhaar No." required>
              <Input
                value={form.motherAadhaar}
                onChange={(e) => update('motherAadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="12-digit Aadhaar"
                maxLength={12}
                required
              />
            </Field>
            <Field label="Annual Income (₹)">
              <Input
                type="number"
                min={0}
                value={form.motherAnnualIncome}
                onChange={(e) => update('motherAnnualIncome', e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Contact (Primary)">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Primary Contact Email" required>
              <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </Field>
            <Field label="Primary Contact Phone" required>
              <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Residential Address">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Address" required className="sm:col-span-2">
              <Textarea
                value={form.residentialAddress}
                onChange={(e) => update('residentialAddress', e.target.value)}
                placeholder="House no., street, locality"
                rows={2}
                required
              />
            </Field>
            <Field label="City" required>
              <Input value={form.residentialCity} onChange={(e) => update('residentialCity', e.target.value)} required />
            </Field>
            <Field label="State" required>
              <Select value={form.residentialState} onChange={(e) => update('residentialState', e.target.value)} required>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Pincode" required>
              <Input
                value={form.residentialPincode}
                onChange={(e) => update('residentialPincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Correspondence Address">
          <Checkbox
            label="Same as residential address"
            checked={form.correspondenceSameAsResidential}
            onChange={(e) => update('correspondenceSameAsResidential', e.target.checked)}
          />
          {!form.correspondenceSameAsResidential && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Address" className="sm:col-span-2">
                <Textarea
                  value={form.correspondenceAddress}
                  onChange={(e) => update('correspondenceAddress', e.target.value)}
                  rows={2}
                />
              </Field>
              <Field label="City">
                <Input value={form.correspondenceCity} onChange={(e) => update('correspondenceCity', e.target.value)} />
              </Field>
              <Field label="State">
                <Select value={form.correspondenceState} onChange={(e) => update('correspondenceState', e.target.value)}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Pincode">
                <Input
                  value={form.correspondencePincode}
                  onChange={(e) => update('correspondencePincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </Field>
            </div>
          )}
        </FormSection>

        <FormSection title="Academic History">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Grade Applying" required>
              <Select value={form.gradeApplying} onChange={(e) => update('gradeApplying', e.target.value)} required>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
            </Field>
            <Field label="Academic Year" required>
              <Input value={form.academicYear} onChange={(e) => update('academicYear', e.target.value)} required />
            </Field>
            <Field label="Previous Class" required>
              <Select value={form.previousClass} onChange={(e) => update('previousClass', e.target.value)} required>
                <option value="">Select</option>
                {PREVIOUS_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Previous School" required>
              <Input
                value={form.previousSchool}
                onChange={(e) => update('previousSchool', e.target.value)}
                placeholder="Last school attended"
                required
              />
            </Field>
            <Field label="Previous Board">
              <Select value={form.previousBoard} onChange={(e) => update('previousBoard', e.target.value)}>
                <option value="">Select</option>
                {BOARDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </Select>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Admission Options">
          <div className="space-y-3">
            <Field label="Application Type" required>
              <Select
                value={form.applicationType}
                onChange={(e) => update('applicationType', e.target.value as ApplicationType)}
              >
                <option value="internal">Internal (New Admission)</option>
                <option value="external">External (Transfer)</option>
              </Select>
            </Field>
            <Checkbox
              label="Transport required"
              description="School bus / transport facility needed"
              checked={form.transportRequired}
              onChange={(e) => update('transportRequired', e.target.checked)}
            />
            <Checkbox
              label="Required documents submitted"
              description="Birth certificate, Aadhaar copies, report card, photos, transfer certificate"
              checked={form.documentsSubmitted}
              onChange={(e) => update('documentsSubmitted', e.target.checked)}
            />
            <Field label="Additional Notes">
              <Textarea
                value={form.additionalNotes}
                onChange={(e) => update('additionalNotes', e.target.value)}
                placeholder="Medical conditions, special needs, sibling details..."
                rows={3}
              />
            </Field>
          </div>
        </FormSection>

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

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  )
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  )
}
