'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Award, Search, MessageCircle } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'

interface Scholarship {
  id: string; nameEn: string; nameAr: string; nameTr: string; descEn: string; descAr: string; descTr: string
  amount: number | null; percentage: number | null
  university: { slug: string; nameEn: string; nameAr: string; nameTr: string; country: string }
}

export function ScholarshipsClient({ scholarships }: { scholarships: Scholarship[] }) {
  const { t, locale } = useTranslations()
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return scholarships
    return scholarships.filter(x => [x.nameEn, x.nameAr, x.nameTr, x.university.nameEn, x.university.nameAr, x.university.nameTr].some(v => v.toLowerCase().includes(s)))
  }, [q, scholarships])
  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-10">
        <div className="container mx-auto text-center">
          <span className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">{t('scholarshipsPage.eyebrow')}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('scholarshipsPage.title')}</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">{t('scholarshipsPage.subtitle')}</p>
          <div className="max-w-xl mx-auto flex items-center bg-white/10 border border-white/20 rounded-2xl px-4">
            <Search className="w-5 h-5 text-white/50 me-3" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('scholarshipsPage.searchPlaceholder')} className="flex-1 bg-transparent py-4 text-white placeholder:text-white/40 outline-none" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">{t('scholarshipsPage.none')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(s => (
              <div key={s.id} className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 hover:shadow-lg transition-all flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-600 flex items-center justify-center"><Award className="w-5 h-5" /></div>
                  {s.percentage ? <span className="text-sm font-bold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full">{s.percentage}% {t('scholarshipsPage.off')}</span> : s.amount ? <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">${s.amount.toLocaleString()}</span> : null}
                </div>
                <h2 className="font-bold text-navy-900 dark:text-white mb-1">{localize(s, 'name', locale)}</h2>
                <Link href={`/universities/${s.university.slug}`} className="text-sm text-navy-600 dark:text-blue-400 hover:underline mb-3">{localize(s.university, 'name', locale)}</Link>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5 flex-1">{localize(s, 'desc', locale)}</p>
                <a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"><MessageCircle className="w-4 h-4" />{t('scholarshipsPage.apply')}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
