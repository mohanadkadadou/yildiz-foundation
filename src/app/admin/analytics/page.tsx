import { prisma } from '@/lib/prisma'
import { Users, GraduationCap, Calendar, FileText, TrendingUp, BookOpen } from 'lucide-react'

export default async function AnalyticsPage() {
  const [uniCount, programCount, bookingCount, leadCount, publishedPosts, pendingBookings] = await Promise.all([
    prisma.university.count(),
    prisma.program.count(),
    prisma.booking.count(),
    prisma.lead.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
  ])

  const bookingsByMeeting = await prisma.booking.groupBy({ by: ['meetingType'], _count: true })
  const leadsBySource = await prisma.lead.groupBy({ by: ['source'], _count: true })
  const leadsByStatus = await prisma.lead.groupBy({ by: ['status'], _count: true })

  const stats = [
    { label: 'Total Universities', value: uniCount, icon: GraduationCap, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Programs', value: programCount, icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Bookings', value: bookingCount, icon: Calendar, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Leads', value: leadCount, icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Bookings', value: pendingBookings, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
    { label: 'Published Posts', value: publishedPosts, icon: FileText, color: 'bg-rose-50 text-rose-600' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700">
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div className="text-3xl font-bold text-navy-900 dark:text-white">{s.value}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <h2 className="font-bold mb-4">Bookings by Meeting Type</h2>
          <div className="space-y-3">
            {bookingsByMeeting.map(b => (
              <div key={b.meetingType} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{b.meetingType}</span>
                <span className="font-bold">{b._count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <h2 className="font-bold mb-4">Leads by Source</h2>
          <div className="space-y-3">
            {leadsBySource.map(l => (
              <div key={l.source} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{l.source}</span>
                <span className="font-bold">{l._count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <h2 className="font-bold mb-4">Leads by Status</h2>
          <div className="space-y-3">
            {leadsByStatus.map(l => (
              <div key={l.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{l.status}</span>
                <span className="font-bold">{l._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
