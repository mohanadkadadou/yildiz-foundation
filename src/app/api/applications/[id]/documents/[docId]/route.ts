import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser, isEditable, removeStoredFiles } from '@/lib/applications'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; docId: string }> }) {
  const { id, docId } = await params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const doc = await prisma.applicationDocument.findFirst({ where: { id: docId, applicationId: id, application: { userId: user.id } }, include: { application: { select: { status: true } } } })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!isEditable(doc.application.status) || doc.application.status === 'UNDER_REVIEW') return NextResponse.json({ error: 'locked' }, { status: 409 })
  await prisma.applicationDocument.delete({ where: { id: docId } })
  await removeStoredFiles([doc.storedName])
  return NextResponse.json({ success: true })
}
