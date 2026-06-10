import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAdmissionsStore } from '../stores/admissions.store'
import { useAdmissionSetupStore } from '../stores/admission-setup.store'
import { queryKeys } from '@/lib/api/query-keys'
import type {
  AdmissionFilters,
  AdmissionLead,
  PipelineStage,
  ViewMode,
} from '../types'
import type { ApplicationFormData, FeePaymentMode } from '../types/application'
import { dispatchApplicationLinkEmail } from '../services/send-application-link-email'
import type { ApplicationLinkEmail } from '../lib/application-link-email'

export type SendApplicationLinkEmailResult =
  | {
      success: true
      email: ApplicationLinkEmail
      provider?: 'smtp' | 'ethereal'
      previewUrl?: string
    }
  | {
      success: false
      email?: ApplicationLinkEmail
      reason?: 'no_email' | 'online_closed' | 'not_found' | 'already_submitted' | 'send_failed'
      error?: string
    }

const DEFAULT_FILTERS: AdmissionFilters = {
  search: '',
  stage: 'all',
  source: 'all',
  priority: 'all',
  applicationType: 'all',
  assignedTo: 'all',
  grade: 'all',
  dateFrom: '',
  dateTo: '',
}

const PAGE_SIZE = 8

function simulateDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function matchesFilters(lead: AdmissionLead, filters: AdmissionFilters): boolean {
  const q = filters.search.toLowerCase().trim()
  if (q) {
    const haystack = [
      lead.studentName,
      lead.parentName,
      lead.email,
      lead.phone,
      lead.id,
      lead.gradeApplying,
    ]
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(q)) return false
  }

  if (filters.stage !== 'all' && lead.stage !== filters.stage) return false
  if (filters.source !== 'all' && lead.source !== filters.source) return false
  if (filters.priority !== 'all' && lead.priority !== filters.priority) return false
  if (filters.grade !== 'all' && lead.gradeApplying !== filters.grade) return false
  if (filters.assignedTo !== 'all' && lead.assignedTo !== filters.assignedTo) return false

  if (filters.applicationType === 'internal' && lead.applicationType !== 'internal') return false
  if (filters.applicationType === 'external' && lead.applicationType !== 'external') return false
  if (filters.applicationType === 'none' && lead.applicationType !== null) return false

  if (filters.dateFrom && new Date(lead.createdAt) < new Date(filters.dateFrom)) return false
  if (filters.dateTo && new Date(lead.createdAt) > new Date(filters.dateTo + 'T23:59:59')) return false

  return true
}

function resolveCurrentYearLabel(
  academicYears: ReturnType<typeof useAdmissionSetupStore.getState>['academicYears'],
  selectedYearId: string | null,
): string | null {
  if (!academicYears.length) return null
  const year =
    academicYears.find((y) => y.id === selectedYearId) ??
    academicYears.find((y) => y.isCurrent) ??
    academicYears[0]
  return year?.label ?? null
}

interface UseAdmissionsOptions {
  initialStageFilter?: PipelineStage | 'all'
  initialApplicationType?: AdmissionFilters['applicationType']
  initialViewMode?: ViewMode
  /** Hide leads in these pipeline stages (e.g. enrolled + lost on enquiries page) */
  excludeStages?: PipelineStage[]
}

