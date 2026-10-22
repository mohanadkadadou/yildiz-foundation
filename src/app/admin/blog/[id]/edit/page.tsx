import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogPostForm } from '@/components/admin/BlogPostForm'
import { toSafeHtml } from '@/lib/sanitize-content'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <div className="p-8 max-w-7xl">
      <BlogPostForm
        mode="edit"
        id={post.id}
        initialData={{
          slug: post.slug,
          titleEn: post.titleEn, titleAr: post.titleAr, titleTr: post.titleTr,
          excerptEn: post.excerptEn, excerptAr: post.excerptAr, excerptTr: post.excerptTr,
          contentEn: toSafeHtml(post.contentEn), contentAr: toSafeHtml(post.contentAr), contentTr: toSafeHtml(post.contentTr),
          coverImage: post.coverImage || '', category: post.category, tags: post.tags,
          published: post.published,
        }}
      />
    </div>
  )
}
export const dynamic = 'force-dynamic'
