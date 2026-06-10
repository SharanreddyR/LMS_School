import { createContext, useContext, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { GRADES } from '../data/mock-data'
import {
  BLOOD_GROUPS,
  BOARDS,
  CATEGORIES,
  INDIAN_STATES,
  PREVIOUS_CLASSES,
  RELIGIONS,
} from '../data/application-form.constants'
import { GENDERS, GENDER_LABELS } from '../data/enquiry-form.constants'
import type { ApplicationType } from '../types'
import {
  APPLICATION_WIZARD_STEPS,
  type ApplicationFormData,
} from '../types/application'

interface ApplicationFormWizardProps {
  form: ApplicationFormData
  onChange: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void
  hideApplicationType?: boolean
  variant?: 'default' | 'public'
}

const FormLayoutContext = createContext<{ variant: 'default' | 'public' }>({ variant: 'default' })

export function ApplicationFormWizard({ form, onChange, hideApplicationType, variant = 'default' }: ApplicationFormWizardProps) {
  const [step, setStep] = useState(0)
  const update = onChange
  const total = APPLICATION_WIZARD_STEPS.length
  const progress = Math.round(((step + 1) / total) * 100)

  const stepContent = (
    <>
      <div className={variant === 'public' ? 'min-h-[360px]' : 'min-h-[320px]'}>
        {step === 0 && <StudentStep form={form} update={update} />}
        {step === 1 && <ParentsStep form={form} update={update} />}
        {step === 2 && <GuardianStep form={form} update={update} />}
        {step === 3 && <AddressStep form={form} update={update} />}
        {step === 4 && <AcademicStep form={form} update={update} hideApplicationType={hideApplicationType} />}
        {step === 5 && <MedicalStep form={form} update={update} />}
        {step === 6 && <EmergencyStep form={form} update={update} />}
        {step === 7 && <TransportHostelStep form={form} update={update} />}
        {step === 8 && <SiblingStep form={form} update={update} />}
        {step === 9 && <DocumentsStep form={form} update={update} />}
        {step === 10 && <DeclarationStep form={form} update={update} />}
      </div>

      <div className={cn('flex items-center justify-between pt-4', variant === 'public' ? 'border-t border-border' : 'border-t border-border')}>
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-xs text-muted-foreground">Step {step + 1} of {total}</span>
        <Button type="button" variant={variant === 'public' ? 'default' : 'outline'} disabled={step >= total - 1} onClick={() => setStep((s) => s + 1)} className="gap-1">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  )

  if (variant === 'public') {
    return (
      <FormLayoutContext.Provider value={{ variant: 'public' }}>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{APPLICATION_WIZARD_STEPS[step].title}</p>
              <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-brand-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {APPLICATION_WIZARD_STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(
                    'shrink-0 rounded-md px-2 py-1 text-[10px] font-medium sm:text-xs',
                    i === step ? 'bg-brand-100 text-brand-800' : i < step ? 'text-green-700' : 'text-muted-foreground',
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm backdrop-blur sm:p-6">
            {stepContent}
          </div>
        </div>
      </FormLayoutContext.Provider>
    )
  }

  return (
    <FormLayoutContext.Provider value={{ variant: 'default' }}>
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {APPLICATION_WIZARD_STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
              i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground',
            )}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>
      {stepContent}
    </div>
    </FormLayoutContext.Provider>
  )
}

type Updater = ApplicationFormWizardProps['onChange']

function StudentStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 1: Student Details">
      <Grid>
        <Field label="First Name *" required><Input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required /></Field>
        <Field label="Middle Name"><Input value={form.middleName} onChange={(e) => update('middleName', e.target.value)} /></Field>
        <Field label="Last Name *" required><Input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required /></Field>
        <Field label="Admission Number"><Input value={form.admissionNumber} readOnly placeholder="Auto-generated" className="bg-muted" /></Field>
        <Field label="Date of Birth *" required><Input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} required /></Field>
        <Field label="Gender *" required>
          <Select value={form.gender} onChange={(e) => update('gender', e.target.value)} required>
            <option value="">Select</option>
            {GENDERS.map((g) => <option key={g} value={g}>{GENDER_LABELS[g]}</option>)}
          </Select>
        </Field>
        <Field label="Blood Group"><Select value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)}><option value="">Select</option>{BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}</Select></Field>
        <Field label="Nationality *" required><Input value={form.nationality} onChange={(e) => update('nationality', e.target.value)} required /></Field>
        <Field label="Religion"><Select value={form.religion} onChange={(e) => update('religion', e.target.value)}><option value="">Select</option>{RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</Select></Field>
        <Field label="Category"><Select value={form.category} onChange={(e) => update('category', e.target.value)}><option value="">Select</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Field>
        <Field label="Aadhaar Number"><Input value={form.studentAadhaar} onChange={(e) => update('studentAadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} maxLength={12} /></Field>
        <Field label="Mother Tongue"><Input value={form.motherTongue} onChange={(e) => update('motherTongue', e.target.value)} /></Field>
        <Field label="Place of Birth"><Input value={form.placeOfBirth} onChange={(e) => update('placeOfBirth', e.target.value)} /></Field>
        <Field label="State of Birth"><Select value={form.stateOfBirth} onChange={(e) => update('stateOfBirth', e.target.value)}><option value="">Select</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
        <Field label="Country of Birth"><Input value={form.countryOfBirth} onChange={(e) => update('countryOfBirth', e.target.value)} /></Field>
        <Field label="Student Photo" required className="md:col-span-2 xl:col-span-3">
          <Checkbox label="Student photograph uploaded" checked={form.docStudentPhoto} onChange={(e) => { update('docStudentPhoto', e.target.checked); update('studentPhotoUploaded', e.target.checked) }} />
        </Field>
      </Grid>
    </Section>
  )
}

function ParentsStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 2: Parent Details">
      <p className="mb-3 text-xs font-semibold text-muted-foreground">Father Information</p>
      <Grid>
        <Field label="Father Name *" required><Input value={form.fatherName} onChange={(e) => update('fatherName', e.target.value)} required /></Field>
        <Field label="Mobile *" required><Input value={form.fatherPhone} onChange={(e) => update('fatherPhone', e.target.value)} required /></Field>
        <Field label="Email"><Input type="email" value={form.fatherEmail} onChange={(e) => update('fatherEmail', e.target.value)} /></Field>
        <Field label="Occupation"><Input value={form.fatherOccupation} onChange={(e) => update('fatherOccupation', e.target.value)} /></Field>
        <Field label="Company"><Input value={form.fatherCompany} onChange={(e) => update('fatherCompany', e.target.value)} /></Field>
        <Field label="Designation"><Input value={form.fatherDesignation} onChange={(e) => update('fatherDesignation', e.target.value)} /></Field>
        <Field label="Qualification"><Input value={form.fatherQualification} onChange={(e) => update('fatherQualification', e.target.value)} /></Field>
        <Field label="Annual Income"><Input type="number" value={form.fatherAnnualIncome} onChange={(e) => update('fatherAnnualIncome', e.target.value)} /></Field>
        <Field label="Aadhaar"><Input value={form.fatherAadhaar} onChange={(e) => update('fatherAadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} maxLength={12} /></Field>
      </Grid>
      <p className="mb-3 mt-4 text-xs font-semibold text-muted-foreground">Mother Information</p>
      <Grid>
        <Field label="Mother Name *" required><Input value={form.motherName} onChange={(e) => update('motherName', e.target.value)} required /></Field>
        <Field label="Mobile *" required><Input value={form.motherPhone} onChange={(e) => update('motherPhone', e.target.value)} required /></Field>
        <Field label="Email"><Input type="email" value={form.motherEmail} onChange={(e) => update('motherEmail', e.target.value)} /></Field>
        <Field label="Occupation"><Input value={form.motherOccupation} onChange={(e) => update('motherOccupation', e.target.value)} /></Field>
        <Field label="Company"><Input value={form.motherCompany} onChange={(e) => update('motherCompany', e.target.value)} /></Field>
        <Field label="Designation"><Input value={form.motherDesignation} onChange={(e) => update('motherDesignation', e.target.value)} /></Field>
        <Field label="Qualification"><Input value={form.motherQualification} onChange={(e) => update('motherQualification', e.target.value)} /></Field>
        <Field label="Annual Income"><Input type="number" value={form.motherAnnualIncome} onChange={(e) => update('motherAnnualIncome', e.target.value)} /></Field>
        <Field label="Aadhaar"><Input value={form.motherAadhaar} onChange={(e) => update('motherAadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} maxLength={12} /></Field>
      </Grid>
    </Section>
  )
}

function GuardianStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 3: Guardian Details (Optional)">
      <Grid>
        <Field label="Guardian Name"><Input value={form.guardianName} onChange={(e) => update('guardianName', e.target.value)} /></Field>
        <Field label="Relationship"><Input value={form.guardianRelationship} onChange={(e) => update('guardianRelationship', e.target.value)} /></Field>
        <Field label="Mobile"><Input value={form.guardianPhone} onChange={(e) => update('guardianPhone', e.target.value)} /></Field>
        <Field label="Email"><Input type="email" value={form.guardianEmail} onChange={(e) => update('guardianEmail', e.target.value)} /></Field>
        <Field label="Occupation"><Input value={form.guardianOccupation} onChange={(e) => update('guardianOccupation', e.target.value)} /></Field>
        <Field label="Address" className="md:col-span-2 xl:col-span-3"><Textarea value={form.guardianAddress} onChange={(e) => update('guardianAddress', e.target.value)} rows={2} /></Field>
      </Grid>
    </Section>
  )
}

function AddressStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 4: Communication Address">
      <Grid>
        <Field label="Address Line 1" className="md:col-span-2 xl:col-span-3" required><Input value={form.commAddressLine1} onChange={(e) => update('commAddressLine1', e.target.value)} required /></Field>
        <Field label="Address Line 2" className="md:col-span-2 xl:col-span-3"><Input value={form.commAddressLine2} onChange={(e) => update('commAddressLine2', e.target.value)} /></Field>
        <Field label="Area *" required><Input value={form.commArea} onChange={(e) => update('commArea', e.target.value)} required /></Field>
        <Field label="Landmark"><Input value={form.commLandmark} onChange={(e) => update('commLandmark', e.target.value)} /></Field>
        <Field label="City *" required><Input value={form.commCity} onChange={(e) => update('commCity', e.target.value)} required /></Field>
        <Field label="District *" required><Input value={form.commDistrict} onChange={(e) => update('commDistrict', e.target.value)} required /></Field>
        <Field label="State *" required><Select value={form.commState} onChange={(e) => update('commState', e.target.value)} required><option value="">Select</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
        <Field label="Country *" required><Input value={form.commCountry} onChange={(e) => update('commCountry', e.target.value)} required /></Field>
        <Field label="Pincode *" required><Input value={form.commPincode} onChange={(e) => update('commPincode', e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} required /></Field>
      </Grid>
      <div className="mt-4">
        <Checkbox label="Permanent address same as communication address" checked={form.permanentSameAsComm} onChange={(e) => update('permanentSameAsComm', e.target.checked)} />
      </div>
      {!form.permanentSameAsComm && (
        <Grid className="mt-3">
          <Field label="Permanent Address Line 1" className="md:col-span-2 xl:col-span-3"><Input value={form.permanentAddressLine1} onChange={(e) => update('permanentAddressLine1', e.target.value)} /></Field>
          <Field label="City"><Input value={form.permanentCity} onChange={(e) => update('permanentCity', e.target.value)} /></Field>
          <Field label="State"><Select value={form.permanentState} onChange={(e) => update('permanentState', e.target.value)}><option value="">Select</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
          <Field label="Pincode"><Input value={form.permanentPincode} onChange={(e) => update('permanentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} /></Field>
        </Grid>
      )}
    </Section>
  )
}

function AcademicStep({ form, update, hideApplicationType }: { form: ApplicationFormData; update: Updater; hideApplicationType?: boolean }) {
  return (
    <Section title="Section 5: Academic Information">
      <Grid>
        <Field label="Academic Year *" required><Input value={form.academicYear} onChange={(e) => update('academicYear', e.target.value)} required /></Field>
        <Field label="Grade / Class Applying *" required><Select value={form.gradeApplying} onChange={(e) => update('gradeApplying', e.target.value)} required>{GRADES.map((g) => <option key={g} value={g}>{g}</option>)}</Select></Field>
        <Field label="Stream"><Input value={form.stream} onChange={(e) => update('stream', e.target.value)} placeholder="Science / Commerce / Arts" /></Field>
        <Field label="Medium of Instruction"><Input value={form.mediumOfInstruction} onChange={(e) => update('mediumOfInstruction', e.target.value)} /></Field>
        <Field label="Previous School Name *" required><Input value={form.previousSchool} onChange={(e) => update('previousSchool', e.target.value)} required /></Field>
        <Field label="School Board"><Select value={form.previousBoard} onChange={(e) => update('previousBoard', e.target.value)}><option value="">Select</option>{BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}</Select></Field>
        <Field label="School Address" className="md:col-span-2 xl:col-span-3"><Input value={form.previousSchoolAddress} onChange={(e) => update('previousSchoolAddress', e.target.value)} /></Field>
        <Field label="Last Class Studied *" required><Select value={form.previousClass} onChange={(e) => update('previousClass', e.target.value)} required><option value="">Select</option>{PREVIOUS_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Field>
        <Field label="Percentage / Grade"><Input value={form.previousPercentage} onChange={(e) => update('previousPercentage', e.target.value)} /></Field>
        <Field label="TC Number"><Input value={form.tcNumber} onChange={(e) => update('tcNumber', e.target.value)} /></Field>
        <Field label="Date of Leaving"><Input type="date" value={form.dateOfLeaving} onChange={(e) => update('dateOfLeaving', e.target.value)} /></Field>
        {!hideApplicationType && (
          <Field label="Application Type"><Select value={form.applicationType} onChange={(e) => update('applicationType', e.target.value as ApplicationType)}><option value="internal">Internal</option><option value="external">External (Transfer)</option></Select></Field>
        )}
      </Grid>
    </Section>
  )
}

function MedicalStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 6: Medical Information">
      <Grid>
        <Field label="Height (cm)"><Input value={form.height} onChange={(e) => update('height', e.target.value)} /></Field>
        <Field label="Weight (kg)"><Input value={form.weight} onChange={(e) => update('weight', e.target.value)} /></Field>
        <Field label="Allergies"><Input value={form.allergies} onChange={(e) => update('allergies', e.target.value)} /></Field>
        <Field label="Medical Conditions"><Input value={form.medicalConditions} onChange={(e) => update('medicalConditions', e.target.value)} /></Field>
        <Field label="Disability Details"><Input value={form.disabilityDetails} onChange={(e) => update('disabilityDetails', e.target.value)} /></Field>
        <Field label="Special Learning Needs"><Input value={form.specialLearningNeeds} onChange={(e) => update('specialLearningNeeds', e.target.value)} /></Field>
        <Field label="Vaccination Status"><Input value={form.vaccinationStatus} onChange={(e) => update('vaccinationStatus', e.target.value)} /></Field>
        <Field label="Doctor Name"><Input value={form.doctorName} onChange={(e) => update('doctorName', e.target.value)} /></Field>
        <Field label="Doctor Contact"><Input value={form.doctorContact} onChange={(e) => update('doctorContact', e.target.value)} /></Field>
      </Grid>
    </Section>
  )
}

function EmergencyStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 7: Emergency Contact">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Contact 1</p>
      <Grid>
        <Field label="Name *" required><Input value={form.emergency1Name} onChange={(e) => update('emergency1Name', e.target.value)} required /></Field>
        <Field label="Relationship *" required><Input value={form.emergency1Relationship} onChange={(e) => update('emergency1Relationship', e.target.value)} required /></Field>
        <Field label="Mobile *" required><Input value={form.emergency1Phone} onChange={(e) => update('emergency1Phone', e.target.value)} required /></Field>
      </Grid>
      <p className="mb-2 mt-4 text-xs font-semibold text-muted-foreground">Contact 2 (Optional)</p>
      <Grid>
        <Field label="Name"><Input value={form.emergency2Name} onChange={(e) => update('emergency2Name', e.target.value)} /></Field>
        <Field label="Relationship"><Input value={form.emergency2Relationship} onChange={(e) => update('emergency2Relationship', e.target.value)} /></Field>
        <Field label="Mobile"><Input value={form.emergency2Phone} onChange={(e) => update('emergency2Phone', e.target.value)} /></Field>
      </Grid>
    </Section>
  )
}

function TransportHostelStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <div className="space-y-4">
      <Section title="Section 8: Transport">
        <Checkbox label="Transport required" checked={form.transportRequired} onChange={(e) => update('transportRequired', e.target.checked)} />
        {form.transportRequired && (
          <Grid className="mt-3">
            <Field label="Pickup Address"><Input value={form.pickupAddress} onChange={(e) => update('pickupAddress', e.target.value)} /></Field>
            <Field label="Drop Address"><Input value={form.dropAddress} onChange={(e) => update('dropAddress', e.target.value)} /></Field>
            <Field label="Bus Stop"><Input value={form.busStop} onChange={(e) => update('busStop', e.target.value)} /></Field>
            <Field label="Route"><Input value={form.transportRoute} onChange={(e) => update('transportRoute', e.target.value)} /></Field>
          </Grid>
        )}
      </Section>
      <Section title="Section 9: Hostel">
        <Checkbox label="Hostel required" checked={form.hostelRequired} onChange={(e) => update('hostelRequired', e.target.checked)} />
        {form.hostelRequired && (
          <Grid className="mt-3">
            <Field label="Room Type"><Input value={form.hostelRoomType} onChange={(e) => update('hostelRoomType', e.target.value)} /></Field>
            <Field label="Food Preference"><Input value={form.foodPreference} onChange={(e) => update('foodPreference', e.target.value)} /></Field>
            <Field label="Local Guardian Name"><Input value={form.localGuardianName} onChange={(e) => update('localGuardianName', e.target.value)} /></Field>
            <Field label="Local Guardian Contact"><Input value={form.localGuardianContact} onChange={(e) => update('localGuardianContact', e.target.value)} /></Field>
          </Grid>
        )}
      </Section>
    </div>
  )
}

function SiblingStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 10: Sibling Information">
      <Checkbox label="Sibling studying in this school" checked={form.siblingInSchool} onChange={(e) => update('siblingInSchool', e.target.checked)} />
      {form.siblingInSchool && (
        <Grid className="mt-3">
          <Field label="Sibling Name"><Input value={form.siblingName} onChange={(e) => update('siblingName', e.target.value)} /></Field>
          <Field label="Admission Number"><Input value={form.siblingAdmissionNo} onChange={(e) => update('siblingAdmissionNo', e.target.value)} /></Field>
          <Field label="Class"><Input value={form.siblingClass} onChange={(e) => update('siblingClass', e.target.value)} /></Field>
          <Field label="Section"><Input value={form.siblingSection} onChange={(e) => update('siblingSection', e.target.value)} /></Field>
        </Grid>
      )}
    </Section>
  )
}

function DocumentsStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  const docs = [
    { key: 'docStudentPhoto' as const, label: 'Student Photograph', mandatory: true },
    { key: 'docBirthCertificate' as const, label: 'Birth Certificate', mandatory: true },
    { key: 'docAadhaar' as const, label: 'Aadhaar Card', mandatory: true },
    { key: 'docAddressProof' as const, label: 'Address Proof', mandatory: true },
    { key: 'docReportCard' as const, label: 'Previous Report Card', mandatory: true },
    { key: 'docTransferCertificate' as const, label: 'Transfer Certificate', mandatory: true },
    { key: 'docCasteCertificate' as const, label: 'Caste Certificate', mandatory: false },
    { key: 'docIncomeCertificate' as const, label: 'Income Certificate', mandatory: false },
    { key: 'docPassport' as const, label: 'Passport Copy', mandatory: false },
    { key: 'docMedicalCertificate' as const, label: 'Medical Certificate', mandatory: false },
    { key: 'docDisabilityCertificate' as const, label: 'Disability Certificate', mandatory: false },
  ]

  return (
    <Section title="Section 11: Document Uploads">
      <p className="mb-3 text-sm text-muted-foreground">Mark documents as uploaded (demo mode — file upload simulated).</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map(({ key, label, mandatory }) => (
          <div key={key} className="rounded-lg border border-border bg-muted/20 px-3 py-2">
            <Checkbox label={mandatory ? `${label} *` : label} checked={form[key]} onChange={(e) => update(key, e.target.checked)} />
          </div>
        ))}
      </div>
    </Section>
  )
}

