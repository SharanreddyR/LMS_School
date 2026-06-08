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

export type LeadSource = 'website' | 'referral' | 'walk_in' | 'social' | 'campaign' | 'phone'

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

export interface AdmissionLead {
  id: string
  studentName: string
  parentName: string
  email: string
  phone: string
  gradeApplying: string
  academicYear: string
  source: LeadSource
  stage: PipelineStage
  applicationType: ApplicationType | null
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
  source: LeadSource | 'all'
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
  { id: 'qualified', label: 'Qualified', color: 'bg-indigo-500' },
  { id: 'application', label: 'Application', color: 'bg-amber-500' },
  { id: 'interview', label: 'Interview', color: 'bg-purple-500' },
  { id: 'accepted', label: 'Accepted', color: 'bg-emerald-500' },
  { id: 'enrolled', label: 'Enrolled', color: 'bg-green-600' },
  { id: 'lost', label: 'Lost', color: 'bg-slate-400' },
]

export const STAGE_LABELS: Record<PipelineStage, string> = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.id, s.label]),
) as Record<PipelineStage, string>

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  referral: 'Referral',
  walk_in: 'Walk-in',
  social: 'Social Media',
  campaign: 'Campaign',
  phone: 'Phone Inquiry',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}
