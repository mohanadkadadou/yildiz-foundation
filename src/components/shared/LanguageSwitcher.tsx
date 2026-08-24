'use client'
import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { locales, localeConfig } from '@/i18n/config'
import { useLocale } from './LocaleProvider'

export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const current = localeConfig[locale]

  const triggerClass = variant === 'dark'
    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800'
    : 'text-white/90 hover:bg-white/10'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${triggerClass}`}
      >
        <Globe className="w-4 h-4" />
        <span>{current.flag} {current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-gray-100 dark:border-navy-700 py-1 min-w-[140px]"
            >
              {locales.map((code) => (
                <button
                  key={code}
                  onClick={() => { setLocale(code); setOpen(false) }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors ${code === locale ? 'text-navy-800 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  <span>{localeConfig[code].flag}</span><span>{localeConfig[code].label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
