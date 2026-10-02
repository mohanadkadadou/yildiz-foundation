import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { UniversitiesClient } from './UniversitiesClient'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Universities | Turkey, Cyprus & Europe',
  description: 'Browse universities in Turkey, Northern Cyprus, Georgia, Germany, Spain, Hungary, Romania and Syria.',
}

const COUNTRIES = ['turkey', 'northern-cyprus', 'georgia', 'germany', 'spain', 'hungary', 'romania', 'syria']

export default async function UniversitiesPage({ searchParams }: { searchParams: { country?: string } }) {
  const lockedCountry = COUNTRIES.includes(searchParams.country || '') ? searchParams.country : undefined
  const universities = await prisma.university.findMany({
    // Without a country filter, Turkish state universities are left out (they have their own dedicated page).
    where: lockedCountry
      ? { isActive: true, country: lockedCountry }
      : { isActive: true, OR: [{ type: 'PRIVATE' }, { country: { not: 'turkey' } }] },
    include: { programs: { select: { tuitionFeeUSD: true, degreeType: true } }, _count: { select: { programs: true } } },
    orderBy: { ranking: 'asc' },
  })
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <UniversitiesClient universities={universities} lockedCountry={lockedCountry} />
      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
