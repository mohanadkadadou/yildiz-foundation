'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Loader2, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslations } from '@/components/shared/LocaleProvider'

export default function ContactPage() {
  const { t } = useTranslations()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, source: 'WEBSITE', country: 'Unknown' }),
    })
    toast.success(t('contact.successToast'))
    setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-16">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('contact.title')}</h1>
            <p className="text-blue-100 text-lg">{t('contact.subtitle')}</p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800">
                <div className="p-3 bg-navy-800 rounded-xl"><Phone className="w-5 h-5 text-white" /></div>
                <div><div className="font-semibold text-navy-900 dark:text-white">{t('contact.phone')}</div>
                <a href="tel:+905395755269" className="text-gray-600 dark:text-gray-300 text-sm">+90 539 575 5269</a></div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800">
                <div className="p-3 bg-navy-800 rounded-xl"><Mail className="w-5 h-5 text-white" /></div>
                <div><div className="font-semibold text-navy-900 dark:text-white">{t('contact.email')}</div>
                <a href="mailto:info@yildizfoundation.com" className="text-gray-600 dark:text-gray-300 text-sm">info@yildizfoundation.com</a></div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800">
                <div className="p-3 bg-navy-800 rounded-xl"><MapPin className="w-5 h-5 text-white" /></div>
                <div><div className="font-semibold text-navy-900 dark:text-white">{t('contact.location')}</div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('contact.locationValue')}</span></div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800">
                <div className="p-3 bg-navy-800 rounded-xl"><Clock className="w-5 h-5 text-white" /></div>
                <div><div className="font-semibold text-navy-900 dark:text-white">{t('contact.workingHours')}</div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('contact.workingHoursValue')}</span></div>
              </div>
              <a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-colors">
                <MessageCircle className="w-5 h-5" /> {t('contact.chatWhatsapp')}
              </a>
            </div>
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-gray-100 dark:border-navy-800 shadow-lg space-y-5">
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">{t('contact.sendMessageTitle')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('contact.firstName')}</label>
                    <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none bg-white dark:bg-navy-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('contact.lastName')}</label>
                    <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none bg-white dark:bg-navy-800 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('contact.email')}</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none bg-white dark:bg-navy-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('contact.phone')}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none bg-white dark:bg-navy-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('contact.message')}</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5}
                    className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none bg-white dark:bg-navy-800 text-gray-900 dark:text-white resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t('contact.sending')}</> : <><Send className="w-4 h-4" />{t('contact.sendMessage')}</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