function DeclarationStep({ form, update }: { form: ApplicationFormData; update: Updater }) {
  return (
    <Section title="Section 12: Declarations">
      <div className="space-y-2">
        <Checkbox label="Information provided is true and correct" checked={form.declInfoTrue} onChange={(e) => update('declInfoTrue', e.target.checked)} />
        <Checkbox label="I agree to school policies and rules" checked={form.declSchoolPolicies} onChange={(e) => update('declSchoolPolicies', e.target.checked)} />
        <Checkbox label="School may use student photographs for academic activities" checked={form.declPhotoConsent} onChange={(e) => update('declPhotoConsent', e.target.checked)} />
        <Checkbox label="Emergency medical treatment consent" checked={form.declMedicalConsent} onChange={(e) => update('declMedicalConsent', e.target.checked)} />
      </div>
      <Grid className="mt-4">
        <Field label="Father Signature (Type full name)"><Input value={form.fatherSignature} onChange={(e) => update('fatherSignature', e.target.value)} /></Field>
        <Field label="Mother Signature"><Input value={form.motherSignature} onChange={(e) => update('motherSignature', e.target.value)} /></Field>
        <Field label="Guardian Signature"><Input value={form.guardianSignature} onChange={(e) => update('guardianSignature', e.target.value)} /></Field>
        <Field label="Date"><Input type="date" value={form.declarationDate} onChange={(e) => update('declarationDate', e.target.value)} /></Field>
        <Field label="Additional Notes" className="md:col-span-2 xl:col-span-3"><Textarea value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} rows={2} /></Field>
      </Grid>
    </Section>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { variant } = useContext(FormLayoutContext)
  const shortTitle = title.replace(/^Section \d+:\s*/, '')

  if (variant === 'public') {
    return (
      <section className="space-y-4">
        <h3 className="border-b border-border/60 pb-2 text-base font-semibold text-foreground">{shortTitle}</h3>
        {children}
      </section>
    )
  }

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  const { variant } = useContext(FormLayoutContext)
  return (
    <div
      className={cn(
        'grid gap-4',
        variant === 'public' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'gap-3 sm:grid-cols-2',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  const { variant } = useContext(FormLayoutContext)
  const displayLabel = label.replace(/\s*\*+\s*$/, '').trim()

  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        className={cn(
          'block font-medium',
          variant === 'public' ? 'text-sm text-foreground' : 'text-xs text-muted-foreground',
        )}
      >
        {displayLabel}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
