import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { removeStoredFiles } from '@/lib/applications'
import { sendMail, ADMIN_NOTIFY_EMAIL } from '@/lib/mailer'
import { applicationStatus, toMailLocale } from '@/lib/email-templates'

const schema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED']).optional(),
  adminMessage: z.string().max(3000).optional(),
  adminNotes: z.string().max(5000).optional(),
  notify: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await requireAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let data
  try { data = schema.parse(await req.json()) } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }) }

  const app = await prisma.application.findUnique({ where: { id }, include: { user: { select: { name: true, email: true } }, university: { select: { nameEn: true, nameAr: true, nameTr: true } } } })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const statusChanged = data.status !== undefined && data.status !== app.status
  const messageChanged = data.adminMessage !== undefined && data.adminMessage !== (app.adminMessage || '')
  await prisma.application.update({
    where: { id },
    data: {
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.adminMessage !== undefined ? { adminMessage: data.adminMessage || null } : {}),
      ...(data.adminNotes !== undefined ? { adminNotes: data.adminNotes || null } : {}),
      ...(statusChanged ? { events: { create: { status: data.status!, note: data.adminMessage || null } } } : {}),
    },
  })

  let emailed = false
  if ((statusChanged || messageChanged) && data.notify !== false && app.user.email) {
    const l = toMailLocale(app.locale)
    const uni = l === 'ar' ? app.university.nameAr : l === 'tr' ? app.university.nameTr : app.university.nameEn
    emailed = await sendMail({
      to: app.user.email,
      ...applicationStatus({ locale: l, name: app.user.name || '', university: uni || app.university.nameEn, status: data.status || app.status, message: data.adminMessage ?? app.adminMessage, id }),
      replyTo: ADMIN_NOTIFY_EMAIL,
    })
  }
  return NextResponse.json({ success: true, emailed })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await requireAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const app = await prisma.application.findUnique({ where: { id }, include: { files: true } })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.application.delete({ where: { id } })
  await removeStoredFiles(app.files.map(f => f.storedName))
  return NextResponse.json({ success: true })
}
