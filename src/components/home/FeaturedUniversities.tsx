'use client'
// src/components/home/FeaturedUniversities.tsx
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Users, Star, BookOpen, ArrowRight, Heart } from 'lucide-react'
import { useState } from 'react'

interface University {
  id: string
  slug: string
  nameEn: string
  city: string
  type: string
  ranking: number | null
  descriptionEn: string
  programs: Array<{ tuitionFeeUSD: number }>
  totalStudents: number | null
  isFeatured: boolean
}

interface Props {
  universities: University[]
}

export function FeaturedUniversities({ universities }: Props) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const minFee = (programs: Array<{ tuitionFeeUSD: number }>) => {
    if (!programs.length) return null
    return Math.min(...programs.map(p => p.tuitionFeeUSD))
  }

  const universityImages: Record<string, string> = {
    'istanbul-university': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    'middle-east-technical-university': 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    'bogazici-university': 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
    'istanbul-technical-university': 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
    'sabanci-university': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    'koc-university': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-navy-950">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Top Institutions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">
            Featured Universities
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Discover Turkey&apos;s most prestigious institutions offering world-class education
          </p>
        </motion.div>

        {/* University cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {universities.map((uni, i) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-navy-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-navy-800"
            >
              {/* Cover image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={universityImages[uni.slug] || universityImages.default}
                  alt={uni.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    uni.type === 'PUBLIC'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {uni.type === 'PUBLIC' ? 'Public' : 'Private'}
                  </span>
                </div>

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(uni.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${favorites.has(uni.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>

                {/* Ranking */}
                {uni.ranking && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-gold-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-white" />
                    #{uni.ranking} in Turkey
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-bold text-navy-900 dark:text-white text-lg mb-2 group-hover:text-navy-700 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
                  {uni.nameEn}
                </h3>
                
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{uni.city}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                  {uni.descriptionEn}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-4 h-4 text-navy-600 dark:text-blue-400" />
                    <span>{uni.programs.length} Programs</span>
                  </div>
                  {uni.totalStudents && (
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 text-navy-600 dark:text-blue-400" />
                      <span>{(uni.totalStudents / 1000).toFixed(0)}k Students</span>
                    </div>
                  )}
                </div>

                {/* Fee & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    {minFee(uni.programs) && (
                      <>
                        <span className="text-xs text-gray-400">From</span>
                        <div className="text-lg font-bold text-navy-900 dark:text-white">
                          ${minFee(uni.programs)?.toLocaleString()}<span className="text-sm font-normal text-gray-400">/yr</span>
                        </div>
                      </>
                    )}
                  </div>
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 border-2 border-navy-800 dark:border-blue-400 text-navy-800 dark:text-blue-400 hover:bg-navy-800 hover:text-white dark:hover:bg-blue-400 dark:hover:text-navy-900 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
          >
            View All Universities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
