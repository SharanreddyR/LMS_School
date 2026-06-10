import { env } from '@/config/env'
import { getExternalApplicationUrl } from './external-application-url'
import type { AdmissionLead } from '../types'
import { PARENT_RELATIONSHIP_LABELS } from '../types/enquiry'
import { useAdmissionSetupStore } from '../stores/admission-setup.store'
import type { AdmissionEmailSettings } from '../types/setup'

export interface ApplicationLinkEmail {
  to: string
  subject: string
  greeting: string
  paragraphs: string[]
  applyUrl: string
  enquiryNumber: string
  studentName: string
  gradeApplying: string
  academicYear: string
  schoolName: string
  bodyPlain: string
  fromName: string
  fromEmail: string
  replyTo: string
}

function parentSalutation(lead: AdmissionLead): string {
  const name = lead.parentName.trim()
  if (!name) return 'Dear Parent/Guardian,'
  const rel = lead.parentRelationship
  if (rel === 'father') return `Dear Mr./Ms. ${name},`
  if (rel === 'mother') return `Dear Ms. ${name},`
  if (rel === 'guardian') return `Dear ${name},`
  return `Dear ${name},`
}

function applyTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`)
}

function getEmailSettings(): AdmissionEmailSettings {
  return {
    ...useAdmissionSetupStore.getState().emailSettings,
  }
}

/** Builds the application-link email sent to parents after an enquiry is captured. */
export function composeApplicationLinkEmail(lead: AdmissionLead): ApplicationLinkEmail {
  const applyUrl = getExternalApplicationUrl({
    ref: lead.id,
    year: lead.academicYear,
  })

  const settings = getEmailSettings()
  const greeting = parentSalutation(lead)
  const schoolName = env.appName

  const templateVars = {
    studentName: lead.studentName,
    parentName: lead.parentName,
    schoolName,
    academicYear: lead.academicYear,
    gradeApplying: lead.gradeApplying,
    enquiryNumber: lead.enquiryNumber,
  }

  const intro = applyTemplate(settings.emailIntro, templateVars)

  const paragraphs = [
    intro,
    `To proceed with the admission process, please complete the online application form using the secure link below. You can open it on your mobile phone or computer — your enquiry details will be pre-filled so you can finish faster. The form typically takes 15–20 minutes.`,
    `Class applying for: ${lead.gradeApplying}.`,
    `If you have any questions or need help while filling the form, please reply to this email or contact our admissions office. We are happy to assist you.`,
  ]

  const bodyPlain = [
    greeting,
    '',
    ...paragraphs.flatMap((p) => [p, '']),
    'Complete your application here:',
    applyUrl,
    '',
    'Warm regards,',
    settings.senderName,
    schoolName,
  ].join('\n')

  const subject = `Complete ${lead.studentName}'s Admission Application — ${schoolName} (${lead.academicYear})`

  return {
    to: lead.email.trim(),
    subject,
    greeting,
    paragraphs,
    applyUrl,
    enquiryNumber: lead.enquiryNumber,
    studentName: lead.studentName,
    gradeApplying: lead.gradeApplying,
    academicYear: lead.academicYear,
    schoolName,
    bodyPlain,
    fromName: settings.senderName,
    fromEmail: settings.senderEmail,
    replyTo: settings.senderEmail,
  }
}

export function relationshipLabel(lead: AdmissionLead): string {
  if (!lead.parentRelationship) return 'Parent/Guardian'
  return PARENT_RELATIONSHIP_LABELS[lead.parentRelationship]
}
