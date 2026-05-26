'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, MessageCircle, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
const meetingTypes = [
  { value: 'ZOOM', label: 'Zoom Call', icon: Video },
  { value: 'GOOGLE_MEET', label: 'Google Meet', icon: Video },
  { value: 'WHATSAPP', label: 'WhatsApp Call', icon: MessageCircle },
]

export default function ConsultationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '',
    budget: '', majorInterest: '', degreeType: 'BACHELOR',
    preferredDate: '', preferredTime: '', meetingType: 'ZOOM', notes: ''
  })

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget ? Number(form.budget) : undefined }),
      })
      if (res.ok) { setSubmitted(true); toast.success('Consultation booked! We\'ll contact you within 24 hours.') }
      else toast.error('Something went wrong. Please try again.')
    } catch { toast.error('Network error. Please try again.') }
    setLoading(false)
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-10 bg-white dark:bg-navy-900 rounded-3xl shadow-xl max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-600" /></div>
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-300">We'll contact you within 24 hours to confirm your consultation. Check your email for details.</p>
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-3">Book a Free Consultation</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Our expert advisors will help you find your perfect university in Turkey</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-navy-800 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-navy-800' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-navy-800">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-navy-900 dark:text-white mb-5">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['firstName', 'lastName'].map(f => (
                    <div key={f}><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block capitalize">{f === 'firstName' ? 'First Name' : 'Last Name'}</label>
                      <input value={(form as any)[f]} onChange={e => update(f, e.target.value)} className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white" /></div>
                  ))}
                </div>
                {[['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel'], ['country', 'Your Country', 'text']].map(([f, l, t]) => (
                  <div key={f}><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{l}</label>
                    <input type={t} value={(form as any)[f]} onChange={e => update(f, e.target.value)} className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white" /></div>
                ))}
                <button onClick={() => setStep(2)} className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-4 rounded-2xl transition-colors mt-2">Continue →</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-navy-900 dark:text-white mb-5">Academic Preferences</h3>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Annual Budget (USD)</label>
                  <input type="number" value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="e.g. 8000" className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white" /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Preferred Major</label>
                  <input value={form.majorInterest} onChange={e => update('majorInterest', e.target.value)} placeholder="e.g. Medicine, Engineering..." className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white" /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Degree Type</label>
                  <select value={form.degreeType} onChange={e => update('degreeType', e.target.value)} className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white">
                    {['BACHELOR', 'MASTER', 'PHD', 'DIPLOMA'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Additional Notes</label>
                  <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any specific requirements or questions..." className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white resize-none" /></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">← Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-navy-800 hover:bg-navy-900 text-white font-bold py-4 rounded-2xl transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-bold text-xl text-navy-900 dark:text-white mb-5">Schedule Your Meeting</h3>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Preferred Date</label>
                  <input type="date" value={form.preferredDate} onChange={e => update('preferredDate', e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white" /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Preferred Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(t => <button key={t} onClick={() => update('preferredTime', t)} className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${form.preferredTime === t ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 hover:border-navy-500'}`}>{t}</button>)}
                  </div></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Meeting Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {meetingTypes.map(mt => <button key={mt.value} onClick={() => update('meetingType', mt.value)} className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${form.meetingType === mt.value ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 hover:border-navy-500'}`}>
                      <mt.icon className="w-4 h-4" />{mt.label}
                    </button>)}
                  </div></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">← Back</button>
                  <button onClick={submit} disabled={loading || !form.preferredDate || !form.preferredTime} className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : '🎓 Book Consultation'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
