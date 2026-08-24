import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { BlogClient } from './BlogClient'

export const metadata: Metadata = { title: 'Blog | Study in Turkey', description: 'Guides and tips for studying in Turkey.' }

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <BlogClient posts={posts} />
      <Footer />
    </div>
  )
}
export const dynamic = 'force-dynamic'
