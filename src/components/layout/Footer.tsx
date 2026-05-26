import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-2 inline-block mb-4">
              <Image src="/images/logo.png" alt="Yildiz Foundation" width={140} height={45} className="h-10 w-auto" />
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">Your Best Educational Advisor for Turkish universities. Helping international students achieve their academic dreams since 2015.</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['Universities', '/universities'], ['Programs', '/programs'], ['Scholarships', '/scholarships'], ['Blog', '/blog'], ['About Us', '/about']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-blue-200 hover:text-gold-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5">Services</h4>
            <ul className="space-y-2.5">
              {['University Selection', 'Application Assistance', 'Visa Support', 'Scholarship Guidance', 'Airport Pickup', 'Housing Assistance'].map(s => (
                <li key={s} className="text-blue-200 text-sm">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-blue-200 text-sm"><MapPin className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />Istanbul, Turkey</li>
              <li className="flex items-center gap-2.5 text-blue-200 text-sm"><Phone className="w-4 h-4 text-gold-400" />+90 500 000 0000</li>
              <li className="flex items-center gap-2.5 text-blue-200 text-sm"><Mail className="w-4 h-4 text-gold-400" />info@yildizfoundation.com</li>
            </ul>
            <div className="mt-5">
              <h5 className="text-white font-semibold text-sm mb-2">Newsletter</h5>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-blue-300 outline-none focus:border-gold-400" />
                <button className="bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-sm">© {new Date().getFullYear()} Yildiz Foundation. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-blue-300 hover:text-gold-400 text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-blue-300 hover:text-gold-400 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
