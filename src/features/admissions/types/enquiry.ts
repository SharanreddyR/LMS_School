/** Minimal enquiry — Step 1 of admission (8–10 parent-facing fields) */
export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'follow_up'
  | 'visit_scheduled'
  | 'application_sent'
  | 'converted'
  | 'closed'

export type ParentRelationship = 'father' | 'mother' | 'guardian'

export type LeadSource =
  | 'website'
  | 'google'
  | 'facebook'
  | 'instagram'
  | 'newspaper'
  | 'existing_parent'
  | 'friend_relative'
  | 'other'

export const ENQUIRY_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  google: 'Google Search',
  facebook: 'Facebook',
  instagram: 'Instagram',
  newspaper: 'Newspaper',
  existing_parent: 'Existing Parent',
  friend_relative: 'Friend / Relative',
  other: 'Other',
}

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  follow_up: 'Follow Up',
  visit_scheduled: 'Visit Scheduled',
  application_sent: 'Application Sent',
  converted: 'Converted',
  closed: 'Closed',
}

export const PARENT_RELATIONSHIP_LABELS: Record<ParentRelationship, string> = {
  father: 'Father',
  mother: 'Mother',
  guardian: 'Guardian',
}

export interface EnquiryFormValues {
  studentName: string
  dateOfBirth: string
  gender: string
  gradeApplying: string
  academicYear: string
  parentName: string
  parentRelationship: ParentRelationship
  phone: string
  email: string
  city: string
  state: string
  currentSchool: string
  source: LeadSource
  assignedTo: string
  enquiryStatus?: EnquiryStatus
}

/** Legacy source values from older mock data */
export function migrateLeadSource(source: string): LeadSource {
  const map: Record<string, LeadSource> = {
    referral: 'friend_relative',
    walk_in: 'other',
    social: 'facebook',
    campaign: 'other',
    phone: 'other',
  }
  if (source in ENQUIRY_SOURCE_LABELS) return source as LeadSource
  return map[source] ?? 'other'
}

export function enquiryStatusFromStage(stage: string): EnquiryStatus {
  switch (stage) {
    case 'contacted':
      return 'contacted'
    case 'qualified':
      return 'follow_up'
    case 'interview':
      return 'visit_scheduled'
    case 'application':
      return 'application_sent'
    case 'accepted':
    case 'enrolled':
      return 'converted'
    case 'lost':
      return 'closed'
    default:
      return 'new'
  }
}

/** Map enquiry tracking status to pipeline stage when creating or updating a lead */
export function enquiryStatusToStage(status: EnquiryStatus):
  | 'enquiry'
  | 'contacted'
  | 'qualified'
  | 'application'
  | 'interview'
  | 'accepted'
  | 'lost' {
  switch (status) {
    case 'contacted':
      return 'contacted'
    case 'follow_up':
      return 'qualified'
    case 'visit_scheduled':
      return 'interview'
    case 'application_sent':
      return 'application'
    case 'converted':
      return 'accepted'
    case 'closed':
      return 'lost'
    default:
      return 'enquiry'
  }
}
