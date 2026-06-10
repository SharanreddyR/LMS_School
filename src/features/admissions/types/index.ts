export type PipelineStage =
  | 'enquiry'
  | 'contacted'
  | 'qualified'
  | 'application'
  | 'interview'
  | 'accepted'
  | 'enrolled'
  | 'lost'

export type ApplicationType = 'internal' | 'external'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type ViewMode = 'table' | 'kanban' | 'timeline'

export interface Note {
  id: string
  content: string
  author: string
  createdAt: string
}

export interface Activity {
  id: string
  type: 'status_change' | 'note' | 'call' | 'email' | 'meeting' | 'document' | 'follow_up'
  description: string
  user: string
  createdAt: string
  metadata?: Record<string, string>
}

export interface FollowUp {
  id: string
  leadId: string
  leadName: string
  title: string
  description?: string
  dueDate: string
  completed: boolean
  assignedTo: string
  priority: Priority
  type: 'call' | 'email' | 'visit' | 'meeting'
}

export type {
  EnquiryStatus,
  ParentRelationship,
  LeadSource,
  EnquiryFormValues,
} from './enquiry'

export {
  ENQUIRY_SOURCE_LABELS,
  ENQUIRY_STATUS_LABELS,
  PARENT_RELATIONSHIP_LABELS,
  migrateLeadSource,
  enquiryStatusFromStage,
} from './enquiry'

import type { ApplicationFormData, ApplicationStatus, FeeRecord } from './application'

export type {
  ApplicationFormData,
  ApplicationStatus,
  FeeRecord,
  FeeStatus,
  FeePaymentMode,
} from './application'

export {
  canFillApplication,
  canRecordFee,
  canConvertToStudent,
  areMandatoryDocumentsComplete,
  areDeclarationsComplete,
  APPLICATION_STATUS_LABELS,
  FEE_STATUS_LABELS,
  APPLICATION_WIZARD_STEPS,
  DEFAULT_ADMISSION_FEE,
  INSTALLMENT_MINIMUM,
  getDefaultFeeForGrade,
  createApplicationFormFromLead,
  createEmptyExternalApplicationForm,
  finalizeApplicationForm,
  buildStudentFullName,
  APPLICATION_FIELD_GROUPS,
  MANDATORY_DOC_KEYS,
} from './application'

export interface AdmissionLead {
  id: string
  enquiryNumber: string
  studentName: string
  dateOfBirth?: string
  gender?: string
  parentName: string
  parentRelationship?: import('./enquiry').ParentRelationship
  email: string
  phone: string
  city?: string
  state?: string
  currentSchool?: string
  gradeApplying: string
  academicYear: string
  source: import('./enquiry').LeadSource
  enquiryStatus: import('./enquiry').EnquiryStatus
  stage: PipelineStage
  applicationType: ApplicationType | null
  applicationStatus?: ApplicationStatus
  applicationForm?: ApplicationFormData
  fee?: FeeRecord
  priority: Priority
  assignedTo: string
  createdAt: string
  updatedAt: string
  nextFollowUp?: string
  interviewDate?: string
  notes: Note[]
  activities: Activity[]
  tags: string[]
  convertedStudentId?: string
}

export interface AdmissionFilters {
  search: string
  stage: PipelineStage | 'all'
  source: import('./enquiry').LeadSource | 'all'
  priority: Priority | 'all'
  applicationType: ApplicationType | 'all' | 'none'
  assignedTo: string | 'all'
  grade: string | 'all'
  dateFrom: string
  dateTo: string
}

export const PIPELINE_STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'enquiry', label: 'Enquiry', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-cyan-500' },
  { id: 'qualified', label: 'Follow-up', color: 'bg-indigo-500' },
  { id: 'application', label: 'Application', color: 'bg-amber-500' },
  { id: 'interview', label: 'Visit', color: 'bg-purple-500' },
  { id: 'accepted', label: 'Fee / Review', color: 'bg-emerald-500' },
  { id: 'enrolled', label: 'Enrolled', color: 'bg-green-600' },
  { id: 'lost', label: 'Closed', color: 'bg-slate-400' },
]

export const STAGE_LABELS: Record<PipelineStage, string> = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.id, s.label]),
) as Record<PipelineStage, string>

/** @deprecated use ENQUIRY_SOURCE_LABELS */
export const SOURCE_LABELS = {
  website: 'Website',
  google: 'Google Search',
  facebook: 'Facebook',
  instagram: 'Instagram',
  newspaper: 'Newspaper',
  existing_parent: 'Existing Parent',
  friend_relative: 'Friend / Relative',
  other: 'Other',
} as const

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}
