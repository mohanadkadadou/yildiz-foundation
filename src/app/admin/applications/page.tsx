import Link from 'next/link'
import { format } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { Paperclip } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'WAITLISTED', 'ACCEPTED', 'REJECTED', 'DRAFT'] as const
const LABEL: Record<string, string> = { SUBMITTED: 'Submitted', UNDER_REVIEW: 'Under review', WAITLISTED: 'Waitlisted', ACCEPTED: 'Accepted', REJECTED: 'Rejected', DRAFT: 'Draft' }
const COLOR: Record<string, string> = { DRAFT: 'bg-gray-100 text-gray-600', SUBMITTED: 'bg-blue-100 text-blue-700', UNDER_REVIEW: 'bg-amber-100 text-amber-700', ACCEPTED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700', WAITLISTED: 'bg-purple-100 text-purple-700' }

export default async function AdminApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const filter = (STATUSES as readonly string[]).includes(status || '') ? status : undefined
  const [applications, counts] = await Promise.all([
    prisma.application.findMany({
      where: filter ? { status: filter as any } : {},
      include: { user: { select: { name: true, email: true, country: true } }, university: { select: { nameEn: true } }, program: { select: { nameEn: true } }, _count: { select: { files: true } } },
      orderBy: [{ updatedAt: 'desc' }], take: 200,
    }),
    prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
  ])
  const count = (s: string) => counts.find(c => c.status === s)?._count._all || 0
  const total = counts.reduce((a, c) => a + c._count._all, 0)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1">Applications</h1>
      <p className="text-sm text-gray-500 mb-6">Student applications with their uploaded documents. Open one to review, change its status and message the student.</p>
      <div className="flex flex-wrap gap-2 mb-5">
        <Link href="/admin/applications" className={`px-4 py-2 rounded-xl text-sm font-medium border ${!filter ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 hover:bg-gray-100 dark:border-navy-600'}`}>All ({total})</Link>
        {STATUSES.map(s => (
          <Link key={s} href={`/admin/applications?status=${s}`} className={`px-4 py-2 rounded-xl text-sm font-medium border ${filter === s ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 hover:bg-gray-100 dark:border-navy-600'}`}>{LABEL[s]} ({count(s)})</Link>
        ))}
      </div>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Student', 'University / Program', 'Status', 'Docs', 'Updated', ''].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>{applications.map(a => (
            <tr key={a.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-700">
              <td className="py-3 px-4"><div className="font-medium">{a.user.name || '—'}</div><div className="text-xs text-gray-500">{a.user.email}{a.user.country ? ` · ${a.user.country}` : ''}</div></td>
              <td className="py-3 px-4"><div>{a.university.nameEn}</div>{a.program && <div className="text-xs text-gray-500">{a.program.nameEn}</div>}{a.intake && <div className="text-xs text-gray-400">{a.intake}</div>}</td>
              <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${COLOR[a.status]}`}>{LABEL[a.status]}</span></td>
              <td className="py-3 px-4 text-gray-600"><span className="inline-flex items-center gap-1"><Paperclip className="w-3.5 h-3.5" />{a._count.files}</span></td>
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{format(new Date(a.updatedAt), 'MMM d, yyyy')}</td>
              <td className="py-3 px-4"><Link href={`/admin/applications/${a.id}`} className="text-blue-600 hover:underline font-medium">Review</Link></td>
            </tr>
          ))}</tbody>
        </table>
        {applications.length === 0 && <div className="text-center py-16 text-gray-400">No applications here yet.</div>}
      </div>
    </div>
  )
}
