'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { localeConfig, type Locale } from '@/i18n/config'
import en from '@/i18n/messages/en.json'
import ar from '@/i18n/messages/ar.json'
import tr from '@/i18n/messages/tr.json'

const messages: Record<Locale, any> = { en, ar, tr }

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  tArray: <T = string>(key: string) => T[]
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getByPath(obj: any, path: string): unknown {
  return path.split('.').reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), obj)
}

export function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = localeConfig[locale].dir
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem('locale', next)
      document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`
    } catch {
      // localStorage/cookies unavailable (e.g. private mode) — locale still works for this session
    }
  }, [])

  const t = useCallback((key: string) => {
    const value = getByPath(messages[locale], key) ?? getByPath(messages.en, key)
    return typeof value === 'string' ? value : key
  }, [locale])

  const tArray = useCallback(<T,>(key: string) => {
    const value = getByPath(messages[locale], key) ?? getByPath(messages.en, key)
    return (Array.isArray(value) ? value : []) as T[]
  }, [locale])

  return <LocaleContext.Provider value={{ locale, setLocale, t, tArray }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}

export function useTranslations() {
  const { t, tArray, locale } = useLocale()
  return { t, tArray, locale }
}
