'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'

export function Footer() {
  const { t, tArray } = useTranslations()
  const quickLinks = [
    ['links.universities', '/universities'],
    ['links.governmentUniversities', '/government-universities'],
    ['links.programs', '/programs'],
    ['links.scholarships', '/scholarships'],
    ['links.blog', '/blog'],
    ['links.aboutUs', '/about'],
    ['links.album', '/album'],
    ['links.socialMedia', '/social-media'],
  ]
  const services = tArray<string>('footer.servicesItems')

  return (
    <footer className="bg-navy-950 text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-2 inline-block mb-4">
              <Image src="/images/logo.png" alt="Yildiz Foundation" width={140} height={45} className="h-10 w-auto" />
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">{t('footer.taglineDesc')}</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(([key, href]) => (
                <li key={href}><Link href={href} className="text-blue-200 hover:text-gold-400 text-sm transition-colors">{t(`footer.${key}`)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5">{t('footer.services')}</h4>
            <ul className="space-y-2.5">
              {services.map(s => (
                <li key={s} className="text-blue-200 text-sm">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-blue-200 text-sm"><MapPin className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />{t('footer.address')}</li>
              <li className="flex items-center gap-2.5 text-blue-200 text-sm"><Phone className="w-4 h-4 text-gold-400" />+90 500 000 0000</li>
              <li className="flex items-center gap-2.5 text-blue-200 text-sm"><Mail className="w-4 h-4 text-gold-400" />info@yildizfoundation.com</li>
            </ul>
            <div className="mt-5">
              <h5 className="text-white font-semibold text-sm mb-2">{t('footer.newsletter')}</h5>
              <div className="flex gap-2">
                <input type="email" placeholder={t('footer.emailPlaceholder')} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-blue-300 outline-none focus:border-gold-400" />
                <button className="bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors">{t('footer.subscribe')}</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-sm">© {new Date().getFullYear()} Yildiz Foundation. {t('footer.rights')}.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-blue-300 hover:text-gold-400 text-sm transition-colors">{t('footer.privacy')}</Link>
            <Link href="/terms" className="text-blue-300 hover:text-gold-400 text-sm transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
