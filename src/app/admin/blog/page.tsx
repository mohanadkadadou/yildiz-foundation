import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Blog Posts ({posts.length})</h1>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Title','Category','Published','Views','Date'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>{posts.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-700">
              <td className="py-3 px-4 font-medium max-w-xs truncate">{p.titleEn}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{p.category}</td>
              <td className="py-3 px-4">{p.published ? <span className="text-green-500">✓ Yes</span> : <span className="text-gray-400">Draft</span>}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{p.views}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{format(new Date(p.createdAt), 'MMM d, yyyy')}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
