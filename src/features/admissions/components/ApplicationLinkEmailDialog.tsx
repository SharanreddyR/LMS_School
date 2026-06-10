import { Copy, Check, ExternalLink, Mail, Send, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { env } from '@/config/env'
import type { ApplicationLinkEmail } from '../lib/application-link-email'
import { openMailtoApplicationLink } from '../services/send-application-link-email'

interface ApplicationLinkEmailDialogProps {
  open: boolean
  email: ApplicationLinkEmail | null
  onClose: () => void
  autoSent?: boolean
  failed?: boolean
  errorMessage?: string
  previewUrl?: string
  provider?: 'smtp' | 'ethereal'
}

export function ApplicationLinkEmailDialog({
  open,
  email,
  onClose,
  autoSent,
  failed,
  errorMessage,
  previewUrl,
  provider,
}: ApplicationLinkEmailDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!open || !email) return null

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(email.applyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        role="dialog"
        aria-modal
        aria-labelledby="app-link-email-title"
      >
        <div className="border-b border-border bg-muted/40 px-5 py-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                failed ? 'bg-red-100 text-red-700' : 'bg-brand-100 text-brand-700',
              )}
            >
              {failed ? <AlertCircle className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="app-link-email-title" className="text-base font-semibold">
                {failed
                  ? 'Email could not be sent'
                  : autoSent
                    ? 'Application link sent to parent'
                    : 'Application link email'}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {failed
                  ? errorMessage || 'Start the email server or check SMTP settings.'
                  : autoSent
                    ? `Email delivered to ${email.to}${provider === 'ethereal' ? ' (test inbox)' : ''}.`
                    : 'Preview of the email sent to the parent/guardian.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {autoSent && !failed && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
              <Send className="h-4 w-4 shrink-0" />
              Email sent successfully
              {provider === 'smtp' ? ' via SMTP' : provider === 'ethereal' ? ' to Ethereal test inbox' : ''}
            </div>
          )}

          {failed && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {errorMessage}
              <p className="mt-2 text-xs">
                Run <strong>npm run dev:all</strong> to start the email API, or use &quot;Open in mail
                app&quot; below as a fallback.
              </p>
            </div>
          )}

          {previewUrl && (
            <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-3 text-sm">
              <p className="font-medium text-indigo-900">Test email preview (Ethereal)</p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-indigo-700 underline"
              >
                View sent email in browser
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <div className="rounded-xl border border-border bg-background shadow-sm">
            <div className="space-y-1 border-b border-border px-4 py-3 text-sm">
              <div className="flex gap-2">
                <span className="w-14 shrink-0 text-muted-foreground">To</span>
                <span className="font-medium">{email.to}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-14 shrink-0 text-muted-foreground">From</span>
                <span>
                  {email.fromName} &lt;{email.fromEmail}&gt;
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-14 shrink-0 text-muted-foreground">Subject</span>
                <span className="font-medium">{email.subject}</span>
              </div>
            </div>

            <div className="space-y-4 px-4 py-5 text-sm leading-relaxed text-foreground">
              <p>{email.greeting}</p>
              {email.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}

              <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
                <p className="mb-3 font-medium text-brand-900">
                  Click the button below to open and complete the admission application:
                </p>
                <a
                  href={email.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700',
                  )}
                >
                  <ExternalLink className="h-4 w-4" />
                  Complete Online Application
                </a>
                <p className="mt-3 break-all font-mono text-xs text-muted-foreground">{email.applyUrl}</p>
              </div>

              <p className="text-muted-foreground">
                Warm regards,
                <br />
                {email.fromName}
                <br />
                {env.appName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-muted/20 px-5 py-4">
          <Button type="button" variant="outline" className="gap-2" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Link copied' : 'Copy link'}
          </Button>
          <Button type="button" variant="outline" className="gap-2" onClick={() => openMailtoApplicationLink(email)}>
            <Mail className="h-4 w-4" />
            Open in mail app
          </Button>
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
