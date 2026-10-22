import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionUser, isEditable, removeStoredFiles, REQUIRED_DOC_RULE } from '@/lib/applications'
import { sendMail, ADMIN_NOTIFY_EMAIL } from '@/lib/mailer'
import { applicationReceived, adminNewApplication, toMailLocale } from '@/lib/email-templates'

const patchSchema = z.object({
  intake: z.string().max(60).optional(),
  notes: z.string().max(3000).optional(),
  phone: z.string().trim().max(30).optional(),
  country: z.string().trim().max(60).optional(),
  action: z.literal('submit').optional(),
})

async function loadOwned(id: string, userId: string) {
  return prisma.application.findFirst({
    where: { id, userId },
    include: {
      university: { select: { slug: true, nameEn: true, nameAr: true, nameTr: true } },
      program: { select: { nameEn: true, nameAr: true, nameTr: true } },
      files: { orderBy: { createdAt: 'asc' } },
      events: { orderBy: { createdAt: 'asc' } },
    },
  })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const app = await loadOwned(id, user.id)
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { adminNotes, ...safe } = app
  return NextResponse.json({ application: safe })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const app = await loadOwned(id, user.id)
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!isEditable(app.status)) return NextResponse.json({ error: 'locked' }, { status: 409 })

  let data
  try { data = patchSchema.parse(await req.json()) } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }) }

  if (data.phone !== undefined || data.country !== undefined) {
    await prisma.user.update({ where: { id: user.id }, data: { ...(data.phone !== undefined ? { phone: data.phone || null } : {}), ...(data.country !== undefined ? { country: data.country || null } : {}) } })
  }

  if (data.action === 'submit') {
    if (app.status !== 'DRAFT') return NextResponse.json({ error: 'already_submitted' }, { status: 409 })
    const profile = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true, email: true, phone: true, country: true } })
    if (!profile?.phone || !profile?.country) return NextResponse.json({ error: 'profile_incomplete' }, { status: 422 })
    if (!REQUIRED_DOC_RULE(app.files.map(f => f.type))) return NextResponse.json({ error: 'documents_missing' }, { status: 422 })

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: 'SUBMITTED', submittedAt: new Date(),
        ...(data.intake !== undefined ? { intake: data.intake || null } : {}), ...(data.notes !== undefined ? { notes: data.notes || null } : {}),
        events: { create: { status: 'SUBMITTED' } },
      },
    })
    const l = toMailLocale(app.locale)
    const uniName = l === 'ar' ? app.university.nameAr : l === 'tr' ? app.university.nameTr : app.university.nameEn
    const progName = app.program ? (l === 'ar' ? app.program.nameAr : l === 'tr' ? app.program.nameTr : app.program.nameEn) : null
    Promise.allSettled([
      sendMail({ to: profile.email || user.email, ...applicationReceived({ locale: l, name: profile.name || '', university: uniName || app.university.nameEn, program: progName, id }), replyTo: ADMIN_NOTIFY_EMAIL }),
      sendMail({ to: ADMIN_NOTIFY_EMAIL, ...adminNewApplication({ studentName: profile.name || profile.email || '', email: profile.email || '', university: app.university.nameEn, program: app.program?.nameEn, id, docs: app.files.length }), replyTo: profile.email || undefined }),
    ])
    return NextResponse.json({ success: true, status: updated.status })
  }

  await prisma.application.update({
    where: { id },
    data: { ...(data.intake !== undefined ? { intake: data.intake || null } : {}), ...(data.notes !== undefined ? { notes: data.notes || null } : {}) },
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const app = await loadOwned(id, user.id)
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (app.status !== 'DRAFT') return NextResponse.json({ error: 'Only drafts can be deleted' }, { status: 409 })
  await prisma.application.delete({ where: { id } })
  await removeStoredFiles(app.files.map(f => f.storedName))
  return NextResponse.json({ success: true })
}
