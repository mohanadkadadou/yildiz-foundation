'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, MapPin, Star, Users, BookOpen, Heart, ArrowRight, SlidersHorizontal, X } from 'lucide-react'

interface University {
  id: string; slug: string; nameEn: string; cityEn: string; type: string; ranking: number | null;
  descriptionEn: string; totalStudents: number | null; isFeatured: boolean;
  programs: Array<{ tuitionFeeUSD: number; degreeType: string }>;
  _count: { programs: number }
}

const uniImages = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
]

export function UniversitiesClient({ universities, cities }: { universities: University[]; cities: string[] }) {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [maxFee, setMaxFee] = useState(20000)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => universities.filter(u => {
    if (q && !u.nameEn.toLowerCase().includes(q.toLowerCase()) && !u.cityEn.toLowerCase().includes(q.toLowerCase())) return false
    if (city && u.cityEn !== city) return false
    if (type && u.type !== type) return false
    const minFee = u.programs.length ? Math.min(...u.programs.map(p => p.tuitionFeeUSD)) : 0
    if (minFee > maxFee) return false
    return true
  }), [universities, q, city, type, maxFee])

  const clearFilters = () => { setQ(''); setCity(''); setType(''); setMaxFee(20000) }

  return (
    <div className="pt-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Turkish Universities</h1>
          <p className="text-blue-100 text-lg mb-8">Find your perfect university from {universities.length}+ institutions</p>
          <div className="max-w-2xl mx-auto flex gap-3">
            <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4">
              <Search className="w-5 h-5 text-white/50 mr-3" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search universities..." className="flex-1 bg-transparent py-4 text-white placeholder:text-white/40 outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="bg-white/10 border border-white/20 text-white px-5 rounded-2xl flex items-center gap-2 hover:bg-white/20 transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
          {showFilters && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mt-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              <select value={city} onChange={e => setCity(e.target.value)} className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm outline-none">
                <option value="" className="text-gray-900">All Cities</option>
                {cities.map(c => <option key={c} value={c} className="text-gray-900">{c}</option>)}
              </select>
              <select value={type} onChange={e => setType(e.target.value)} className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm outline-none">
                <option value="" className="text-gray-900">All Types</option>
                <option value="PUBLIC" className="text-gray-900">Public</option>
                <option value="PRIVATE" className="text-gray-900">Private</option>
              </select>
              <div className="col-span-2 flex items-center gap-3">
                <span className="text-white/70 text-xs whitespace-nowrap">Max Fee: ${maxFee.toLocaleString()}</span>
                <input type="range" min={2000} max={20000} step={500} value={maxFee} onChange={e => setMaxFee(Number(e.target.value))} className="flex-1 accent-gold-400" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">{filtered.length} universities found</p>
          {(q || city || type) && <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700"><X className="w-4 h-4" /> Clear Filters</button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((uni, i) => {
            const minFee = uni.programs.length ? Math.min(...uni.programs.map(p => p.tuitionFeeUSD)) : null
            return (
              <motion.div key={uni.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-navy-800 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="relative h-44 overflow-hidden">
                  <img src={uniImages[i % uniImages.length]} alt={uni.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${uni.type === 'PUBLIC' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{uni.type === 'PUBLIC' ? '🏛️ Public' : '🎓 Private'}</span>
                  </div>
                  <button onClick={() => setFavorites(prev => { const n = new Set(prev); n.has(uni.id) ? n.delete(uni.id) : n.add(uni.id); return n })}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
                    <Heart className={`w-4 h-4 ${favorites.has(uni.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  {uni.ranking && <div className="absolute bottom-3 left-3 bg-gold-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-white" />#{uni.ranking}</div>}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy-900 dark:text-white mb-1 line-clamp-1">{uni.nameEn}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3"><MapPin className="w-3.5 h-3.5" />{uni.cityEn}</div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">{uni.descriptionEn}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><BookOpen className="w-4 h-4 text-navy-500" />{uni._count.programs} Programs</div>
                    {uni.totalStudents && <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><Users className="w-4 h-4 text-navy-500" />{(uni.totalStudents/1000).toFixed(0)}k</div>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>{minFee && <><span className="text-xs text-gray-400">From </span><span className="font-bold text-navy-900 dark:text-white">${minFee.toLocaleString()}<span className="text-xs font-normal text-gray-400">/yr</span></span></>}</div>
                    <Link href={`/universities/${uni.slug}`} className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
