'use client'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { format } from 'date-fns'
import { FilePlus2, FileText, ArrowRight, ArrowLeft, Building2, Paperclip, LogOut } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'
import { AppStatusBadge } from '@/components/account/AppStatusBadge'

interface Application {
  id: string; status: string; intake: string | null; createdAt: Date
  university: { slug: string; nameEn: string; nameAr: string; nameTr: string }
  program: { nameEn: string; nameAr: string; nameTr: string } | null
  _count: { files: number }
}

export function AccountClient({ name, applications }: { name: string; applications: Application[] }) {
  const { t, locale } = useTranslations()
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight
  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-12 px-4 mb-10">
        <div className="container mx-auto max-w-4xl flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-gold-300 text-sm mb-1">{t('account.welcome')}{name ? `, ${name}` : ''}</p>
            <h1 className="text-3xl font-bold text-white mb-2">{t('account.title')}</h1>
            <p className="text-blue-100">{t('account.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/apply" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold px-5 py-3 rounded-xl transition-colors"><FilePlus2 className="w-4 h-4" />{t('account.newApplication')}</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="inline-flex items-center gap-2 border border-white/30 text-white px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"><LogOut className="w-4 h-4" />{t('account.logout')}</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-4xl px-4">
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-navy-900 rounded-3xl border border-gray-100 dark:border-navy-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50 dark:bg-navy-800 flex items-center justify-center"><FileText className="w-8 h-8 text-navy-600 dark:text-blue-300" /></div>
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">{t('account.empty')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('account.emptyDesc')}</p>
            <Link href="/apply" className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-bold px-6 py-3 rounded-xl transition-colors">{t('account.startNow')}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(a => (
              <Link key={a.id} href={`/account/applications/${a.id}`} className="block bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-bold text-navy-900 dark:text-white"><Building2 className="w-4 h-4 text-navy-500 shrink-0" /><span className="truncate">{localize(a.university, 'name', locale)}</span></div>
                    {a.program && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{localize(a.program, 'name', locale)}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                      {a.intake && <span>{a.intake}</span>}
                      <span className="flex items-center gap-1"><Paperclip className="w-3.5 h-3.5" />{a._count.files} {t('account.documents')}</span>
                      <span>{t('account.started')} {format(new Date(a.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3"><AppStatusBadge status={a.status} /><Arrow className="w-4 h-4 text-gray-400" /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
