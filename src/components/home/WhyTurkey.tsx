'use client'
import { motion } from 'framer-motion'
import { DollarSign, Award, Landmark, Map, BookOpen, Shield } from 'lucide-react'

const reasons = [
  { icon: DollarSign, title: 'Affordable Education', desc: 'World-class degrees at a fraction of Western university costs — from $3,000/year.', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' },
  { icon: Award, title: 'Quality Education', desc: '200+ internationally accredited universities recognized worldwide by top employers.', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
  { icon: Landmark, title: 'Rich Culture', desc: 'Experience a unique blend of Eastern and Western culture in a vibrant setting.', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
  { icon: Map, title: 'Strategic Location', desc: 'Gateway between Europe, Asia, and the Middle East — perfect for global careers.', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
  { icon: BookOpen, title: 'Scholarships Available', desc: 'Government Türkiye Scholarships and university grants up to 100% coverage.', color: 'bg-gold-50 dark:bg-gold-900/20 text-gold-600' },
  { icon: Shield, title: 'Safe & Welcoming', desc: 'Turkey welcomes 200,000+ international students annually in a secure environment.', color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' },
]

export function WhyTurkey() {
  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">Why Turkey</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">Why Study in Turkey?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">Turkey offers world-class education combined with rich culture and affordable living costs</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-gray-100 dark:border-navy-700 hover:shadow-lg transition-shadow group">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${r.color}`}><r.icon className="w-6 h-6" /></div>
              <h3 className="font-bold text-navy-900 dark:text-white text-lg mb-2">{r.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