export function useAdmissions(options: UseAdmissionsOptions = {}) {
  const { initialStageFilter, initialApplicationType, initialViewMode = 'table', excludeStages } = options
  const store = useAdmissionsStore()
  const selectedYearId = useAdmissionSetupStore((s) => s.selectedYearId)
  const academicYears = useAdmissionSetupStore((s) => s.academicYears)
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(!store.initialized)
  const [filters, setFilters] = useState<AdmissionFilters>({
    ...DEFAULT_FILTERS,
    stage: initialStageFilter ?? 'all',
    applicationType: initialApplicationType ?? 'all',
  })
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode)
  const [page, setPage] = useState(1)
  const [selectedLead, setSelectedLead] = useState<AdmissionLead | null>(null)

  useEffect(() => {
    useAdmissionSetupStore.getState().init()
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!store.initialized) {
      setLoading(true)
      simulateDelay().then(() => {
        if (!cancelled) {
          store.init()
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
    return () => {
      cancelled = true
    }
  }, [store])

  const currentYearLabel = useMemo(
    () => resolveCurrentYearLabel(academicYears, selectedYearId),
    [academicYears, selectedYearId],
  )

  const allLeads = store.leads
  const allFollowUps = store.followUps

  const yearLeads = useMemo(() => {
    if (!currentYearLabel) return allLeads
    return allLeads.filter((l) => l.academicYear === currentYearLabel)
  }, [allLeads, currentYearLabel])

  const yearFollowUps = useMemo(() => {
    const yearLeadIds = new Set(yearLeads.map((l) => l.id))
    return allFollowUps.filter((f) => yearLeadIds.has(f.leadId))
  }, [allFollowUps, yearLeads])

  const filteredLeads = useMemo(
    () =>
      yearLeads.filter((l) => {
        if (excludeStages?.includes(l.stage)) return false
        return matchesFilters(l, filters)
      }),
    [yearLeads, filters, excludeStages],
  )

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredLeads.slice(start, start + PAGE_SIZE)
  }, [filteredLeads, page])

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE))

  const updateFilters = useCallback((patch: Partial<AdmissionFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      stage: initialStageFilter ?? 'all',
      applicationType: initialApplicationType ?? 'all',
    })
    setPage(1)
  }, [initialStageFilter, initialApplicationType])

  const syncSelectedLead = useCallback((leadId: string) => {
    setSelectedLead((prev) => {
      if (!prev || prev.id !== leadId) return prev
      const updated = useAdmissionsStore.getState().leads.find((l) => l.id === leadId)
      return updated ?? prev
    })
  }, [])

  const updateLeadStage = useCallback(
    (leadId: string, stage: PipelineStage) => {
      store.updateLeadStage(leadId, stage)
      syncSelectedLead(leadId)
    },
    [store, syncSelectedLead],
  )

  const addNote = useCallback(
    (leadId: string, content: string) => {
      store.addNote(leadId, content)
      syncSelectedLead(leadId)
    },
    [store, syncSelectedLead],
  )

  const submitApplication = useCallback(
    (leadId: string, form: ApplicationFormData) => {
      store.submitApplication(leadId, form)
      syncSelectedLead(leadId)
    },
    [store, syncSelectedLead],
  )

  const recordFeePayment = useCallback(
    (leadId: string, amount: number, mode: FeePaymentMode) => {
      store.recordFeePayment(leadId, amount, mode)
      syncSelectedLead(leadId)
    },
    [store, syncSelectedLead],
  )

  const convertToStudent = useCallback(
    (leadId: string) => {
      const studentId = store.convertToStudent(leadId)
      syncSelectedLead(leadId)
      if (studentId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
      }
      return studentId
    },
    [store, syncSelectedLead, queryClient],
  )

  const addEnquiry = useCallback(
    (input: Parameters<typeof store.addEnquiry>[0]) => store.addEnquiry(input),
    [store],
  )

  const scheduleFollowUp = useCallback(
    (input: Parameters<typeof store.scheduleFollowUp>[0]) => store.scheduleFollowUp(input),
    [store],
  )

  const sendApplicationLinkEmail = useCallback(
    async (leadId: string): Promise<SendApplicationLinkEmailResult> => {
      const prepared = store.prepareApplicationLinkEmail(leadId)
      if (!prepared.success || !prepared.email) {
        return {
          success: false,
          reason: prepared.reason,
          email: prepared.email,
        }
      }

      try {
        const result = await dispatchApplicationLinkEmail(prepared.email)
        store.confirmApplicationLinkSent(leadId, prepared.email.to)
        syncSelectedLead(leadId)
        return {
          success: true,
          email: prepared.email,
          provider: result.provider,
          previewUrl: result.previewUrl,
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Email server unavailable. Start it with: npm run dev:all'
        return {
          success: false,
          reason: 'send_failed',
          error: message,
          email: prepared.email,
        }
      }
    },
    [store, syncSelectedLead],
  )

  const selectLead = useCallback((lead: AdmissionLead | null) => {
    setSelectedLead(lead)
  }, [])

  return {
    leads: yearLeads,
    followUps: yearFollowUps,
    currentYearLabel,
    loading,
    filters,
    viewMode,
    page,
    totalPages,
    pageSize: PAGE_SIZE,
    filteredLeads,
    paginatedLeads,
    selectedLead,
    setViewMode,
    setPage,
    setSelectedLead: selectLead,
    updateFilters,
    resetFilters,
    updateLeadStage,
    addNote,
    submitApplication,
    recordFeePayment,
    toggleFollowUp: store.toggleFollowUp,
    convertToStudent,
    addEnquiry,
    scheduleFollowUp,
    sendApplicationLinkEmail,
    leadSheetProps: {
      selectedLead,
      onCloseLead: () => selectLead(null),
      onStageChange: updateLeadStage,
      onAddNote: addNote,
      onSubmitApplication: submitApplication,
      onRecordFeePayment: recordFeePayment,
      onConvertToStudent: convertToStudent,
      onSendApplicationLink: sendApplicationLinkEmail,
    },
  }
}
