'use client'
import Link from 'next/link'
import { Clock, DollarSign, BookOpen, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'

interface Program {
  id: string; slug: string; nameEn: string; nameAr: string; nameTr: string
  descriptionEn: string; descriptionAr: string; descriptionTr: string
  category: string; degreeType: string; language: string; duration: number; tuitionFeeUSD: number
  university: { nameEn: string; nameAr: string; nameTr: string; slug: string; cityEn: string; cityAr: string; cityTr: string }
}

const degreeKeys: Record<string, string> = { BACHELOR: 'bachelor', MASTER: 'master', PHD: 'phd', DIPLOMA: 'diploma' }

export function ProgramsClient({ programs, categories }: { programs: Program[]; categories: string[] }) {
  const { t, locale } = useTranslations()
  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('programs.popular')}</h1>
          <p className="text-blue-100 text-lg">{t('programs.browsePrefix')}{programs.length}{t('programs.browseSuffix')}</p>
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
                <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-navy-800 px-2.5 py-1 rounded-full">{t(`programs.${degreeKeys[p.degreeType] || 'bachelor'}`)}</span>
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white mb-1">{localize(p, 'name', locale)}</h3>
              <p className="text-sm text-gray-500 mb-3">{localize(p.university, 'name', locale)} · {localize(p.university, 'city', locale)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{localize(p, 'description', locale)}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-navy-500" />{p.duration}yr</div>
                <div className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gold-500" />${p.tuitionFeeUSD.toLocaleString()}/yr</div>
                <div className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-navy-500" />{p.language.replace('_', '+')}</div>
              </div>
              <Link href={`/programs/${p.slug}`} className="flex items-center justify-between bg-gray-50 dark:bg-navy-800 hover:bg-navy-800 hover:text-white text-navy-900 dark:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all group">
                {t('programs.details')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
