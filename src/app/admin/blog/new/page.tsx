import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">New Blog Post</h1>
      </div>
      <BlogPostForm mode="create" />
    </div>
  )
}
