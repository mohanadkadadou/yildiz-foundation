import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  country: z.string().min(2),
  budget: z.number().optional(),
  majorInterest: z.string().optional(),
  degreeType: z.enum(['BACHELOR', 'MASTER', 'PHD', 'DIPLOMA']).optional(),
  source: z.enum(['WEBSITE', 'WHATSAPP', 'REFERRAL', 'SOCIAL_MEDIA', 'OTHER']).default('WEBSITE'),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = leadSchema.parse(body)
    const lead = await prisma.lead.create({ data })
    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}
