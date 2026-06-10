import { useAdmissionSetupStore } from '../stores/admission-setup.store'

/** Whether public online external applications are open for the given academic year label */
export function isOnlineAdmissionOpenForYear(yearLabel: string): boolean {
  const { academicYears } = useAdmissionSetupStore.getState()
  if (!academicYears.length) return true

  const year =
    academicYears.find((y) => y.label === yearLabel) ??
    academicYears.find((y) => y.isCurrent) ??
    academicYears[0]

  if (!year || year.status !== 'active') return false
  return Boolean(year.features.onlineAdmissionForm && year.features.externalApplication)
}
