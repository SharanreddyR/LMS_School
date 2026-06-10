import { create } from 'zustand'
import { ASSIGNEES, MOCK_FOLLOW_UPS, MOCK_LEADS } from '../data/mock-data'
import type { AdmissionLead, FollowUp, Note, PipelineStage, Priority } from '../types'
import type { EnquiryFormValues } from '../types/enquiry'
import { migrateLeadSource, enquiryStatusFromStage, enquiryStatusToStage } from '../types/enquiry'
import { enquiryNumberPrefix, studentIdPrefix } from '../lib/academic-year'
import type { ApplicationFormData, FeePaymentMode } from '../types/application'
import { canFillApplication, getDefaultFeeForGrade, finalizeApplicationForm } from '../types/application'
import { addStudentFromAdmission } from '@/lib/mock-api/student-registry'
import { isOnlineAdmissionOpenForYear } from '../lib/online-admission'
import { composeApplicationLinkEmail, type ApplicationLinkEmail } from '../lib/application-link-email'

const STORAGE_KEY = 'lms_admissions_data'

function loadPersistedData(): { leads: AdmissionLead[]; followUps: FollowUp[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as { leads: AdmissionLead[]; followUps: FollowUp[] }
  } catch {
    return null
  }
}

function persistAdmissionsData(leads: AdmissionLead[], followUps: FollowUp[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ leads, followUps }))
  } catch {
    // ignore quota errors in demo mode
  }
}

function nowIso() {
  return new Date().toISOString()
}

function normalizeLead(lead: AdmissionLead): AdmissionLead {
  const hasApplication = lead.applicationType !== null || ['application', 'interview', 'accepted', 'enrolled'].includes(lead.stage)

  let applicationStatus = lead.applicationStatus
  if (!applicationStatus) {
    if (lead.stage === 'enrolled' || lead.stage === 'accepted') applicationStatus = 'approved'
    else if (hasApplication) applicationStatus = 'submitted'
    else applicationStatus = 'not_started'
  }

  let fee = lead.fee
  if (!fee && hasApplication && lead.stage !== 'enrolled') {
    fee = {
      totalAmount: getDefaultFeeForGrade(lead.gradeApplying),
      paidAmount: 0,
      status: 'pending',
    }
  }

  if (lead.stage === 'accepted' && fee && fee.paidAmount === 0 && !lead.fee) {
    fee = { ...fee, status: 'pending' }
  }

  const enquiryNumber = lead.enquiryNumber ?? lead.id.replace('LD-', 'ENQ-2026-')
  const source = migrateLeadSource(lead.source as string)
  const enquiryStatus = lead.enquiryStatus ?? enquiryStatusFromStage(lead.stage)

  return {
    ...lead,
    enquiryNumber,
    source,
    enquiryStatus,
    applicationStatus,
    fee,
  }
}

function nextEnquiryNumber(academicYear: string, leads: AdmissionLead[]): string {
  const prefix = enquiryNumberPrefix(academicYear)
  const max = leads.reduce((m, l) => {
    if (!l.enquiryNumber?.startsWith(prefix)) return m
    const n = parseInt(l.enquiryNumber.slice(prefix.length), 10)
    return Number.isNaN(n) ? m : Math.max(m, n)
  }, 0)
  return `${prefix}${String(max + 1).padStart(4, '0')}`
}

function appendActivity(
  lead: AdmissionLead,
  type: AdmissionLead['activities'][0]['type'],
  description: string,
): AdmissionLead['activities'] {
  return [
    {
      id: `${lead.id}-act-${Date.now()}`,
      type,
      description,
      user: 'You',
      createdAt: nowIso(),
    },
    ...lead.activities,
  ]
}

interface NewFollowUpInput {
  leadId: string
  title: string
  description?: string
  dueDate: string
  assignedTo: string
  priority: Priority
  type: FollowUp['type']
}

interface SendApplicationLinkResult {
  success: boolean
  email?: ApplicationLinkEmail
  reason?: 'no_email' | 'online_closed' | 'not_found' | 'already_submitted' | 'send_failed'
  error?: string
}

interface AdmissionsState {
  leads: AdmissionLead[]
  followUps: FollowUp[]
  initialized: boolean
  init: () => void
  addEnquiry: (input: EnquiryFormValues) => AdmissionLead
  prepareApplicationLinkEmail: (leadId: string) => SendApplicationLinkResult
  confirmApplicationLinkSent: (leadId: string, recipientEmail: string) => void
  scheduleFollowUp: (input: NewFollowUpInput) => FollowUp
  updateLeadStage: (leadId: string, stage: PipelineStage) => void
  addNote: (leadId: string, content: string) => void
  toggleFollowUp: (followUpId: string) => void
  submitApplication: (leadId: string, form: ApplicationFormData) => void
  submitPublicExternalApplication: (form: ApplicationFormData, refLeadId?: string) => string
  recordFeePayment: (leadId: string, amount: number, mode: FeePaymentMode) => void
  convertToStudent: (leadId: string) => string | null
  getLeadById: (leadId: string) => AdmissionLead | undefined
}

