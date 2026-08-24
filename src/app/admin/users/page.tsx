import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { UserRow } from './UserRow'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  const adminCount = users.filter(u => u.role === 'ADMIN').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Admin Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Staff accounts with dashboard access</p>
        </div>
        <Link href="/admin/users/new" className="flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New User
        </Link>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-navy-900">
            <tr>
              {['Name', 'Email', 'Role', 'Created', ''].map(h => <th key={h} className="text-left py-3 px-5 text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <UserRow
                key={u.id}
                user={u}
                createdLabel={format(new Date(u.createdAt), 'MMM d, yyyy')}
                isSelf={u.id === (session?.user as any)?.id}
                isLastAdmin={u.role === 'ADMIN' && adminCount <= 1}
              />
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="text-center py-16 text-gray-400">No users yet.</div>}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
