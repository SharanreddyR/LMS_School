import nodemailer from 'nodemailer'

let cachedTransporter = null
let cachedMode = null

/** @returns {Promise<{ transporter: import('nodemailer').Transporter, mode: 'smtp' | 'ethereal' }>} */
export async function getMailTransporter() {
  if (cachedTransporter) {
    return { transporter: cachedTransporter, mode: cachedMode }
  }

  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()

  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    })
    cachedMode = 'smtp'
    console.info('[Email] Using SMTP:', host)
    return { transporter: cachedTransporter, mode: cachedMode }
  }

  const testAccount = await nodemailer.createTestAccount()
  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })
  cachedMode = 'ethereal'
  console.info('[Email] No SMTP configured — using Ethereal test inbox')
  console.info('[Email] Ethereal user:', testAccount.user)
  return { transporter: cachedTransporter, mode: cachedMode }
}

export function getDefaultFrom() {
  const from = process.env.SMTP_FROM?.trim()
  if (from) return from
  const user = process.env.SMTP_USER?.trim()
  if (user) return `"Admissions" <${user}>`
  return '"Admissions Team" <admissions@edunexus.local>'
}
