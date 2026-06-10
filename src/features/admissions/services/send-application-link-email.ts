import axios from 'axios'
import { apiGet, apiPost } from '@/lib/api/client'
import type { ApplicationLinkEmail } from '../lib/application-link-email'

export interface SendApplicationLinkResponse {
  success: boolean
  sentAt?: string
  messageId?: string
  provider?: 'smtp' | 'ethereal'
  previewUrl?: string
  error?: string
}

export interface EmailServerStatus {
  configured: boolean
  mode: 'smtp' | 'ethereal'
  message: string
}

export async function fetchEmailServerStatus(): Promise<EmailServerStatus | null> {
  try {
    return await apiGet<EmailServerStatus>('/admissions/email/status')
  } catch {
    return null
  }
}

/** Sends the application-link email via the email API server. */
export async function dispatchApplicationLinkEmail(
  email: ApplicationLinkEmail,
): Promise<SendApplicationLinkResponse> {
  try {
    const response = await apiPost<SendApplicationLinkResponse>(
      '/admissions/send-application-link',
      {
        to: email.to,
        subject: email.subject,
        bodyPlain: email.bodyPlain,
        greeting: email.greeting,
        paragraphs: email.paragraphs,
        applyUrl: email.applyUrl,
        schoolName: email.schoolName,
        enquiryNumber: email.enquiryNumber,
        studentName: email.studentName,
        gradeApplying: email.gradeApplying,
        academicYear: email.academicYear,
        fromName: email.fromName,
        fromEmail: email.fromEmail,
        replyTo: email.replyTo,
      },
    )

    if (!response.success) {
      throw new Error(response.error || 'Email could not be sent')
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { error?: string; message?: string } | undefined
      throw new Error(data?.error || data?.message || error.message || 'Email server unavailable')
    }
    throw error
  }
}

/** Opens the user's default mail client as a fallback when the API is unavailable. */
export function openMailtoApplicationLink(email: ApplicationLinkEmail): void {
  const mailto = `mailto:${encodeURIComponent(email.to)}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.bodyPlain)}`
  window.open(mailto, '_blank')
}
