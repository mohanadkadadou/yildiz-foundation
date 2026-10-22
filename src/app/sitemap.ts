import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://yildizeducation.com'
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [universities, programs, posts] = await Promise.all([
    prisma.university.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.program.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])
  const staticPaths = ['', '/universities', '/government-universities', '/programs', '/courses', '/scholarships', '/blog', '/about', '/album', '/social-media', '/contact', '/consultation', '/privacy', '/terms']
  return [
    ...staticPaths.map(p => ({ url: `${SITE}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...universities.map(u => ({ url: `${SITE}/universities/${u.slug}`, lastModified: u.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...programs.map(p => ({ url: `${SITE}/programs/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...posts.map(b => ({ url: `${SITE}/blog/${b.slug}`, lastModified: b.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
