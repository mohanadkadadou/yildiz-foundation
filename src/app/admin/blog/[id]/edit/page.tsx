import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
  if (!post) notFound()

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Edit Post</h1>
      </div>
      <BlogPostForm
        mode="edit"
        id={post.id}
        initialData={{
          titleEn: post.titleEn, titleAr: post.titleAr, titleTr: post.titleTr,
          excerptEn: post.excerptEn, excerptAr: post.excerptAr, excerptTr: post.excerptTr,
          contentEn: post.contentEn, contentAr: post.contentAr, contentTr: post.contentTr,
          coverImage: post.coverImage || '', category: post.category, tags: post.tags.join(', '),
          published: post.published,
        }}
      />
    </div>
  )
}
export const dynamic = 'force-dynamic'
