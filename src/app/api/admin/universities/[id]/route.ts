import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const university = await prisma.university.update({
      where: { id: params.id },
      data: {
        nameEn: data.nameEn, nameAr: data.nameAr || data.nameEn, nameTr: data.nameTr || data.nameEn,
        city: data.cityEn?.toLowerCase() || '', cityEn: data.cityEn || '', cityAr: data.cityAr || data.cityEn || '', cityTr: data.cityTr || data.cityEn || '',
        type: data.type, ranking: data.ranking ?? null,
        descriptionEn: data.descriptionEn || '', descriptionAr: data.descriptionAr || data.descriptionEn || '', descriptionTr: data.descriptionTr || data.descriptionEn || '',
        website: data.website || null, logoUrl: data.logoUrl || null, coverImageUrl: data.coverImageUrl || null,
        establishedYear: data.establishedYear ?? null, totalStudents: data.totalStudents ?? null, internationalStudents: data.internationalStudents ?? null,
        isFeatured: !!data.isFeatured, isActive: data.isActive ?? true,
      },
    })
    return NextResponse.json({ success: true, id: university.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update university' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.university.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete: students have applications referencing this university. Archive it instead (set inactive).' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 })
  }
}
