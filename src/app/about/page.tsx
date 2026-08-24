'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Award, Users, Globe, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from '@/components/shared/LocaleProvider'

const certificates = [
  { src: '/images/certificates/yildiz-plaque.jpeg', title: 'Yildiz Foundation', subtitle: 'Commemorative Plaque' },
  { src: '/images/certificates/beruni-university.jpeg', title: 'Beruni University', subtitle: 'Certificate of Appreciation' },
  { src: '/images/certificates/istinye-university.jpeg', title: 'İstinye University', subtitle: 'Certificate of Appreciation' },
]

const team = [
  { src: '/images/team/ammar-yildiz.jpeg', name: 'Dr. Ammar Yıldız', role: 'Executive Director' },
  { src: '/images/team/obeida-yildiz.jpeg', name: 'Dr. Obeida Yıldız', role: 'General Manager' },
  { src: '/images/team/abdullah-almasri.jpeg', name: 'Dr. Abdullah Al-Masri', role: 'Public Relations Officer' },
  { src: '/images/team/mazen-bayazid.jpeg', name: 'Mazen Bayazid', role: 'Student Affairs Officer' },
  { src: '/images/team/yousef-abouras.jpeg', name: 'Yousef Abu Ras', role: 'Educational Consultant' },
  { src: null, name: 'Deniz Hoca', role: 'Educational Consultant' },
  { src: null, name: 'Layan Bahar', role: 'Educational Consultant' },
  { src: '/images/team/mustafa-mohammed.jpeg', name: 'Mustafa Mohammed', role: 'Student Registrar' },
  { src: '/images/team/khaled-almajdi.jpeg', name: 'Khaled Al-Majdi', role: 'Student Registrar' },
]

export default function AboutPage() {
  const { t } = useTranslations()
  const stats = [
    { icon: Users, title: '2,500+', desc: t('about.statsStudents'), color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
    { icon: Globe, title: '45+', desc: t('about.statsCountries'), color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' },
    { icon: Award, title: '20+', desc: t('about.statsUniversities'), color: 'bg-gold-50 dark:bg-gold-900/20 text-gold-600' },
    { icon: Heart, title: '97%', desc: t('about.statsSuccessRate'), color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' },
  ]
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-16">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('about.title')}</h1>
            <p className="text-blue-100 text-lg">{t('about.subtitle')}</p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-5">{t('about.whoWeAreTitle')}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{t('about.whoWeAreP1')}</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{t('about.whoWeAreP2')}</p>
              <Link href="/consultation" className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-bold px-8 py-4 rounded-2xl transition-all">
                {t('consultation.bookBtn')}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {stats.map(s => (
                <div key={s.desc} className="p-6 bg-gray-50 dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 text-center">
                  <div className={`inline-flex p-3 rounded-xl mb-3 ${s.color}`}><s.icon className="w-6 h-6" /></div>
                  <div className="text-2xl font-bold text-navy-900 dark:text-white">{s.title}</div>
                  <div className="text-gray-500 text-sm">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-gold-500 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold text-sm">{t('about.recognitionLabel')}</span>
              </div>
              <h2 className="section-title mb-3">{t('about.certificatesTitle')}</h2>
              <p className="section-subtitle">{t('about.certificatesSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div key={cert.src} className="uni-card">
                  <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-navy-800">
                    <Image src={cert.src} alt={cert.title} fill className="object-cover" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-navy-900 dark:text-white">{cert.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{cert.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-gold-500 mb-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold text-sm">{t('about.teamLabel')}</span>
              </div>
              <h2 className="section-title mb-3">{t('about.teamTitle')}</h2>
              <p className="section-subtitle">{t('about.teamSubtitle')}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="uni-card text-center p-5">
                  <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gold-500/20">
                    {member.src ? (
                      <Image src={member.src} alt={member.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-navy-100 dark:bg-navy-800 text-navy-800 dark:text-white text-2xl font-bold">
                        {member.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-navy-900 dark:text-white">{member.name}</h3>
                  <p className="text-gold-500 text-sm font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t('about.missionTitle')}</h2>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto mb-8">{t('about.missionText')}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-4 rounded-2xl transition-all">
              {t('about.getInTouch')}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
