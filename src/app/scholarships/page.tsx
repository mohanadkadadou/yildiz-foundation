import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'
import { ScholarshipsClient } from './ScholarshipsClient'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Scholarships & Discounts', description: 'Scholarships and tuition discounts offered by our partner universities in Turkey and abroad.' }

export default async function ScholarshipsPage() {
  const scholarships = await prisma.scholarship.findMany({
    include: { university: { select: { slug: true, nameEn: true, nameAr: true, nameTr: true, country: true } } },
    orderBy: [{ percentage: 'desc' }],
  })
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <ScholarshipsClient scholarships={scholarships} />
      <Footer />
    </div>
  )
}
