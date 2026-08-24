'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, GraduationCap } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useTranslations } from '@/components/shared/LocaleProvider'

const navLinks = [
  { href: '/universities', key: 'universities' },
  { href: '/programs', key: 'programs' },
  { href: '/blog', key: 'blog' },
  { href: '/about', key: 'about' },
  { href: '/album', key: 'album' },
  { href: '/social-media', key: 'socialMedia' },
  { href: '/contact', key: 'contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const { t } = useTranslations()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-navy-900/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-navy-800'
        : 'bg-navy-900'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className={`rounded-xl p-1.5 transition-colors ${scrolled ? 'bg-gray-50 dark:bg-navy-800' : 'bg-white/10 backdrop-blur-sm'}`}>
              <Image src="/images/logo.png" alt="Yildiz Foundation" width={140} height={45} className="h-10 w-auto" />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}>
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher variant={scrolled ? 'dark' : 'light'} />

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl transition-all ${
                scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800' : 'text-white/90 hover:bg-white/10'
              }`}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                <Link href="/admin" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800' : 'text-white hover:bg-white/10'
                }`}>
                  {t('nav.dashboard')}
                </Link>
                <button onClick={() => signOut()}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800' : 'text-white hover:bg-white/10'
                  }`}>
                  {t('nav.login')}
                </Link>
                <Link href="/consultation"
                  className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm">
                  <GraduationCap className="w-4 h-4" />
                  {t('nav.bookConsultation')}
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2.5 rounded-xl transition-colors ${
              scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-navy-900 border-t border-gray-100 dark:border-navy-800 overflow-hidden">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-800 font-medium transition-colors">
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-navy-800">
                <LanguageSwitcher variant="dark" />
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-navy-800 flex flex-col gap-2">
                {session ? (
                  <>
                    <Link href="/admin" onClick={() => setIsOpen(false)}
                      className="block text-center px-4 py-3 rounded-xl border border-navy-200 text-navy-800 dark:text-white font-medium">
                      {t('nav.dashboard')}
                    </Link>
                    <button onClick={() => signOut()}
                      className="block w-full text-center px-4 py-3 rounded-xl bg-red-50 text-red-500 font-medium">
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}
                      className="block text-center px-4 py-3 rounded-xl border border-navy-200 text-navy-800 dark:text-white font-medium">
                      {t('nav.login')}
                    </Link>
                    <Link href="/consultation" onClick={() => setIsOpen(false)}
                      className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold">
                      {t('nav.bookConsultation')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}