import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProgramDetailClient } from './ProgramDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await prisma.program.findUnique({ where: { slug }, include: { university: { select: { nameEn: true } } } })
  if (!p) return { title: 'Program Not Found' }
  return { title: `${p.nameEn} at ${p.university.nameEn}`, description: p.descriptionEn.slice(0, 160) }
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await prisma.program.findUnique({ where: { slug }, include: { university: true } })
  if (!program || !program.isActive) notFound()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <ProgramDetailClient program={program} />
      <Footer />
    </div>
  )
}
