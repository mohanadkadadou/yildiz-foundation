'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'How much does it cost to study in Turkey?', a: 'Tuition fees in Turkey range from $3,000 to $15,000 per year depending on the university and program. Public universities are generally more affordable, while private universities may offer scholarships to reduce costs.' },
  { q: 'Can I study in English in Turkey?', a: 'Yes! Many top Turkish universities offer full English-medium programs, including Boğaziçi, METU, Koç, Sabancı, and Bilkent universities. Our consultants can help you find the right English-taught program.' },
  { q: 'What scholarships are available for international students?', a: 'Turkey offers excellent scholarships including the government-funded Türkiye Bursları (covers tuition + accommodation + stipend), and university-specific scholarships ranging from 25% to 100% tuition discounts.' },
  { q: 'How long does the application process take?', a: 'The application process typically takes 4-8 weeks. With Yildiz Foundation\'s guidance, we streamline the process and help you prepare all necessary documents efficiently.' },
  { q: 'Do I need to learn Turkish to study in Turkey?', a: 'Not necessarily. If you choose an English-medium program, you can study without knowing Turkish. However, learning basic Turkish will greatly enhance your daily life experience.' },
  { q: 'What is the student visa process for Turkey?', a: 'Once you receive your acceptance letter, you apply for a student visa at your nearest Turkish consulate. The process usually takes 2-4 weeks. Our team provides full support throughout the visa application.' },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Everything you need to know about studying in Turkey</p>
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
