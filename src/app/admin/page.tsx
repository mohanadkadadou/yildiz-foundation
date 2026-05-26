import { prisma } from '@/lib/prisma'
import { GraduationCap, Users, Calendar, FileText, TrendingUp, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [uniCount, programCount, bookingCount, leadCount, recentBookings, recentLeads] = await Promise.all([
    prisma.university.count(),
    prisma.program.count(),
    prisma.booking.count(),
    prisma.lead.count(),
    prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  const stats = [
    { label: 'Universities', value: uniCount, icon: GraduationCap, color: 'bg-blue-50 text-blue-600', href: '/admin/universities' },
    { label: 'Programs', value: programCount, icon: BookOpen, color: 'bg-purple-50 text-purple-600', href: '/admin/programs' },
    { label: 'Bookings', value: bookingCount, icon: Calendar, color: 'bg-gold-50 text-gold-600', href: '/admin/bookings' },
    { label: 'Leads', value: leadCount, icon: Users, color: 'bg-emerald-50 text-emerald-600', href: '/admin/leads' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome to Yildiz Foundation Admin</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div><div className="text-2xl font-bold text-navy-900 dark:text-white">{s.value}</div><div className="text-gray-500 text-sm">{s.label}</div></div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <h2 className="font-bold text-navy-900 dark:text-white mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-navy-700">
                <div><div className="font-medium text-sm text-navy-900 dark:text-white">{b.firstName} {b.lastName}</div><div className="text-xs text-gray-400">{b.email}</div></div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <h2 className="font-bold text-navy-900 dark:text-white mb-4">Recent Leads</h2>
          <div className="space-y-3">
            {recentLeads.map(l => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-navy-700">
                <div><div className="font-medium text-sm text-navy-900 dark:text-white">{l.firstName} {l.lastName}</div><div className="text-xs text-gray-400">{l.country} • {l.majorInterest}</div></div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${l.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
