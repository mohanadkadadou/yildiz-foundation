// src/app/page.tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { FeaturedUniversities } from '@/components/home/FeaturedUniversities'
import { DestinationsSection } from '@/components/home/DestinationsSection'
import { PopularPrograms } from '@/components/home/PopularPrograms'
import { WhyTurkey } from '@/components/home/WhyTurkey'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { ConsultationCTA } from '@/components/home/ConsultationCTA'
import { BlogSection } from '@/components/home/BlogSection'
import { FAQSection } from '@/components/home/FAQSection'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { AIAssistant } from '@/components/shared/AIAssistant'
import { prisma } from '@/lib/prisma'

async function getHomeData() {
  const [universities, programs, testimonials, posts] = await Promise.all([
    prisma.university.findMany({
      where: { isFeatured: true, isActive: true },
      include: { programs: { take: 3 } },
      take: 6,
      orderBy: { ranking: 'asc' },
    }),
    prisma.program.findMany({
      where: { isFeatured: true, isActive: true },
      include: { university: true },
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      take: 4,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const countryGroups = await prisma.university.groupBy({ by: ['country'], where: { isActive: true }, _count: { _all: true } })
  const destinationCounts = Object.fromEntries(countryGroups.map(g => [g.country, g._count._all]))

  const stats = {
    universities: await prisma.university.count(),
    programs: await prisma.program.count(),
    students: 2500,
    countries: 45,
  }

  return { universities, programs, testimonials, posts, stats, destinationCounts }
}

export default async function HomePage() {
  const { universities, programs, testimonials, posts, stats, destinationCounts } = await getHomeData()

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection stats={stats} />
        <DestinationsSection counts={destinationCounts} />
        <FeaturedUniversities universities={universities} />
        <PopularPrograms programs={programs} />
        <WhyTurkey />
        <TestimonialsSection testimonials={testimonials} />
        <ConsultationCTA />
        <BlogSection posts={posts} />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <AIAssistant />
    </div>
  )
}
export const dynamic = 'force-dynamic'
