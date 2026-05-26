import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog | Study in Turkey', description: 'Guides and tips for studying in Turkey.' }

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-10">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Education Blog</h1>
            <p className="text-blue-100 text-lg">Guides, tips, and news about studying in Turkey</p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <article key={post.id} className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-navy-800 hover:shadow-lg transition-all group">
                <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-600 relative flex items-center justify-center">
                  <span className="text-6xl opacity-30">📚</span>
                  <div className="absolute top-3 left-3"><span className="bg-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2"><Calendar className="w-3 h-3" />{format(new Date(post.createdAt), 'MMM d, yyyy')}</div>
                  <h2 className="font-bold text-navy-900 dark:text-white mb-2 line-clamp-2 group-hover:text-navy-700">{post.titleEn}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{post.excerptEn}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-navy-700 dark:text-blue-400 text-sm font-semibold hover:gap-2.5 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {posts.length === 0 && <div className="text-center py-20 text-gray-400">No blog posts yet. Check back soon!</div>}
        </div>
      </div>
      <Footer />
    </div>
  )
}
