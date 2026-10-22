import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'
import { toSafeHtml, slugify } from '@/lib/sanitize-content'

const toTags = (v: unknown): string[] =>
  (Array.isArray(v) ? v : String(v || '').split(',')).map(t => String(t).trim()).filter(Boolean).slice(0, 12)

export async function POST(req: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    if (!data.titleEn?.trim()) return NextResponse.json({ error: 'An English title is required' }, { status: 400 })

    const baseSlug = slugify(data.slug || data.titleEn) || `post-${Date.now()}`
    let slug = baseSlug
    let i = 1
    while (await prisma.blogPost.findUnique({ where: { slug } })) { slug = `${baseSlug}-${++i}` }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        titleEn: data.titleEn.trim(), titleAr: (data.titleAr || '').trim(), titleTr: (data.titleTr || '').trim(),
        excerptEn: data.excerptEn || '', excerptAr: data.excerptAr || '', excerptTr: data.excerptTr || '',
        contentEn: toSafeHtml(data.contentEn || ''), contentAr: toSafeHtml(data.contentAr || ''), contentTr: toSafeHtml(data.contentTr || ''),
        coverImage: data.coverImage || null,
        category: data.category || 'General',
        tags: toTags(data.tags),
        published: !!data.published,
      },
    })
    return NextResponse.json({ success: true, id: post.id, slug: post.slug })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
