import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { UniversitiesClient } from '../universities/UniversitiesClient'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Government Universities in Turkey',
  description: 'Browse accredited state (government) universities in Turkey — tuition, faculties, and admission details.',
}

export default async function GovernmentUniversitiesPage() {
  const universities = await prisma.university.findMany({
    where: { isActive: true, type: 'PUBLIC', country: 'turkey' },
    include: { programs: { select: { tuitionFeeUSD: true, degreeType: true } }, _count: { select: { programs: true } } },
    orderBy: { ranking: 'asc' },
  })
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <UniversitiesClient
        universities={universities}
        variant="government"
        hideTypeFilter
      />
      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
