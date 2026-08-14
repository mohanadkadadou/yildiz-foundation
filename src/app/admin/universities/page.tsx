import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminUniversitiesPage() {
  const universities = await prisma.university.findMany({ orderBy: { ranking: 'asc' }, include: { _count: { select: { programs: true } } } })
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Universities ({universities.length})</h1>
        <Link href="/admin/universities/add" className="flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add University
        </Link>
      </div>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['#','Name','City','Type','Programs','Featured','Actions'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>{universities.map(u => (
            <tr key={u.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-700">
              <td className="py-3 px-4 text-gray-500">{u.ranking}</td>
              <td className="py-3 px-4 font-medium text-navy-900 dark:text-white">{u.nameEn}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.cityEn}</td>
              <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.type === 'PUBLIC' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{u.type}</span></td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u._count.programs}</td>
              <td className="py-3 px-4">{u.isFeatured ? '⭐' : '-'}</td>
              <td className="py-3 px-4 flex items-center gap-2">
                <Link href={"/universities/" + u.slug} target="_blank" className="text-blue-500 hover:underline text-xs">View</Link>
                <Link href={"/admin/universities/" + u.id + "/edit"} className="text-green-600 hover:underline text-xs">Edit</Link>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
