import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { UPLOAD_DIR } from '@/lib/uploads'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params
  const name = parts.join('/')
  if (!/^[a-z0-9-]+\.webp$/i.test(name)) return new NextResponse('Not found', { status: 404 })
  try {
    const data = await readFile(path.join(UPLOAD_DIR, name))
    return new NextResponse(new Uint8Array(data), {
      headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
