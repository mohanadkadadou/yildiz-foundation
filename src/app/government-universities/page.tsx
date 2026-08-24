import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { UniversitiesClient } from '../universities/UniversitiesClient'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Government Universities in Turkey',
  description: 'Browse accredited state (government) universities in Turkey — tuition, faculties, and admission details.',
}

const cyprusCities = ['nicosia', 'kyrenia', 'famagusta', 'lefke', 'guzelyurt']

export default async function GovernmentUniversitiesPage() {
  const universities = await prisma.university.findMany({
    where: { isActive: true, type: 'PUBLIC', city: { notIn: cyprusCities } },
    include: { programs: { select: { tuitionFeeUSD: true, degreeType: true } }, _count: { select: { programs: true } } },
    orderBy: { ranking: 'asc' },
  })
  const cities = [...new Set(universities.map(u => u.cityEn))].filter(Boolean)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <UniversitiesClient
        universities={universities}
        cities={cities}
        title="Government Universities in Turkey"
        subtitlePrefix="Browse "
        subtitleSuffix="+ accredited state universities across Turkey"
        hideTypeFilter
      />
      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
