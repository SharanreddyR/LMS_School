import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdmissionsStore } from '../stores/admissions.store'
import type {
  AdmissionFilters,
  AdmissionLead,
  PipelineStage,
  ViewMode,
} from '../types'

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

interface UseAdmissionsOptions {
  initialStageFilter?: PipelineStage | 'all'
  initialApplicationType?: AdmissionFilters['applicationType']
  initialViewMode?: ViewMode
}

export function useAdmissions(options: UseAdmissionsOptions = {}) {
  const { initialStageFilter, initialApplicationType, initialViewMode = 'table' } = options
  const store = useAdmissionsStore()
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

  const leads = store.leads
  const followUps = store.followUps

  const filteredLeads = useMemo(
    () => leads.filter((l) => matchesFilters(l, filters)),
    [leads, filters],
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

  const updateLeadStage = useCallback(
    (leadId: string, stage: PipelineStage) => {
      store.updateLeadStage(leadId, stage)
      setSelectedLead((prev) => {
        if (!prev || prev.id !== leadId) return prev
        const updated = useAdmissionsStore.getState().leads.find((l) => l.id === leadId)
        return updated ?? prev
      })
    },
    [store],
  )

  const addNote = useCallback(
    (leadId: string, content: string) => {
      store.addNote(leadId, content)
      setSelectedLead((prev) => {
        if (!prev || prev.id !== leadId) return prev
        const updated = useAdmissionsStore.getState().leads.find((l) => l.id === leadId)
        return updated ?? prev
      })
    },
    [store],
  )

  const selectLead = useCallback((lead: AdmissionLead | null) => {
    setSelectedLead(lead)
  }, [])

  return {
    leads,
    followUps,
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
    toggleFollowUp: store.toggleFollowUp,
    convertToStudent: store.convertToStudent,
  }
}
