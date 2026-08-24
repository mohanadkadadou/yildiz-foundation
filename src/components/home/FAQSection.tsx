'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'

interface FaqItem { q: string; a: string }

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)
  const { t, tArray } = useTranslations()
  const faqs = tArray<FaqItem>('faq.items')
  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">{t('faq.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{t('faq.subtitle')}</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="border border-gray-100 dark:border-navy-700 rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
                <span className="font-semibold text-navy-900 dark:text-white pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-navy-800">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
