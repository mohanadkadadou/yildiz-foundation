import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogPostClient } from './BlogPostClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post || !post.published) return { title: 'Article Not Found' }
  return { title: post.titleEn, description: post.excerptEn.slice(0, 160) }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post || !post.published) notFound()
  const { views, ...rest } = post
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <BlogPostClient post={rest} />
      <Footer />
    </div>
  )
}
