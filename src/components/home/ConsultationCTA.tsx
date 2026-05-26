'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MessageCircle, Phone, ArrowRight } from 'lucide-react'

export function ConsultationCTA() {
  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%), radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%)' }} />
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">Free Consultation</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Start Your Journey Today</h2>
              <p className="text-blue-100 text-lg mb-10 leading-relaxed">Get personalized guidance from our expert consultants. We'll help you find the perfect university and program that matches your goals and budget.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link href="/consultation" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg text-lg">
                  <Calendar className="w-5 h-5" /> Book Free Consultation <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl transition-all border border-white/30 text-lg">
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-blue-200 text-sm">
                {['Free Consultation', '24hr Response', 'Expert Advisors', 'Scholarship Help'].map(f => (
                  <div key={f} className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold-400" />{f}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
