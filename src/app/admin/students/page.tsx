import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { Mail, Phone, Globe } from 'lucide-react'

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { _count: { select: { bookings: true, applications: true, favorites: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Students</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{students.length} registered student{students.length === 1 ? '' : 's'}</p>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-navy-900">
              <tr>
                {['Name', 'Contact', 'Country', 'Registered', 'Bookings', 'Applications', 'Favorites'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-t border-gray-50 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
                  <td className="py-3 px-5 font-medium text-navy-900 dark:text-white whitespace-nowrap">{s.name || '—'}</td>
                  <td className="py-3 px-5 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{s.email}</div>
                    {s.phone && <div className="flex items-center gap-1.5 mt-0.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{s.phone}</div>}
                  </td>
                  <td className="py-3 px-5 text-gray-600 dark:text-gray-300">
                    {s.country ? <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400" />{s.country}</span> : '—'}
                  </td>
                  <td className="py-3 px-5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{format(new Date(s.createdAt), 'MMM d, yyyy')}</td>
                  <td className="py-3 px-5 text-gray-600 dark:text-gray-300">{s._count.bookings}</td>
                  <td className="py-3 px-5 text-gray-600 dark:text-gray-300">{s._count.applications}</td>
                  <td className="py-3 px-5 text-gray-600 dark:text-gray-300">{s._count.favorites}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {students.length === 0 && <div className="text-center py-16 text-gray-400">No registered students yet.</div>}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
