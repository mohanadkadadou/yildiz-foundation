import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { toSafeHtml, slugify } from '@/lib/sanitize-content'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const updates: any = {}
    for (const key of ['titleEn', 'titleAr', 'titleTr', 'excerptEn', 'excerptAr', 'excerptTr', 'category']) {
      if (typeof data[key] === 'string') updates[key] = data[key]
    }
    for (const key of ['contentEn', 'contentAr', 'contentTr']) {
      if (typeof data[key] === 'string') updates[key] = toSafeHtml(data[key])
    }
    if (typeof data.coverImage === 'string') updates.coverImage = data.coverImage || null
    if (typeof data.slug === 'string' && data.slug.trim()) {
      const slug = slugify(data.slug)
      if (!slug) return NextResponse.json({ error: 'Invalid URL slug' }, { status: 400 })
      const clash = await prisma.blogPost.findUnique({ where: { slug } })
      if (clash && clash.id !== id) return NextResponse.json({ error: 'That URL slug is already used by another post' }, { status: 409 })
      updates.slug = slug
    }
    if (data.tags !== undefined) updates.tags = (Array.isArray(data.tags) ? data.tags : String(data.tags || '').split(',')).map((t: string) => String(t).trim()).filter(Boolean).slice(0, 12)
    if (typeof data.published === 'boolean') updates.published = data.published

    const post = await prisma.blogPost.update({ where: { id: id }, data: updates })
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.blogPost.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
