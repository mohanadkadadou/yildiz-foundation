'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Languages, GraduationCap, Globe2, PenLine, MessageCircle, Calendar } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useTranslations } from '@/components/shared/LocaleProvider'

interface CourseItem { key: string; name: string; full: string; desc: string }

const ICONS: Record<string, typeof BookOpen> = { tryos: GraduationCap, sat: PenLine, toefl: Globe2, tomer: Languages, yks: BookOpen }

export default function CoursesPage() {
  const { t, tArray } = useTranslations()
  const items = tArray<CourseItem>('courses.items')
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-12">
          <div className="container mx-auto text-center">
            <span className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">{t('courses.eyebrow')}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('courses.title')}</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">{t('courses.subtitle')}</p>
          </div>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c, i) => {
            const Icon = ICONS[c.key] || BookOpen
            return (
              <motion.div key={c.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-navy-800 hover:shadow-lg transition-all flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-navy-800 text-white flex items-center justify-center mb-4"><Icon className="w-6 h-6" /></div>
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{c.name}</h2>
                <p className="text-gold-600 text-sm font-semibold mb-3">{c.full}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1">{c.desc}</p>
                <div className="flex flex-col gap-2">
                  <a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                    <MessageCircle className="w-4 h-4" /> {t('courses.register')}
                  </a>
                  <Link href="/consultation" className="flex items-center justify-center gap-2 border border-gray-200 dark:border-navy-700 text-navy-800 dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors text-sm">
                    <Calendar className="w-4 h-4" /> {t('consultation.bookBtn')}
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}
