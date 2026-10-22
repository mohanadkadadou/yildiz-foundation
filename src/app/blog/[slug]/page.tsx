import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogPostClient } from './BlogPostClient'
import { toSafeHtml } from '@/lib/sanitize-content'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post || !post.published) return { title: 'Article Not Found' }
  return {
    title: post.titleEn,
    description: post.excerptEn.slice(0, 160),
    openGraph: { title: post.titleEn, description: post.excerptEn.slice(0, 160), type: 'article', ...(post.coverImage ? { images: [post.coverImage] } : {}) },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post || !post.published) notFound()
  const { views, contentEn, contentAr, contentTr, ...rest } = post
  const safe = { ...rest, contentEn: toSafeHtml(contentEn), contentAr: toSafeHtml(contentAr), contentTr: toSafeHtml(contentTr) }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <BlogPostClient post={safe} />
      <Footer />
    </div>
  )
}
