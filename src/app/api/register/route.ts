import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { allow, clientIp } from '@/lib/rate-limit'
import { sendMail } from '@/lib/mailer'
import { welcomeEmail, toMailLocale } from '@/lib/email-templates'

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(8).max(100),
  phone: z.string().trim().max(30).optional(),
  country: z.string().trim().max(60).optional(),
  locale: z.string().optional(),
})

export async function POST(req: NextRequest) {
  if (!allow(`register:${clientIp(req)}`, 8, 60 * 60 * 1000)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  let data
  try { data = schema.parse(await req.json()) } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }) }

  const exists = await prisma.user.findUnique({ where: { email: data.email } })
  if (exists) return NextResponse.json({ error: 'exists' }, { status: 409 })

  await prisma.user.create({
    data: { name: data.name, email: data.email, password: await bcrypt.hash(data.password, 12), phone: data.phone || null, country: data.country || null, role: 'STUDENT' },
  })
  sendMail({ to: data.email, ...welcomeEmail({ locale: toMailLocale(data.locale), name: data.name }) })
  return NextResponse.json({ success: true })
}
