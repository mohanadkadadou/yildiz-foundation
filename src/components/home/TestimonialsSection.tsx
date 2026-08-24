'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'

interface Testimonial { id: string; nameEn: string; nameAr: string; nameTr: string; country: string; university: string; major: string; contentEn: string; contentAr: string; contentTr: string; rating: number }
interface Props { testimonials: Testimonial[] }

export function TestimonialsSection({ testimonials }: Props) {
  const { t, locale } = useTranslations()
  return (
    <section className="py-20 gradient-navy">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">{t('testimonials.eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('testimonials.title')}</h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">{t('testimonials.subtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((tst, i) => (
            <motion.div key={tst.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Quote className="w-8 h-8 text-gold-400 mb-4 opacity-60" />
              <p className="text-blue-50 text-sm leading-relaxed mb-5">&quot;{localize(tst, 'content', locale)}&quot;</p>
              <div className="flex mb-3">{Array.from({ length: tst.rating }).map((_, j) => <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />)}</div>
              <div>
                <div className="font-semibold text-white">{localize(tst, 'name', locale)}</div>
                <div className="text-blue-200 text-xs mt-0.5">{tst.major} • {tst.university}</div>
                <div className="text-gold-400 text-xs mt-0.5">🌍 {tst.country}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
