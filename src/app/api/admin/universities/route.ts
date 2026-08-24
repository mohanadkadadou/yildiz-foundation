import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const slug = data.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim()

    const university = await prisma.university.create({
      data: {
        slug,
        nameEn: data.nameEn,
        nameAr: data.nameAr || data.nameEn,
        nameTr: data.nameTr || data.nameEn,
        city: data.cityEn?.toLowerCase() || '',
        cityEn: data.cityEn || '',
        cityAr: data.cityAr || data.cityEn || '',
        cityTr: data.cityTr || data.cityEn || '',
        type: data.type || 'PUBLIC',
        ranking: data.ranking || null,
        descriptionEn: data.descriptionEn || '',
        descriptionAr: data.descriptionAr || data.descriptionEn || '',
        descriptionTr: data.descriptionTr || data.descriptionEn || '',
        website: data.website || null,
        logoUrl: data.logoUrl || null,
        coverImageUrl: data.coverImageUrl || null,
        establishedYear: data.establishedYear || null,
        totalStudents: data.totalStudents || null,
        internationalStudents: data.internationalStudents || null,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
        programs: data.programs?.length > 0 ? {
          create: data.programs.map((p: any) => ({
            slug: `${slug}-${p.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
            nameEn: p.nameEn,
            nameAr: p.nameEn,
            nameTr: p.nameEn,
            degreeType: p.degreeType,
            language: p.language,
            tuitionFeeUSD: Number(p.tuitionFeeUSD) || 0,
            duration: Number(p.duration) || 4,
            category: p.category || 'Engineering',
            descriptionEn: p.nameEn + ' program',
            descriptionAr: p.nameEn + ' program',
            descriptionTr: p.nameEn + ' program',
            careerOppsEn: 'Various career opportunities',
            careerOppsAr: 'فرص مهنية متنوعة',
            careerOppsTr: 'Çeşitli kariyer fırsatları',
          }))
        } : undefined,
      }
    })
    return NextResponse.json({ success: true, id: university.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create university' }, { status: 500 })
  }
}
