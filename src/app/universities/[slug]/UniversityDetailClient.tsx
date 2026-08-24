'use client'
import Link from 'next/link'
import { MapPin, Globe, Users, Calendar, Star, BookOpen, CheckCircle, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'

interface Program { id: string; nameEn: string; nameAr: string; nameTr: string; degreeType: string; language: string; duration: number; tuitionFeeUSD: number }
interface Scholarship { id: string; nameEn: string; nameAr: string; nameTr: string; descEn: string; descAr: string; descTr: string; percentage: number | null }
interface Requirement { id: string; textEn: string; textAr: string; textTr: string }
interface University {
  nameEn: string; nameAr: string; nameTr: string
  cityEn: string; cityAr: string; cityTr: string
  descriptionEn: string; descriptionAr: string; descriptionTr: string
  type: string; ranking: number | null; establishedYear: number | null; totalStudents: number | null
  website: string | null; coverImageUrl: string | null
  programs: Program[]; scholarships: Scholarship[]; requirements: Requirement[]
}

export function UniversityDetailClient({ uni, isCyprus }: { uni: University; isCyprus: boolean }) {
  const { t, locale } = useTranslations()
  const country = isCyprus ? t('universities.northernCyprus') : t('universities.turkey')

  const images = [
    uni.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
  ]

  return (
    <>
      <div className="relative h-80 md:h-[420px] overflow-hidden">
        <img src={images[0]} alt={localize(uni, 'name', locale)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 container mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${uni.type === 'PUBLIC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{uni.type === 'PUBLIC' ? t('universities.public') : t('universities.private')}</span>
                {uni.ranking && <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-white" />#{uni.ranking} {t('universities.rankingSuffix')} {country}</span>}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">{localize(uni, 'name', locale)}</h1>
              <div className="flex items-center gap-2 text-white/80 mt-2"><MapPin className="w-4 h-4" />{localize(uni, 'city', locale)}, {country}</div>
            </div>
            {uni.website && (
              <a href={uni.website} target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-colors text-sm">
                <Globe className="w-4 h-4" /> {t('universities.visitWebsite')} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-4">{t('universities.about')} {localize(uni, 'name', locale)}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{localize(uni, 'description', locale)}</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {uni.establishedYear && <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"><Calendar className="w-5 h-5 mx-auto mb-1" /><div className="font-bold">{uni.establishedYear}</div><div className="text-xs text-gray-400">{t('universities.founded')}</div></div>}
                {uni.totalStudents && <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"><Users className="w-5 h-5 mx-auto mb-1" /><div className="font-bold">{(uni.totalStudents/1000).toFixed(0)}k+</div><div className="text-xs text-gray-400">{t('universities.students')}</div></div>}
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"><BookOpen className="w-5 h-5 mx-auto mb-1" /><div className="font-bold">{uni.programs.length}</div><div className="text-xs text-gray-400">{t('universities.programs')}</div></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-5">{t('universities.availablePrograms')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                    {[t('universities.program'), t('programs.degree'), t('programs.language'), t('programs.duration'), t('programs.tuition')].map(h => <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>{uni.programs.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="py-3 px-3 font-medium">{localize(p, 'name', locale)}</td>
                      <td className="py-3 px-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{p.degreeType}</span></td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300 capitalize">{p.language.replace('_', '+')}</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{p.duration}yr</td>
                      <td className="py-3 px-3 font-semibold text-yellow-600">${p.tuitionFeeUSD.toLocaleString()}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            {uni.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-4">{t('universities.admissionRequirements')}</h2>
                <ul className="space-y-2">
                  {uni.requirements.map(r => <li key={r.id} className="flex items-start gap-2 text-gray-600 dark:text-gray-300"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />{localize(r, 'text', locale)}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-blue-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">{t('universities.apply')}</h3>
              <p className="text-blue-100 text-sm mb-4">{t('universities.getGuidance')}</p>
              <Link href="/consultation" className="block text-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-colors mb-3">{t('consultation.bookBtn')}</Link>
              <a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer" className="block text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors text-sm">{t('consultation.whatsappUs')}</a>
            </div>

            {uni.scholarships.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold mb-4">{t('universities.scholarships')}</h3>
                <div className="space-y-3">
                  {uni.scholarships.map(s => (
                    <div key={s.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <div className="font-semibold text-sm text-yellow-700 dark:text-yellow-400">{localize(s, 'name', locale)} {s.percentage && <span>({s.percentage}%)</span>}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{localize(s, 'desc', locale)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
