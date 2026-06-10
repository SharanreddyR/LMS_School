import { create } from 'zustand'
import { MOCK_FOLLOW_UPS, MOCK_LEADS } from '../data/mock-data'
import type { AdmissionLead, FollowUp, Note, PipelineStage } from '../types'
import type { ApplicationFormData, FeePaymentMode } from '../types/application'
import { getDefaultFeeForGrade, finalizeApplicationForm } from '../types/application'

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
      paidAmount: lead.stage === 'accepted' ? 0 : 0,
      status: 'pending',
    }
  }

  if (lead.stage === 'accepted' && fee && fee.paidAmount === 0 && !lead.fee) {
    fee = { ...fee, status: 'pending' }
  }

  return { ...lead, applicationStatus, fee }
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

interface AdmissionsState {
  leads: AdmissionLead[]
  followUps: FollowUp[]
  initialized: boolean
  init: () => void
  updateLeadStage: (leadId: string, stage: PipelineStage) => void
  addNote: (leadId: string, content: string) => void
  toggleFollowUp: (followUpId: string) => void
  submitApplication: (leadId: string, form: ApplicationFormData) => void
  recordFeePayment: (leadId: string, amount: number, mode: FeePaymentMode) => void
  convertToStudent: (leadId: string) => string | null
}

export const useAdmissionsStore = create<AdmissionsState>((set, get) => ({
  leads: [],
  followUps: [],
  initialized: false,

  init: () => {
    if (get().initialized) return
    set({
      leads: MOCK_LEADS.map(normalizeLead),
      followUps: MOCK_FOLLOW_UPS,
      initialized: true,
    })
  },

  updateLeadStage: (leadId, stage) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage,
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
    const submittedForm: ApplicationFormData = finalizeApplicationForm({
      ...form,
      submittedAt: nowIso(),
      parentName: form.fatherName || form.parentName,
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

        return {
          ...l,
          stage: l.stage === 'application' ? 'accepted' : l.stage,
          applicationStatus: 'approved',
          fee: {
            ...l.fee,
            paidAmount: Math.min(paidAmount, l.fee.totalAmount),
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

  convertToStudent: (leadId) => {
    const lead = get().leads.find((l) => l.id === leadId)
    if (!lead) return null
    if (!lead.fee || (lead.fee.status !== 'paid' && lead.fee.status !== 'partial')) return null
    const status = lead.applicationStatus ?? 'not_started'
    if (status !== 'submitted' && status !== 'approved') return null

    const studentId = `STU-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage: 'enrolled',
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
