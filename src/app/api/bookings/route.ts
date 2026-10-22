import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendMail, ADMIN_NOTIFY_EMAIL } from '@/lib/mailer'
import { bookingConfirmation, adminNewBooking, toMailLocale } from '@/lib/email-templates'
import { allow, clientIp } from '@/lib/rate-limit'

const bookingSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  country: z.string().min(2),
  budget: z.number().optional(),
  majorInterest: z.string().optional(),
  preferredDate: z.string(),
  preferredTime: z.string(),
  meetingType: z.enum(['ZOOM', 'GOOGLE_MEET', 'WHATSAPP', 'IN_PERSON']),
  notes: z.string().optional(),
  locale: z.string().optional(),
})

export async function POST(req: NextRequest) {
  if (!allow(`booking:${clientIp(req)}`, 10, 60 * 60 * 1000)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  try {
    const body = await req.json()
    const { locale, ...data } = bookingSchema.parse(body)
    const booking = await prisma.booking.create({ data: { ...data, preferredDate: new Date(data.preferredDate) } })

    // Emails are best-effort: they never block or fail the booking.
    const l = toMailLocale(locale)
    const confirmation = bookingConfirmation({ locale: l, firstName: data.firstName, date: data.preferredDate, time: data.preferredTime, meetingType: data.meetingType })
    const notice = adminNewBooking({ ...data, preferredDate: data.preferredDate })
    await Promise.allSettled([
      sendMail({ to: data.email, ...confirmation, replyTo: ADMIN_NOTIFY_EMAIL }),
      sendMail({ to: ADMIN_NOTIFY_EMAIL, ...notice, replyTo: data.email }),
    ])
    return NextResponse.json({ success: true, id: booking.id })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}
