import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Clock, DollarSign, BookOpen, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Programs | Turkish Universities', description: 'Browse bachelor, master, PhD programs at Turkish universities.' }

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    include: { university: { select: { nameEn: true, slug: true, cityEn: true } } },
    orderBy: { tuitionFeeUSD: 'asc' },
  })

  const categories = [...new Set(programs.map(p => p.category))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-10">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Study Programs</h1>
            <p className="text-blue-100 text-lg">Browse {programs.length}+ programs across Turkish universities</p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(c => <span key={c} className="px-4 py-2 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-full text-sm font-medium text-navy-800 dark:text-white cursor-pointer hover:bg-navy-800 hover:text-white transition-colors">{c}</span>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map(p => (
              <div key={p.id} className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{p.category}</span>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-navy-800 px-2.5 py-1 rounded-full">{p.degreeType}</span>
                </div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-1">{p.nameEn}</h3>
                <p className="text-sm text-gray-500 mb-3">{p.university.nameEn} · {p.university.cityEn}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{p.descriptionEn}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-navy-500" />{p.duration}yr</div>
                  <div className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gold-500" />${p.tuitionFeeUSD.toLocaleString()}/yr</div>
                  <div className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-navy-500" />{p.language.replace('_', '+')}</div>
                </div>
                <Link href={`/programs/${p.slug}`} className="flex items-center justify-between bg-gray-50 dark:bg-navy-800 hover:bg-navy-800 hover:text-white text-navy-900 dark:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all group">
                  View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
