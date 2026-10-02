import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { UniversityDetailClient } from './UniversityDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const uni = await prisma.university.findUnique({ where: { slug } })
  if (!uni) return { title: 'University Not Found' }
  return { title: `${uni.nameEn} | Yildiz Foundation`, description: uni.descriptionEn.slice(0, 160) }
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const uni = await prisma.university.findUnique({
    where: { slug },
    include: { programs: { orderBy: { tuitionFeeUSD: 'asc' } }, scholarships: true, requirements: true },
  })
  if (!uni) notFound()

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <Navbar />
      <UniversityDetailClient uni={uni} />
      <Footer />
    </div>
  )
}