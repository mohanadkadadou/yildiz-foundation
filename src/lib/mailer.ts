import nodemailer, { type Transporter } from 'nodemailer'

export const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'yildiz2020t@gmail.com'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yildizeducation.com'

let transporter: Transporter | null | undefined

function getTransporter() {
  if (transporter !== undefined) return transporter
  const host = process.env.SMTP_HOST
  if (!host || !process.env.SMTP_USER || !process.env.SMTP_PASS) { transporter = null; return null }
  const port = Number(process.env.SMTP_PORT || 465)
  transporter = nodemailer.createTransport({
    host, port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return transporter
}

export const emailConfigured = () => !!getTransporter()

/** Sends an email. Never throws — a mail problem must not break a booking or an application. */
export async function sendMail(opts: { to: string; subject: string; html: string; text?: string; replyTo?: string }): Promise<boolean> {
  const t = getTransporter()
  if (!t) {
    console.warn(`[mail] SMTP not configured — skipped "${opts.subject}"`)
    return false
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || `Yildiz Foundation <${process.env.SMTP_USER}>`,
      to: opts.to, subject: opts.subject, html: opts.html, text: opts.text, replyTo: opts.replyTo,
    })
    return true
  } catch (error) {
    console.error('[mail] send failed:', (error as Error).message)
    return false
  }
}
