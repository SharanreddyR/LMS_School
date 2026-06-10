import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'
import { getMailTransporter, getDefaultFrom } from './email-config.mjs'
import { buildApplicationLinkHtml } from './templates/application-link.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })
dotenv.config({ path: path.join(__dirname, '..', '.env.local'), override: true })

const app = express()
const PORT = Number(process.env.EMAIL_SERVER_PORT || process.env.PORT || 3000)

app.use(cors())
app.use(express.json({ limit: '256kb' }))

app.get('/api/v1/health', (_req, res) => {
  res.json({ ok: true, service: 'edunexus-email' })
})

app.get('/api/v1/admissions/email/status', async (_req, res) => {
  try {
    const { mode } = await getMailTransporter()
    res.json({
      configured: mode === 'smtp',
      mode,
      message:
        mode === 'smtp'
          ? 'SMTP is configured — emails are sent to real inboxes.'
          : 'Using Ethereal test mail — emails are delivered to a test inbox with a preview link.',
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

app.post('/api/v1/admissions/send-application-link', async (req, res) => {
  try {
    const {
      to,
      subject,
      bodyPlain,
      greeting,
      paragraphs = [],
      applyUrl,
      schoolName,
      enquiryNumber,
      studentName,
      gradeApplying,
      academicYear,
      fromName,
      fromEmail,
      replyTo,
    } = req.body ?? {}

    if (!to || !subject || !applyUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, applyUrl',
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(to))) {
      return res.status(400).json({ success: false, error: 'Invalid recipient email address' })
    }

    const { transporter, mode } = await getMailTransporter()

    const from =
      fromEmail && fromName
        ? `"${fromName}" <${fromEmail}>`
        : fromEmail
          ? fromEmail
          : getDefaultFrom()

    const html = buildApplicationLinkHtml({
      greeting: greeting || 'Dear Parent/Guardian,',
      paragraphs: Array.isArray(paragraphs) ? paragraphs : [],
      applyUrl,
      schoolName: schoolName || 'EduNexus',
      enquiryNumber: enquiryNumber || '',
      studentName: studentName || '',
      gradeApplying: gradeApplying || '',
      academicYear: academicYear || '',
    })

    const info = await transporter.sendMail({
      from,
      to,
      replyTo: replyTo || fromEmail || undefined,
      subject,
      text: bodyPlain || `${greeting}\n\n${applyUrl}`,
      html,
    })

    const previewUrl = mode === 'ethereal' ? nodemailer.getTestMessageUrl(info) : undefined

    console.info(`[Email] Sent application link to ${to} (${mode})`)

    res.json({
      success: true,
      sentAt: new Date().toISOString(),
      messageId: info.messageId,
      provider: mode,
      previewUrl: previewUrl || undefined,
    })
  } catch (err) {
    console.error('[Email] Send failed:', err)
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to send email',
    })
  }
})

app.listen(PORT, () => {
  console.info(`[Email server] Listening on http://localhost:${PORT}`)
  console.info('[Email server] POST /api/v1/admissions/send-application-link')
})
