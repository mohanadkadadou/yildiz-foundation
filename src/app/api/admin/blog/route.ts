import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    if (!data.titleEn) return NextResponse.json({ error: 'titleEn is required' }, { status: 400 })

    const baseSlug = data.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    let slug = baseSlug
    let i = 1
    while (await prisma.blogPost.findUnique({ where: { slug } })) { slug = `${baseSlug}-${++i}` }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        titleEn: data.titleEn, titleAr: data.titleAr || data.titleEn, titleTr: data.titleTr || data.titleEn,
        excerptEn: data.excerptEn || '', excerptAr: data.excerptAr || data.excerptEn || '', excerptTr: data.excerptTr || data.excerptEn || '',
        contentEn: data.contentEn || '', contentAr: data.contentAr || data.contentEn || '', contentTr: data.contentTr || data.contentEn || '',
        coverImage: data.coverImage || null,
        category: data.category || 'General',
        tags: Array.isArray(data.tags) ? data.tags : String(data.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
        published: !!data.published,
      },
    })
    return NextResponse.json({ success: true, id: post.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
