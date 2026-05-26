import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const city = searchParams.get('city')
  const type = searchParams.get('type')
  const minFee = searchParams.get('minFee')
  const maxFee = searchParams.get('maxFee')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  const where: any = { isActive: true }
  if (q) where.OR = [{ nameEn: { contains: q, mode: 'insensitive' } }, { city: { contains: q, mode: 'insensitive' } }, { descriptionEn: { contains: q, mode: 'insensitive' } }]
  if (city) where.city = { contains: city, mode: 'insensitive' }
  if (type) where.type = type

  const [universities, total] = await Promise.all([
    prisma.university.findMany({
      where,
      include: { programs: { select: { tuitionFeeUSD: true, degreeType: true, language: true }, take: 5 }, _count: { select: { programs: true } } },
      orderBy: { ranking: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.university.count({ where }),
  ])

  return NextResponse.json({ universities, total, pages: Math.ceil(total / limit), page })
}
