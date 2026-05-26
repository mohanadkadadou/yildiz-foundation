'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface Post { id: string; slug: string; titleEn: string; excerptEn: string; category: string; coverImage: string | null; createdAt: Date }
interface Props { posts: Post[] }

export function BlogSection({ posts }: Props) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-navy-950">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-wider mb-3">Latest News</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">Education Insights</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">Guides, tips, and news about studying in Turkey</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {posts.map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-navy-800 hover:shadow-lg transition-all group">
              <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">📚</div>
                <div className="absolute top-3 left-3"><span className="bg-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span></div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3"><Calendar className="w-3 h-3" />{format(new Date(post.createdAt), 'MMM d, yyyy')}</div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-2 line-clamp-2 group-hover:text-navy-700">{post.titleEn}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{post.excerptEn}</p>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-navy-700 dark:text-blue-400 text-sm font-semibold hover:gap-2.5 transition-all">
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 border-2 border-navy-800 dark:border-blue-400 text-navy-800 dark:text-blue-400 hover:bg-navy-800 hover:text-white dark:hover:bg-blue-400 dark:hover:text-navy-900 font-semibold px-8 py-3.5 rounded-xl transition-all">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
