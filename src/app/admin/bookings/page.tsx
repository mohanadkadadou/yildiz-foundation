import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { StatusSelect } from '@/components/admin/StatusSelect'
import { BookingDeleteButton } from './BookingDeleteButton'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700', COMPLETED: 'bg-green-100 text-green-700',
}
const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bookings ({bookings.length})</h1>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Name','Email','Phone','Country','Major','Date','Meeting','Status',''].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
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
              <td className="py-3 px-4"><StatusSelect endpoint={`/api/admin/bookings/${b.id}`} field="status" value={b.status} options={STATUSES} colors={STATUS_COLORS} /></td>
              <td className="py-3 px-4"><BookingDeleteButton id={b.id} /></td>
            </tr>
          ))}</tbody>
        </table>
        {bookings.length === 0 && <div className="text-center py-16 text-gray-400">No bookings yet.</div>}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
