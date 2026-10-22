import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ApplyClient } from './ApplyClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Apply to a university' }

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ university?: string; program?: string }> }) {
  const { university, program } = await searchParams
  const [universities, programs] = await Promise.all([
    prisma.university.findMany({ where: { isActive: true }, select: { slug: true, id: true, nameEn: true, nameAr: true, nameTr: true, country: true }, orderBy: { nameEn: 'asc' } }),
    prisma.program.findMany({ where: { isActive: true }, select: { id: true, universityId: true, nameEn: true, nameAr: true, nameTr: true, degreeType: true } }),
  ])
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <ApplyClient universities={universities} programs={programs} initialUniversity={university || ''} initialProgram={program || ''} />
      <Footer />
    </div>
  )
}