export const useAdmissionsStore = create<AdmissionsState>((set, get) => ({
  leads: [],
  followUps: [],
  initialized: false,

  init: () => {
    if (get().initialized) return
    const saved = loadPersistedData()
    set({
      leads: saved?.leads?.map(normalizeLead) ?? MOCK_LEADS.map(normalizeLead),
      followUps: saved?.followUps ?? MOCK_FOLLOW_UPS,
      initialized: true,
    })
  },

  getLeadById: (leadId) => get().leads.find((l) => l.id === leadId),

  addEnquiry: (input) => {
    const existing = get().leads
    const seq = existing.length + 1
    const id = `LD-${String(seq).padStart(3, '0')}`
    const enquiryNumber = nextEnquiryNumber(input.academicYear, existing)
    const enquiryStatus = input.enquiryStatus ?? 'new'
    const stage = enquiryStatusToStage(enquiryStatus)

    const lead: AdmissionLead = normalizeLead({
      id,
      enquiryNumber,
      studentName: input.studentName,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      parentName: input.parentName,
      parentRelationship: input.parentRelationship,
      email: input.email,
      phone: input.phone,
      city: input.city,
      state: input.state,
      currentSchool: input.currentSchool,
      gradeApplying: input.gradeApplying,
      academicYear: input.academicYear,
      source: input.source,
      enquiryStatus,
      stage,
      applicationType: null,
      priority: 'medium',
      assignedTo: input.assignedTo,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      notes: [],
      activities: [
        {
          id: `${id}-act-0`,
          type: 'status_change',
          description: `Enquiry ${enquiryNumber} submitted`,
          user: 'You',
          createdAt: nowIso(),
        },
      ],
      tags: [],
    })

    set((s) => ({ leads: [lead, ...s.leads] }))
    return lead
  },

  prepareApplicationLinkEmail: (leadId) => {
    const lead = get().leads.find((l) => l.id === leadId)
    if (!lead) return { success: false, reason: 'not_found' }
    if (!lead.email?.trim()) return { success: false, reason: 'no_email' }
    if (!isOnlineAdmissionOpenForYear(lead.academicYear)) {
      return { success: false, reason: 'online_closed' }
    }

    const appStatus = lead.applicationStatus ?? 'not_started'
    if (appStatus === 'submitted' || appStatus === 'approved') {
      return { success: false, reason: 'already_submitted' }
    }

    const email = composeApplicationLinkEmail(lead)
    return { success: true, email }
  },

  confirmApplicationLinkSent: (leadId, recipientEmail) => {
    set((s) => ({
      leads: s.leads.map((l) => {
        if (l.id !== leadId) return l
        const earlyStatus = ['new', 'contacted', 'follow_up', 'visit_scheduled'].includes(l.enquiryStatus)
        return {
          ...l,
          enquiryStatus: earlyStatus ? 'application_sent' : l.enquiryStatus,
          updatedAt: nowIso(),
          activities: appendActivity(
            l,
            'email',
            `Application link emailed to ${recipientEmail}`,
          ),
        }
      }),
    }))
  },

  scheduleFollowUp: (input) => {
    const lead = get().leads.find((l) => l.id === input.leadId)
    const followUp: FollowUp = {
      id: `FU-${Date.now()}`,
      leadId: input.leadId,
      leadName: lead?.studentName ?? 'Unknown',
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      completed: false,
      assignedTo: input.assignedTo,
      priority: input.priority,
      type: input.type,
    }

    set((s) => ({
      followUps: [followUp, ...s.followUps],
      leads: lead
        ? s.leads.map((l) => {
            if (l.id !== input.leadId) return l
            const enquiryStatus =
              l.enquiryStatus === 'new' || l.enquiryStatus === 'contacted'
                ? 'follow_up'
                : l.enquiryStatus
            const stage =
              l.stage === 'enquiry'
                ? 'contacted'
                : l.stage === 'contacted'
                  ? 'qualified'
                  : l.stage
            return {
              ...l,
              enquiryStatus,
              stage,
              nextFollowUp: input.dueDate,
              updatedAt: nowIso(),
              activities: appendActivity(l, 'follow_up', `Follow-up scheduled: ${input.title}`),
            }
          })
        : s.leads,
    }))

    return followUp
  },

  updateLeadStage: (leadId, stage) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage,
              enquiryStatus: enquiryStatusFromStage(stage),
              updatedAt: nowIso(),
              activities: appendActivity(l, 'status_change', `Stage changed to ${stage}`),
            }
          : l,
      ),
    }))
  },

  addNote: (leadId, content) => {
    const note: Note = {
      id: `${leadId}-note-${Date.now()}`,
      content,
      author: 'You',
      createdAt: nowIso(),
    }
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              notes: [note, ...l.notes],
              activities: appendActivity(l, 'note', 'Note added'),
            }
          : l,
      ),
    }))
  },

  toggleFollowUp: (followUpId) => {
    set((s) => ({
      followUps: s.followUps.map((f) =>
        f.id === followUpId ? { ...f, completed: !f.completed } : f,
      ),
    }))
  },

  submitApplication: (leadId, form) => {
    const existingLead = get().leads.find((l) => l.id === leadId)
    const submittedForm: ApplicationFormData = finalizeApplicationForm({
      ...form,
      submittedAt: nowIso(),
      parentName: form.fatherName || form.parentName,
      admissionNumber: form.admissionNumber || existingLead?.enquiryNumber || leadId,
    })
    const totalAmount = getDefaultFeeForGrade(form.gradeApplying)

    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              studentName: form.studentName,
              parentName: submittedForm.fatherName || submittedForm.parentName,
              email: submittedForm.email,
              phone: submittedForm.phone || submittedForm.fatherPhone,
              gradeApplying: form.gradeApplying,
              academicYear: form.academicYear,
              applicationType: form.applicationType,
              applicationStatus: 'submitted',
              enquiryStatus: 'application_sent',
              applicationForm: submittedForm,
              stage: 'application',
              fee: {
                totalAmount,
                paidAmount: 0,
                status: 'pending',
              },
              updatedAt: nowIso(),
              activities: appendActivity(
                l,
                'document',
                `${form.applicationType === 'internal' ? 'Internal' : 'External'} application submitted`,
              ),
            }
          : l,
      ),
    }))
  },

  recordFeePayment: (leadId, amount, mode) => {
    set((s) => ({
      leads: s.leads.map((l) => {
        if (l.id !== leadId || !l.fee) return l

        const paidAmount = l.fee.paidAmount + amount
        const status =
          paidAmount >= l.fee.totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'pending'
        const cappedPaid = Math.min(paidAmount, l.fee.totalAmount)

        return {
          ...l,
          stage: cappedPaid > 0 && l.stage === 'application' ? 'accepted' : l.stage,
          applicationStatus: cappedPaid > 0 ? 'approved' : l.applicationStatus,
          fee: {
            ...l.fee,
            paidAmount: cappedPaid,
            status,
            paymentMode: mode,
            lastPaymentAt: nowIso(),
          },
          updatedAt: nowIso(),
          activities: appendActivity(
            l,
            'document',
            mode === 'full'
              ? `Full fee payment of ₹${amount.toLocaleString()} recorded`
              : `Installment payment of ₹${amount.toLocaleString()} recorded`,
          ),
        }
      }),
    }))
  },

  submitPublicExternalApplication: (form, refLeadId) => {
    if (!isOnlineAdmissionOpenForYear(form.academicYear)) {
      throw new Error('Online admission is closed for this academic year')
    }
    get().init()

    const finalized = finalizeApplicationForm({
      ...form,
      applicationType: 'external',
      parentName: form.fatherName || form.parentName,
    })

    if (refLeadId) {
      const existing = get().leads.find((l) => l.id === refLeadId)
      if (existing && canFillApplication(existing)) {
        get().submitApplication(refLeadId, finalized)
        return refLeadId
      }
    }

    const lead = get().addEnquiry({
      studentName: finalized.studentName,
      dateOfBirth: finalized.dateOfBirth,
      gender: finalized.gender,
      parentName: finalized.fatherName || finalized.parentName,
      parentRelationship: 'father',
      email: finalized.email,
      phone: finalized.phone || finalized.fatherPhone,
      city: finalized.commCity,
      state: finalized.commState,
      currentSchool: finalized.previousSchool,
      gradeApplying: finalized.gradeApplying,
      academicYear: finalized.academicYear,
      source: 'website',
      assignedTo: ASSIGNEES[0],
    })

    get().submitApplication(lead.id, finalized)
    return lead.id
  },

  convertToStudent: (leadId) => {
    const lead = get().leads.find((l) => l.id === leadId)
    if (!lead) return null
    if (!lead.fee || (lead.fee.status !== 'paid' && lead.fee.status !== 'partial')) return null
    const status = lead.applicationStatus ?? 'not_started'
    if (status !== 'submitted' && status !== 'approved') return null

    const studentId = `${studentIdPrefix(lead.academicYear)}${String(Math.floor(Math.random() * 9000) + 1000)}`
    const form = lead.applicationForm

    addStudentFromAdmission({
      id: studentId,
      name: form?.studentName ?? lead.studentName,
      email: form?.email ?? lead.email,
      grade: form?.gradeApplying ?? lead.gradeApplying,
      parentName: form?.fatherName || form?.parentName || lead.parentName,
      phone: form?.phone || form?.fatherPhone || lead.phone,
    })

    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage: 'enrolled',
              enquiryStatus: 'converted',
              convertedStudentId: studentId,
              updatedAt: nowIso(),
              activities: appendActivity(l, 'status_change', `Converted to student ${studentId}`),
            }
          : l,
      ),
    }))
    return studentId
  },
}))

useAdmissionsStore.subscribe((state) => {
  if (state.initialized) {
    persistAdmissionsData(state.leads, state.followUps)
  }
})
