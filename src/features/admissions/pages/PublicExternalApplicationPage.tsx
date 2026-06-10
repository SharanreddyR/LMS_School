import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Globe, GraduationCap, FileText, ShieldCheck, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApplicationFormFields } from '../components/ApplicationFormFields'
import { useAdmissionsStore } from '../stores/admissions.store'
import { useAdmissionSetupStore } from '../stores/admission-setup.store'
import { isOnlineAdmissionOpenForYear } from '../lib/online-admission'
import { env } from '@/config/env'
import {
  areDeclarationsComplete,
  createApplicationFormFromLead,
  createEmptyExternalApplicationForm,
  type ApplicationFormData,
} from '../types/application'

export function PublicExternalApplicationPage() {
  const [searchParams] = useSearchParams()
  const refLeadId = searchParams.get('ref') ?? undefined
  const yearParam = searchParams.get('year') ?? '2026-27'

  const init = useAdmissionsStore((s) => s.init)
  const getLeadById = useAdmissionsStore((s) => s.getLeadById)
  const submitPublicExternalApplication = useAdmissionsStore((s) => s.submitPublicExternalApplication)
  const academicYears = useAdmissionSetupStore((s) => s.academicYears)

  const [form, setForm] = useState<ApplicationFormData>(() =>
    createEmptyExternalApplicationForm(yearParam),
  )
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
    useAdmissionSetupStore.getState().init()
    setLoading(false)
  }, [init])

  useEffect(() => {
    if (!refLeadId) {
      setForm(createEmptyExternalApplicationForm(yearParam))
      return
    }

    const lead = getLeadById(refLeadId)
    if (lead) {
      setForm({
        ...createApplicationFormFromLead(lead),
        applicationType: 'external',
        academicYear: yearParam || lead.academicYear,
      })
    } else {
      setForm(createEmptyExternalApplicationForm(yearParam))
    }
  }, [refLeadId, yearParam, getLeadById])

  const refLead = useMemo(
    () => (refLeadId ? getLeadById(refLeadId) : undefined),
    [refLeadId, getLeadById, loading],
  )

  const update = <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!areDeclarationsComplete(form)) {
      alert('Please accept all required declarations in the last step before submitting.')
      return
    }
    const leadId = submitPublicExternalApplication(form, refLeadId)
    setSubmittedId(leadId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onlineOpen = useMemo(
    () => isOnlineAdmissionOpenForYear(yearParam),
    [yearParam, academicYears, loading],
  )

  if (!loading && !onlineOpen) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Lock className="h-8 w-8 text-amber-700" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Online Applications Closed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Online admission for academic year <strong>{yearParam}</strong> is not open at this time.
            Please contact the school admissions office for assistance.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">{env.appName}</p>
        </div>
      </div>
    )
  }

  if (submittedId) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-green-900">Application Submitted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your external transfer application has been received by the admissions office.
          </p>
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 font-mono text-sm">
            Reference: <strong>{submittedId}</strong>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Save this reference number. The school will contact you for fee payment and enrollment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl pb-24">
      {/* Hero header */}
      <header className="mb-8 overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 px-6 py-8 text-white shadow-lg sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-100">{env.appName}</p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">External Transfer Application</h1>
              <p className="mt-1 text-sm text-brand-100/90">Academic Year {yearParam}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Secure · No login required
          </div>
        </div>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <InfoChip icon={Globe} title="For transfer students" text="Joining from another school" />
        <InfoChip icon={FileText} title="Multi-step form" text="Complete all 11 sections" />
        <InfoChip icon={CheckCircle2} title="Required fields" text="Marked with a single red asterisk" />
      </div>

      {refLead && (
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
          Linked to enquiry <strong>{refLead.enquiryNumber}</strong> — {refLead.studentName}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ApplicationFormFields
          form={form}
          onChange={update}
          hideApplicationType
          variant="public"
        />

        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card/95 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl justify-end">
            <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto sm:min-w-[200px]">
              <FileText className="h-4 w-4" />
              Submit Application
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function InfoChip({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Globe
  title: string
  text: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
