import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'
import { requireAdminSession } from '@/lib/admin-auth'
import { UPLOAD_DIR } from '@/lib/uploads'

export const runtime = 'nodejs'
const MAX_BYTES = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image is larger than 10 MB' }, { status: 413 })

    const input = Buffer.from(await file.arrayBuffer())
    let meta
    try { meta = await sharp(input).metadata() } catch { meta = null }
    if (!meta || !['jpeg', 'png', 'webp', 'gif'].includes(meta.format || '')) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP or GIF images are allowed' }, { status: 400 })
    }

    const output = await sharp(input).rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
    await mkdir(UPLOAD_DIR, { recursive: true })
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(5).toString('hex')}.webp`
    await writeFile(path.join(UPLOAD_DIR, name), output)
    return NextResponse.json({ url: `/uploads/${name}` })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
