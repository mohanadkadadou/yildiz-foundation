import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/applications'
import { toMailLocale } from '@/lib/email-templates'

const createSchema = z.object({
  universitySlug: z.string().min(1),
  programId: z.string().optional().nullable(),
  intake: z.string().max(60).optional(),
  locale: z.string().optional(),
})

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    include: { university: { select: { slug: true, nameEn: true, nameAr: true, nameTr: true } }, program: { select: { nameEn: true, nameAr: true, nameTr: true } }, _count: { select: { files: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ applications })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let data
  try { data = createSchema.parse(await req.json()) } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }) }

  const university = await prisma.university.findUnique({ where: { slug: data.universitySlug }, select: { id: true } })
  if (!university) return NextResponse.json({ error: 'University not found' }, { status: 404 })
  let programId: string | null = null
  if (data.programId) {
    const program = await prisma.program.findFirst({ where: { id: data.programId, universityId: university.id }, select: { id: true } })
    if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    programId = program.id
  }

  // one open application per university + program
  const open = await prisma.application.findFirst({
    where: { userId: user.id, universityId: university.id, programId, status: { in: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'WAITLISTED'] } },
  })
  if (open) return NextResponse.json({ id: open.id, existing: true })

  const app = await prisma.application.create({
    data: {
      userId: user.id, universityId: university.id, programId, intake: data.intake || null, locale: toMailLocale(data.locale),
      events: { create: { status: 'DRAFT' } },
    },
  })
  return NextResponse.json({ id: app.id })
}
