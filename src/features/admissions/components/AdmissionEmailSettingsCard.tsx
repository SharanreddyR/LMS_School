import { useEffect, useState } from 'react'
import { Mail, Save, Server, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmissionSetup } from '../hooks/useAdmissionSetup'
import { fetchEmailServerStatus, type EmailServerStatus } from '../services/send-application-link-email'

export function AdmissionEmailSettingsCard() {
  const { emailSettings, updateEmailSettings } = useAdmissionSetup()
  const [draft, setDraft] = useState(emailSettings)
  const [saved, setSaved] = useState(false)
  const [serverStatus, setServerStatus] = useState<EmailServerStatus | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setDraft(emailSettings)
  }, [emailSettings])

  useEffect(() => {
    let cancelled = false
    setChecking(true)
    fetchEmailServerStatus()
      .then((status) => {
        if (!cancelled) setServerStatus(status)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = () => {
    updateEmailSettings(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-5 w-5 text-brand-600" />
          Application Link Email
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          When an enquiry is saved, the system sends a real email to the parent with the online
          application link. Customize the sender and intro message below.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
          <Server className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            {checking ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking email server…
              </p>
            ) : serverStatus ? (
              <>
                <p className="font-medium text-foreground">
                  Email server: {serverStatus.mode === 'smtp' ? 'SMTP (live)' : 'Ethereal (test)'}
                </p>
                <p className="mt-1 text-muted-foreground">{serverStatus.message}</p>
              </>
            ) : (
              <p className="text-amber-800">
                Email server offline — run <code className="rounded bg-muted px-1">npm run dev:all</code>{' '}
                and configure SMTP in <code className="rounded bg-muted px-1">.env.local</code> for
                real delivery.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Sender name</label>
            <Input
              value={draft.senderName}
              onChange={(e) => setDraft((d) => ({ ...d, senderName: e.target.value }))}
              placeholder="Admissions Team"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Sender / reply-to email</label>
            <Input
              type="email"
              value={draft.senderEmail}
              onChange={(e) => setDraft((d) => ({ ...d, senderEmail: e.target.value }))}
              placeholder="admissions@school.edu"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email intro message</label>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            value={draft.emailIntro}
            onChange={(e) => setDraft((d) => ({ ...d, emailIntro: e.target.value }))}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Placeholders: {'{studentName}'}, {'{parentName}'}, {'{schoolName}'}, {'{academicYear}'},{' '}
            {'{gradeApplying}'}, {'{enquiryNumber}'}
          </p>
        </div>

        <Button type="button" className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {saved ? 'Saved' : 'Save email settings'}
        </Button>
      </CardContent>
    </Card>
  )
}
