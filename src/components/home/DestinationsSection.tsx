'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'

const FLAGS: Record<string, string> = {
  turkey: '🇹🇷', 'northern-cyprus': '🇨🇾', georgia: '🇬🇪', germany: '🇩🇪',
  spain: '🇪🇸', hungary: '🇭🇺', romania: '🇷🇴', syria: '🇸🇾',
}
const ORDER = ['turkey', 'northern-cyprus', 'georgia', 'germany', 'spain', 'hungary', 'romania', 'syria']

export function DestinationsSection({ counts }: { counts: Record<string, number> }) {
  const { t } = useTranslations()
  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">{t('destinations.eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">{t('destinations.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">{t('destinations.subtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {ORDER.map((slug, i) => (
            <motion.div key={slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/universities?country=${slug}`} className="group block h-full bg-gray-50 dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700 hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                <div className="text-5xl mb-3">{FLAGS[slug]}</div>
                <h3 className="font-bold text-navy-900 dark:text-white text-lg mb-1">{t(`countries.${slug}`)}</h3>
                <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-4">
                  <GraduationCap className="w-4 h-4" />{counts[slug] ?? 0} {t('destinations.count')}
                </div>
                <span className="inline-flex items-center gap-1.5 text-navy-700 dark:text-blue-400 text-sm font-semibold group-hover:gap-2.5 transition-all">
                  {t('destinations.explore')} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
