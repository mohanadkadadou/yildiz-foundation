import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Globe, Users, Calendar, Star, BookOpen, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const uni = await prisma.university.findUnique({ where: { slug: params.slug } })
  if (!uni) return { title: 'University Not Found' }
  return { title: `${uni.nameEn} | Yildiz Foundation`, description: uni.descriptionEn.slice(0, 160) }
}

export default async function UniversityDetailPage({ params }: { params: { slug: string } }) {
  const uni = await prisma.university.findUnique({
    where: { slug: params.slug },
    include: { programs: { orderBy: { tuitionFeeUSD: 'asc' } }, scholarships: true, requirements: true },
  })
  if (!uni) notFound()

  const images = [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80',
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <Navbar />
      {/* Hero */}
      <div className="relative h-80 md:h-[420px] overflow-hidden">
        <img src={images[0]} alt={uni.nameEn} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 container mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${uni.type === 'PUBLIC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{uni.type}</span>
                {uni.ranking && <span className="bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-white" />#{uni.ranking} in Turkey</span>}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">{uni.nameEn}</h1>
              <div className="flex items-center gap-2 text-white/80 mt-2"><MapPin className="w-4 h-4" />{uni.cityEn}, Turkey</div>
            </div>
            {uni.website && (
              <a href={uni.website} target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-colors text-sm">
                <Globe className="w-4 h-4" /> Visit Website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">About {uni.nameEn}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{uni.descriptionEn}</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {uni.establishedYear && <div className="text-center p-3 bg-gray-50 dark:bg-navy-800 rounded-xl"><Calendar className="w-5 h-5 text-navy-600 mx-auto mb-1" /><div className="font-bold text-navy-900 dark:text-white">{uni.establishedYear}</div><div className="text-xs text-gray-400">Founded</div></div>}
                {uni.totalStudents && <div className="text-center p-3 bg-gray-50 dark:bg-navy-800 rounded-xl"><Users className="w-5 h-5 text-navy-600 mx-auto mb-1" /><div className="font-bold text-navy-900 dark:text-white">{(uni.totalStudents/1000).toFixed(0)}k+</div><div className="text-xs text-gray-400">Students</div></div>}
                <div className="text-center p-3 bg-gray-50 dark:bg-navy-800 rounded-xl"><BookOpen className="w-5 h-5 text-navy-600 mx-auto mb-1" /><div className="font-bold text-navy-900 dark:text-white">{uni.programs.length}</div><div className="text-xs text-gray-400">Programs</div></div>
              </div>
            </div>

            {/* Programs */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-5">Available Programs</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100 dark:border-navy-700">
                    {['Program', 'Degree', 'Language', 'Duration', 'Tuition/Year'].map(h => <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>{uni.programs.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-navy-800 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
                      <td className="py-3 px-3 font-medium text-navy-900 dark:text-white">{p.nameEn}</td>
                      <td className="py-3 px-3"><span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">{p.degreeType}</span></td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300 capitalize">{p.language.replace('_', '+')}</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{p.duration}yr</td>
                      <td className="py-3 px-3 font-semibold text-gold-600">${p.tuitionFeeUSD.toLocaleString()}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            {/* Requirements */}
            {uni.requirements.length > 0 && (
              <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-navy-800">
                <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Admission Requirements</h2>
                <ul className="space-y-2">
                  {uni.requirements.map(r => <li key={r.id} className="flex items-start gap-2 text-gray-600 dark:text-gray-300"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />{r.textEn}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick apply */}
            <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Apply Now</h3>
              <p className="text-blue-100 text-sm mb-4">Get expert guidance for your application</p>
              <Link href="/consultation" className="block text-center bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl transition-colors mb-3">Book Free Consultation</Link>
              <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer" className="block text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors text-sm">WhatsApp Us</a>
            </div>

            {/* Scholarships */}
            {uni.scholarships.length > 0 && (
              <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800">
                <h3 className="font-bold text-navy-900 dark:text-white mb-4">Scholarships</h3>
                <div className="space-y-3">
                  {uni.scholarships.map(s => (
                    <div key={s.id} className="p-3 bg-gold-50 dark:bg-gold-900/10 rounded-xl border border-gold-200 dark:border-gold-800">
                      <div className="font-semibold text-sm text-gold-700 dark:text-gold-400">{s.nameEn} {s.percentage && <span>({s.percentage}% off)</span>}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{s.descEn}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
