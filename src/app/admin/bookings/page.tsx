import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bookings ({bookings.length})</h1>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Name','Email','Phone','Country','Major','Date','Meeting','Status'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>{bookings.map(b => (
            <tr key={b.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-700">
              <td className="py-3 px-4 font-medium">{b.firstName} {b.lastName}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{b.email}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{b.phone}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{b.country}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{b.majorInterest || '-'}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{format(new Date(b.preferredDate), 'MMM d, yyyy')}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{b.meetingType}</td>
              <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{b.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
