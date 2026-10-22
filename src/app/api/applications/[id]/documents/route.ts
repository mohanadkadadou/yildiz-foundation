import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { getSessionUser, isEditable } from '@/lib/applications'
import { PRIVATE_DIR, MAX_DOC_BYTES, MAX_DOCS_PER_APPLICATION, detectDocument, safeFileName } from '@/lib/private-files'
import { allow } from '@/lib/rate-limit'

export const runtime = 'nodejs'
const TYPES = ['PASSPORT', 'CERTIFICATE', 'TRANSCRIPT', 'PHOTO', 'LANGUAGE', 'OTHER'] as const

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!allow(`doc:${user.id}`, 60, 60 * 60 * 1000)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })

  const app = await prisma.application.findFirst({ where: { id, userId: user.id }, include: { _count: { select: { files: true } } } })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!isEditable(app.status)) return NextResponse.json({ error: 'locked' }, { status: 409 })
  if (app._count.files >= MAX_DOCS_PER_APPLICATION) return NextResponse.json({ error: 'too_many' }, { status: 409 })

  const form = await req.formData()
  const file = form.get('file')
  const type = String(form.get('type') || 'OTHER')
  if (!(file instanceof File) || !TYPES.includes(type as any)) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  if (file.size > MAX_DOC_BYTES) return NextResponse.json({ error: 'too_large' }, { status: 413 })

  const buf = Buffer.from(await file.arrayBuffer())
  const kind = detectDocument(buf)
  if (!kind) return NextResponse.json({ error: 'bad_type' }, { status: 400 })

  const storedName = `${crypto.randomBytes(16).toString('hex')}.${kind.ext}`
  await mkdir(PRIVATE_DIR, { recursive: true, mode: 0o700 })
  await writeFile(path.join(PRIVATE_DIR, storedName), buf, { mode: 0o600 })
  const doc = await prisma.applicationDocument.create({
    data: { applicationId: id, type: type as any, fileName: safeFileName(file.name), storedName, mimeType: kind.mime, size: buf.length },
  })
  return NextResponse.json({ document: { id: doc.id, type: doc.type, fileName: doc.fileName, mimeType: doc.mimeType, size: doc.size, createdAt: doc.createdAt } })
}
