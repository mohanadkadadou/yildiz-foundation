'use client'
import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'

const field = 'w-full px-4 py-3 border border-gray-200 dark:border-navy-700 rounded-xl text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white'

function RegisterForm() {
  const { t, locale } = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const raw = params.get('callbackUrl') || '/account'
  const callbackUrl = raw.startsWith('/') && !raw.startsWith('//') && raw !== '/' ? raw : '/account'
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', country: '' })
  const [loading, setLoading] = useState(false)
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, locale }) })
      if (!res.ok) {
        const code = (await res.json().catch(() => ({}))).error
        toast.error(code === 'exists' ? t('authExtra.errExists') : code === 'rate_limited' ? t('authExtra.errRate') : code === 'invalid' ? t('authExtra.errInvalid') : t('authExtra.errGeneric'))
        setLoading(false)
        return
      }
      const login = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (login?.error) { router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`); return }
      router.push(callbackUrl)
      router.refresh()
    } catch {
      toast.error(t('authExtra.errGeneric'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4"><Link href="/"><Image src="/images/logo.png" alt="Yildiz Foundation" width={160} height={52} className="h-12 w-auto" /></Link></div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">{t('authExtra.registerTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('authExtra.registerSubtitle')}</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('authExtra.fullName')}</label>
            <input required minLength={2} value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" className={field} /></div>
          <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('auth.email')}</label>
            <input required type="email" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" className={field} /></div>
          <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('authExtra.password')}</label>
            <input required type="password" minLength={8} dir="ltr" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" className={field} />
            <p className="text-xs text-gray-400 mt-1">{t('authExtra.passwordHint')}</p></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('authExtra.phone')}</label>
              <input type="tel" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" className={field} /></div>
            <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('authExtra.country')}</label>
              <input value={form.country} onChange={e => set('country', e.target.value)} autoComplete="country-name" className={field} /></div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-3.5 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t('authExtra.submitting')}</> : t('authExtra.submit')}
          </button>
          <p className="text-xs text-gray-400 text-center">{t('authExtra.terms')} <Link href="/terms" className="underline">{t('authExtra.termsLink')}</Link> {t('authExtra.and')} <Link href="/privacy" className="underline">{t('authExtra.privacyLink')}</Link></p>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          {t('authExtra.haveAccount')} <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-navy-700 dark:text-blue-400 font-semibold hover:underline">{t('authExtra.signIn')}</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return <Suspense fallback={null}><RegisterForm /></Suspense>
}
