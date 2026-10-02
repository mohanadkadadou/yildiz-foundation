'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.9-.87-1.4-2.05-1.4-3.32h-3.1v13.24c0 1.62-1.32 2.94-2.94 2.94a2.94 2.94 0 0 1-2.94-2.94 2.94 2.94 0 0 1 2.94-2.94c.27 0 .53.04.78.1V9.72c-.25-.03-.52-.05-.78-.05a6.08 6.08 0 0 0-6.08 6.08 6.08 6.08 0 0 0 6.08 6.08 6.08 6.08 0 0 0 6.08-6.08V9.01a9.24 9.24 0 0 0 5.4 1.73V7.64a5.83 5.83 0 0 1-4.04-1.82z"/>
    </svg>
  )
}

const SOCIAL_LINKS = [
  { Icon: Facebook, href: 'https://www.facebook.com/yildizakdem2/?ref=pages_you_manage', label: 'Facebook' },
  { Icon: Instagram, href: 'https://www.instagram.com/yildiz_edu/', label: 'Instagram' },
  { Icon: TiktokIcon, href: 'https://www.tiktok.com/@yildiz_edu_official', label: 'TikTok' },
  { Icon: Youtube, href: 'https://youtube.com/@yildiz_education', label: 'YouTube' },
  { Icon: MessageCircle, href: 'https://whatsapp.com/channel/0029Vad3QWg5a24AP3H2LN3t', label: 'WhatsApp' },
]

export function Footer() {
  const { t, tArray } = useTranslations()
  const quickLinks = [
    ['links.universities', '/universities'],
    ['links.governmentUniversities', '/government-universities'],
    ['links.programs', '/programs'],
    ['links.courses', '/courses'],
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
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors"><Icon className="w-4 h-4" /></a>
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
              <li className="flex items-center gap-2.5 text-blue-200 text-sm"><Phone className="w-4 h-4 text-gold-400" /><a href="tel:+905395755269" dir="ltr" className="hover:text-gold-400 transition-colors">+90 539 575 5269</a></li>
              <li className="flex items-center gap-2.5 text-blue-200 text-sm"><Mail className="w-4 h-4 text-gold-400" /><a href="mailto:yildiz2020t@gmail.com" className="hover:text-gold-400 transition-colors">yildiz2020t@gmail.com</a></li>
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
