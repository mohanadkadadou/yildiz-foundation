import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    if (!data.universityId || !data.nameEn) {
      return NextResponse.json({ error: 'universityId and nameEn are required' }, { status: 400 })
    }
    const slug = `${data.universityId}-${data.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    const program = await prisma.program.create({
      data: {
        slug,
        nameEn: data.nameEn, nameAr: data.nameAr || data.nameEn, nameTr: data.nameTr || data.nameEn,
        degreeType: data.degreeType || 'BACHELOR', language: data.language || 'ENGLISH',
        tuitionFeeUSD: Number(data.tuitionFeeUSD) || 0, duration: Number(data.duration) || 4,
        category: data.category || 'Engineering',
        descriptionEn: data.descriptionEn || `${data.nameEn} program`,
        descriptionAr: data.descriptionAr || `${data.nameEn} program`,
        descriptionTr: data.descriptionTr || `${data.nameEn} program`,
        careerOppsEn: data.careerOppsEn || 'Various career opportunities',
        careerOppsAr: data.careerOppsAr || 'فرص مهنية متنوعة',
        careerOppsTr: data.careerOppsTr || 'Çeşitli kariyer fırsatları',
        universityId: data.universityId,
      },
    })
    return NextResponse.json({ success: true, program })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 })
  }
}
