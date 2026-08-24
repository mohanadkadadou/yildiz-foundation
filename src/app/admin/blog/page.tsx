import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PublishToggle, BlogDeleteButton } from './BlogActions'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts ({posts.length})</h1>
        <Link href="/admin/blog/new" className="flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Title','Category','Published','Views','Date','Actions'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>{posts.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-700">
              <td className="py-3 px-4 font-medium max-w-xs truncate">{p.titleEn}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{p.category}</td>
              <td className="py-3 px-4"><PublishToggle id={p.id} published={p.published} /></td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{p.views}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{format(new Date(p.createdAt), 'MMM d, yyyy')}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Link href={`/blog/${p.slug}`} target="_blank" className="text-blue-500 hover:underline text-xs">View</Link>
                  <Link href={`/admin/blog/${p.id}/edit`} className="text-green-600 hover:underline text-xs">Edit</Link>
                  <BlogDeleteButton id={p.id} />
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {posts.length === 0 && <div className="text-center py-16 text-gray-400">No blog posts yet.</div>}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
