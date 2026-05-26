import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { UniversitiesClient } from './UniversitiesClient'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Turkish Universities | Browse & Compare',
  description: 'Browse 200+ Turkish universities. Filter by city, major, tuition fee, and more.',
}

export default async function UniversitiesPage() {
  const universities = await prisma.university.findMany({
    where: { isActive: true },
    include: { programs: { select: { tuitionFeeUSD: true, degreeType: true } }, _count: { select: { programs: true } } },
    orderBy: { ranking: 'asc' },
  })
  const cities = [...new Set(universities.map(u => u.cityEn))].filter(Boolean)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <UniversitiesClient universities={universities} cities={cities} />
      <Footer />
    </div>
  )
}
