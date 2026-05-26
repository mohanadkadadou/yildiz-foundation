'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock, DollarSign } from 'lucide-react'

interface Program { id: string; slug: string; nameEn: string; degreeType: string; language: string; tuitionFeeUSD: number; duration: number; category: string; university: { nameEn: string; slug: string } }
interface Props { programs: Program[] }

const categoryColors: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Medicine: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Business: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Law: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Social Sciences': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

export function PopularPrograms({ programs }: Props) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-navy-950">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">Top Programs</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">Popular Programs</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">Explore the most sought-after degree programs across Turkish universities</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {programs.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[p.category] || 'bg-gray-100 text-gray-700'}`}>{p.category}</span>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-navy-800 px-2.5 py-1 rounded-full">{p.degreeType}</span>
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white text-base mb-1 group-hover:text-navy-700">{p.nameEn}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{p.university.nameEn}</p>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-navy-500" />{p.duration} years</div>
                <div className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gold-500" />${p.tuitionFeeUSD.toLocaleString()}/yr</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 capitalize">{p.language.replace('_', ' + ')}</span>
                <Link href={`/programs/${p.slug}`} className="text-navy-700 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/programs" className="inline-flex items-center gap-2 border-2 border-navy-800 dark:border-blue-400 text-navy-800 dark:text-blue-400 hover:bg-navy-800 hover:text-white dark:hover:bg-blue-400 dark:hover:text-navy-900 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200">
            View All Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
