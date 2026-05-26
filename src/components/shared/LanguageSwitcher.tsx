'use client'
import { useState, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
]

export function LanguageSwitcher() {
  const [current, setCurrent] = useState(languages[0])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved) {
      const lang = languages.find(l => l.code === saved)
      if (lang) {
        setCurrent(lang)
        document.documentElement.lang = lang.code
        document.documentElement.dir = lang.dir
      }
    }
  }, [])

  const switchLang = (lang: typeof languages[0]) => {
    setCurrent(lang)
    setOpen(false)
    localStorage.setItem('lang', lang.code)
    document.documentElement.lang = lang.code
    document.documentElement.dir = lang.dir
    window.location.reload()
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors">
        <Globe className="w-4 h-4" />
        <span>{current.flag} {current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-gray-100 dark:border-navy-700 py-1 min-w-[140px] z-50">
          {languages.map(lang => (
            <button key={lang.code} onClick={() => switchLang(lang)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
              <span>{lang.flag}</span><span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
