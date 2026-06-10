export type AcademicYearStatus = 'active' | 'inactive'

export type AdmissionFeatureKey =
  | 'enquiry'
  | 'onlineAdmissionForm'
  | 'assessment'
  | 'exams'
  | 'timetable'
  | 'followUps'
  | 'internalApplication'
  | 'externalApplication'
  | 'conversion'

export type AdmissionFeatures = Record<AdmissionFeatureKey, boolean>

export interface AcademicYear {
  id: string
  label: string
  startDate: string
  endDate: string
  status: AcademicYearStatus
  isCurrent: boolean
  features: AdmissionFeatures
  createdAt: string
  updatedAt: string
}

export interface AcademicYearInput {
  label: string
  startDate: string
  endDate: string
  status: AcademicYearStatus
  isCurrent: boolean
  features: AdmissionFeatures
}

export const ADMISSION_FEATURE_META: Record<
  AdmissionFeatureKey,
  { label: string; description: string; group: 'admissions' | 'academics' }
> = {
  enquiry: {
    label: 'Enquiry',
    description: 'Capture and manage admission enquiries',
    group: 'admissions',
  },
  onlineAdmissionForm: {
    label: 'Online Admission Form',
    description: 'Public-facing online application form',
    group: 'admissions',
  },
  internalApplication: {
    label: 'Internal Applications',
    description: 'In-house student application processing',
    group: 'admissions',
  },
  externalApplication: {
    label: 'External Applications',
    description: 'Transfer and external student applications',
    group: 'admissions',
  },
  followUps: {
    label: 'Follow-ups',
    description: 'Scheduled follow-up tasks for leads',
    group: 'admissions',
  },
  conversion: {
    label: 'Student Conversion',
    description: 'Convert accepted leads to enrolled students',
    group: 'admissions',
  },
  assessment: {
    label: 'Assessment',
    description: 'Admission assessments and evaluations',
    group: 'academics',
  },
  exams: {
    label: 'Exams',
    description: 'Entrance exams and examination scheduling',
    group: 'academics',
  },
  timetable: {
    label: 'Timetable',
    description: 'Class and admission interview timetables',
    group: 'academics',
  },
}

export const DEFAULT_ADMISSION_FEATURES: AdmissionFeatures = {
  enquiry: true,
  onlineAdmissionForm: true,
  assessment: false,
  exams: false,
  timetable: false,
  followUps: true,
  internalApplication: true,
  externalApplication: true,
  conversion: true,
}
