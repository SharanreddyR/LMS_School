import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_ACADEMIC_YEARS } from '../data/setup-mock-data'
import type { AcademicYear, AcademicYearInput, AdmissionFeatureKey } from '../types/setup'

interface AdmissionSetupState {
  academicYears: AcademicYear[]
  selectedYearId: string | null
  initialized: boolean
  init: () => void
  setSelectedYearId: (id: string) => void
  addAcademicYear: (input: AcademicYearInput) => AcademicYear
  updateAcademicYear: (id: string, input: Partial<AcademicYearInput>) => void
  deleteAcademicYear: (id: string) => void
  toggleYearStatus: (id: string) => void
  setCurrentYear: (id: string) => void
  toggleFeature: (yearId: string, feature: AdmissionFeatureKey) => void
}

function nowIso() {
  return new Date().toISOString()
}

function createYear(input: AcademicYearInput): AcademicYear {
  const timestamp = nowIso()
  return {
    id: `ay-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export const useAdmissionSetupStore = create<AdmissionSetupState>()(
  persist(
    (set, get) => ({
      academicYears: [],
      selectedYearId: null,
      initialized: false,

      init: () => {
        if (get().initialized) return
        const current = MOCK_ACADEMIC_YEARS.find((y) => y.isCurrent) ?? MOCK_ACADEMIC_YEARS[0]
        set({
          academicYears: MOCK_ACADEMIC_YEARS,
          selectedYearId: current?.id ?? null,
          initialized: true,
        })
      },

      setSelectedYearId: (id) => set({ selectedYearId: id }),

      addAcademicYear: (input) => {
        const year = createYear(input)
        set((state) => {
          const academicYears = input.isCurrent
            ? state.academicYears.map((y) => ({ ...y, isCurrent: false }))
            : state.academicYears
          return {
            academicYears: [year, ...academicYears],
            selectedYearId: input.isCurrent ? year.id : state.selectedYearId,
          }
        })
        return year
      },

      updateAcademicYear: (id, input) => {
        set((state) => {
          let academicYears = state.academicYears.map((year) =>
            year.id === id ? { ...year, ...input, updatedAt: nowIso() } : year,
          )
          if (input.isCurrent) {
            academicYears = academicYears.map((year) => ({
              ...year,
              isCurrent: year.id === id,
            }))
          }
          return { academicYears }
        })
      },

      deleteAcademicYear: (id) => {
        set((state) => {
          const remaining = state.academicYears.filter((y) => y.id !== id)
          const fallback = remaining.find((y) => y.isCurrent) ?? remaining[0] ?? null
          return {
            academicYears: remaining,
            selectedYearId: state.selectedYearId === id ? fallback?.id ?? null : state.selectedYearId,
          }
        })
      },

      toggleYearStatus: (id) => {
        set((state) => ({
          academicYears: state.academicYears.map((year) =>
            year.id === id
              ? {
                  ...year,
                  status: year.status === 'active' ? 'inactive' : 'active',
                  updatedAt: nowIso(),
                }
              : year,
          ),
        }))
      },

      setCurrentYear: (id) => {
        set((state) => ({
          academicYears: state.academicYears.map((year) => ({
            ...year,
            isCurrent: year.id === id,
            updatedAt: year.id === id ? nowIso() : year.updatedAt,
          })),
          selectedYearId: id,
        }))
      },

      toggleFeature: (yearId, feature) => {
        set((state) => ({
          academicYears: state.academicYears.map((year) =>
            year.id === yearId
              ? {
                  ...year,
                  features: { ...year.features, [feature]: !year.features[feature] },
                  updatedAt: nowIso(),
                }
              : year,
          ),
        }))
      },
    }),
    { name: 'edunexus-admission-setup' },
  ),
)
