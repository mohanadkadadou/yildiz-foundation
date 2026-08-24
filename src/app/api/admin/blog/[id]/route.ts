import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const updates: any = {}
    for (const key of ['titleEn', 'titleAr', 'titleTr', 'excerptEn', 'excerptAr', 'excerptTr', 'contentEn', 'contentAr', 'contentTr', 'coverImage', 'category']) {
      if (typeof data[key] === 'string') updates[key] = data[key]
    }
    if (data.tags !== undefined) updates.tags = Array.isArray(data.tags) ? data.tags : String(data.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean)
    if (typeof data.published === 'boolean') updates.published = data.published

    const post = await prisma.blogPost.update({ where: { id: params.id }, data: updates })
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
