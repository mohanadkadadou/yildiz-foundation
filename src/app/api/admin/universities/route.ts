import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const slug = data.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim()
    
    const university = await prisma.university.create({
      data: {
        slug,
        nameEn: data.nameEn,
        nameAr: data.nameAr || data.nameEn,
        nameTr: data.nameTr || data.nameEn,
        city: data.city || data.cityEn.toLowerCase(),
        cityEn: data.cityEn,
        cityAr: data.cityAr || data.cityEn,
        cityTr: data.cityTr || data.cityEn,
        type: data.type,
        ranking: data.ranking || null,
        descriptionEn: data.descriptionEn || '',
        descriptionAr: data.descriptionAr || data.descriptionEn || '',
        descriptionTr: data.descriptionTr || data.descriptionEn || '',
        website: data.website || null,
        establishedYear: data.establishedYear || null,
        totalStudents: data.totalStudents || null,
        internationalStudents: data.internationalStudents || null,
        isFeatured: data.isFeatured || false,
      }
    })
    return NextResponse.json({ success: true, id: university.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create university' }, { status: 500 })
  }
}
