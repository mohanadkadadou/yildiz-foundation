'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface Testimonial { id: string; nameEn: string; country: string; university: string; major: string; contentEn: string; rating: number }
interface Props { testimonials: Testimonial[] }

export function TestimonialsSection({ testimonials }: Props) {
  return (
    <section className="py-20 gradient-navy">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Success Stories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Student Success Stories</h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">Hear from students we've helped achieve their dreams of studying in Turkey</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Quote className="w-8 h-8 text-gold-400 mb-4 opacity-60" />
              <p className="text-blue-50 text-sm leading-relaxed mb-5">"{t.contentEn}"</p>
              <div className="flex mb-3">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />)}</div>
              <div>
                <div className="font-semibold text-white">{t.nameEn}</div>
                <div className="text-blue-200 text-xs mt-0.5">{t.major} • {t.university}</div>
                <div className="text-gold-400 text-xs mt-0.5">🌍 {t.country}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
