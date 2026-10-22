'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'

interface Post {
  slug: string; category: string; tags: string[]; createdAt: Date; coverImage: string | null
  titleEn: string; titleAr: string; titleTr: string
  excerptEn: string; excerptAr: string; excerptTr: string
  contentEn: string; contentAr: string; contentTr: string
}

export function BlogPostClient({ post }: { post: Post }) {
  const { t, locale } = useTranslations()
  const Back = locale === 'ar' ? ArrowRight : ArrowLeft
  const html = localize(post, 'content', locale)
  const minutes = Math.max(1, Math.round(html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length / 200))
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${localize(post, 'title', locale)} https://yildizeducation.com/blog/${post.slug}`)}`
  return (
    <article className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-12 px-4 mb-10">
        <div className="container mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-5"><Back className="w-4 h-4" />{t('blogPost.back')}</Link>
          <span className="inline-block bg-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{localize(post, 'title', locale)}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-blue-200 text-sm">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{t('blogPost.published')}: {format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{minutes} {t('blogPost.minRead')}</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-navy-800">
          {post.coverImage && <img src={post.coverImage} alt={localize(post, 'title', locale)} className="w-full max-h-[420px] object-cover rounded-2xl mb-8" />}
          <p className="text-lg font-medium text-navy-800 dark:text-blue-100 leading-relaxed mb-6 pb-6 border-b border-gray-100 dark:border-navy-800">{localize(post, 'excerpt', locale)}</p>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">{post.tags.map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 text-xs">#{tag}</span>)}</div>
          )}
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"><Share2 className="w-4 h-4" />{t('blogPost.share')}</a>
        </div>
        <div className="mt-8 bg-blue-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">{t('blogPost.ctaTitle')}</h2>
          <p className="text-blue-100 text-sm mb-5">{t('blogPost.ctaDesc')}</p>
          <Link href="/consultation" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"><CalendarIcon className="w-4 h-4" />{t('consultation.bookBtn')}</Link>
        </div>
      </div>
    </article>
  )
}
