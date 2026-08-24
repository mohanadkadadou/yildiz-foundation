import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { ProgramsClient } from './ProgramsClient'

export const metadata: Metadata = { title: 'Programs | Turkish Universities', description: 'Browse bachelor, master, PhD programs at Turkish universities.' }

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    include: { university: { select: { nameEn: true, nameAr: true, nameTr: true, slug: true, cityEn: true, cityAr: true, cityTr: true } } },
    orderBy: { tuitionFeeUSD: 'asc' },
  })

  const categories = [...new Set(programs.map(p => p.category))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <ProgramsClient programs={programs} categories={categories} />
      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
