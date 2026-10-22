'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, DollarSign, GraduationCap, Languages, Building2, Briefcase, MessageCircle, Calendar, Tag } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'

interface Program {
  id: string
  nameEn: string; nameAr: string; nameTr: string
  descriptionEn: string; descriptionAr: string; descriptionTr: string
  careerOppsEn: string; careerOppsAr: string; careerOppsTr: string
  degreeType: string; language: string; duration: number; tuitionFeeUSD: number; category: string
  university: { slug: string; nameEn: string; nameAr: string; nameTr: string; cityEn: string; cityAr: string; cityTr: string }
}
const degreeKeys: Record<string, string> = { BACHELOR: 'bachelor', MASTER: 'master', PHD: 'phd', DIPLOMA: 'diploma' }

export function ProgramDetailClient({ program: p }: { program: Program }) {
  const { t, locale } = useTranslations()
  const careers = localize(p, 'careerOpps', locale).split(',').map(s => s.trim()).filter(Boolean)
  const Back = locale === 'ar' ? ArrowRight : ArrowLeft
  const facts = [
    { icon: GraduationCap, label: t('programDetail.degree'), value: t(`programs.${degreeKeys[p.degreeType] || 'bachelor'}`) },
    { icon: Languages, label: t('programDetail.language'), value: t(`programDetail.languages.${p.language}`) },
    { icon: Clock, label: t('programDetail.duration'), value: `${p.duration} ${t('programDetail.years')}` },
    { icon: DollarSign, label: t('programDetail.tuition'), value: `$${p.tuitionFeeUSD.toLocaleString()}` },
    { icon: Tag, label: t('programDetail.category'), value: p.category },
  ]
  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-12 px-4 mb-10">
        <div className="container mx-auto max-w-5xl">
          <Link href="/programs" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-5"><Back className="w-4 h-4" />{t('programDetail.back')}</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{localize(p, 'name', locale)}</h1>
          <Link href={`/universities/${p.university.slug}`} className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200">
            <Building2 className="w-4 h-4" />{localize(p.university, 'name', locale)} · {localize(p.university, 'city', locale)}
          </Link>
        </div>
      </div>
      <div className="container mx-auto max-w-5xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-navy-800">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">{t('programDetail.about')}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{localize(p, 'description', locale)}</p>
          </section>
          {careers.length > 0 && (
            <section className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-gold-500" />{t('programDetail.career')}</h2>
              <div className="flex flex-wrap gap-2">
                {careers.map(c => <span key={c} className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm">{c}</span>)}
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-5">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-navy-800">
            <h3 className="font-bold text-navy-900 dark:text-white mb-4">{t('programDetail.overview')}</h3>
            <dl className="space-y-3">
              {facts.map(f => (
                <div key={f.label} className="flex items-center justify-between gap-3 text-sm">
                  <dt className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><f.icon className="w-4 h-4 text-navy-500" />{f.label}</dt>
                  <dd className="font-semibold text-navy-900 dark:text-white text-end">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link href={`/universities/${p.university.slug}`} className="mt-5 block text-center border border-gray-200 dark:border-navy-700 text-navy-800 dark:text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">{t('programDetail.viewUniversity')}</Link>
          </div>
          <div className="bg-blue-900 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">{t('programDetail.apply')}</h3>
            <p className="text-blue-100 text-sm mb-4">{t('programDetail.applyDesc')}</p>
            <Link href={`/apply?university=${p.university.slug}&program=${p.id}`} className="flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 font-bold py-3 rounded-xl transition-colors mb-3">{t('applyCta.button')}</Link>
            <Link href="/consultation" className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-colors mb-3"><Calendar className="w-4 h-4" />{t('consultation.bookBtn')}</Link>
            <a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors text-sm"><MessageCircle className="w-4 h-4" />{t('consultation.whatsappUs')}</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
