'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useTranslations } from '@/components/shared/LocaleProvider'

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t, tArray } = useTranslations()
  const sections = tArray<{ h: string; p: string }>(`legal.${kind}.sections`)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-12 px-4 mb-10">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t(`legal.${kind}.title`)}</h1>
            <p className="text-blue-200 text-sm">{t('legal.updated')}</p>
          </div>
        </div>
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-navy-800 space-y-7">
            {sections.map((s, i) => (
              <section key={s.h}>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white mb-2">{i + 1}. {s.h}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-8">{s.p}</p>
              </section>
            ))}
            <p className="pt-4 border-t border-gray-100 dark:border-navy-800 text-sm text-gray-500">{t('legal.contactLine')}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
