/** Extract short year code from label e.g. "2026-27" → "2026" */
export function yearCodeFromLabel(label: string): string {
  const match = label.match(/^(\d{4})/)
  return match?.[1] ?? new Date().getFullYear().toString()
}

export function enquiryNumberPrefix(academicYear: string): string {
  return `ENQ-${yearCodeFromLabel(academicYear)}-`
}

export function studentIdPrefix(academicYear: string): string {
  return `STU-${yearCodeFromLabel(academicYear)}-`
}
