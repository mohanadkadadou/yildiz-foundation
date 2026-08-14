import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default async function InquiriesPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Inquiries ({bookings.length + leads.length})</h1>
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700 flex items-start justify-between">
            <div>
              <div className="font-semibold text-navy-900 dark:text-white">{b.firstName} {b.lastName}</div>
              <div className="text-sm text-gray-500">{b.email} · {b.phone}</div>
              <div className="text-sm text-gray-500 mt-1">{b.country} · {b.majorInterest || 'No major specified'}</div>
              <div className="text-xs text-gray-400 mt-1">{format(new Date(b.createdAt), 'MMM d, yyyy HH:mm')}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">Booking</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{b.status}</span>
              <span className="text-xs text-gray-400">{b.meetingType}</span>
            </div>
          </div>
        ))}
        {leads.map(l => (
          <div key={l.id} className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700 flex items-start justify-between">
            <div>
              <div className="font-semibold text-navy-900 dark:text-white">{l.firstName} {l.lastName}</div>
              <div className="text-sm text-gray-500">{l.email} · {l.phone}</div>
              <div className="text-sm text-gray-500 mt-1">{l.country} {l.budget ? `· $${l.budget} budget` : ''}</div>
              <div className="text-xs text-gray-400 mt-1">{format(new Date(l.createdAt), 'MMM d, yyyy HH:mm')}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Lead</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">{l.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
