import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = bookingSchema.parse(body)
    const booking = await prisma.booking.create({ data: { ...data, preferredDate: new Date(data.preferredDate) } })
    return NextResponse.json({ success: true, id: booking.id })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}
