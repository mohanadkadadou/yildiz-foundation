import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/applications'
import { PRIVATE_DIR } from '@/lib/private-files'

export const runtime = 'nodejs'

// Authenticated download: only the owner of the application or an admin can read a document.
export async function GET(req: NextRequest, { params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await prisma.applicationDocument.findUnique({ where: { id: docId }, include: { application: { select: { userId: true } } } })
  if (!doc || (user.role !== 'ADMIN' && doc.application.userId !== user.id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let data: Buffer
  try { data = await readFile(path.join(PRIVATE_DIR, doc.storedName)) } catch { return NextResponse.json({ error: 'File missing' }, { status: 404 }) }

  const download = req.nextUrl.searchParams.get('download') === '1'
  const asciiName = doc.fileName.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '')
  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': doc.mimeType,
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(doc.fileName)}`,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      'Cache-Control': 'private, no-store',
    },
  })
}
