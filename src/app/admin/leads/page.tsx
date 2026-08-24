import { prisma } from '@/lib/prisma'
import { StatusSelect } from '@/components/admin/StatusSelect'
import { LeadDeleteButton } from './LeadDeleteButton'

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700', CONTACTED: 'bg-yellow-100 text-yellow-700',
  QUALIFIED: 'bg-purple-100 text-purple-700', CONVERTED: 'bg-green-100 text-green-700', LOST: 'bg-gray-100 text-gray-600',
}
const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Leads ({leads.length})</h1>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Name','Email','Phone','Country','Budget','Major','Source','Status',''].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>{leads.map(l => (
            <tr key={l.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-700">
              <td className="py-3 px-4 font-medium">{l.firstName} {l.lastName}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{l.email}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{l.phone}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{l.country}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{l.budget ? "$"+l.budget : '-'}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{l.majorInterest || '-'}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{l.source}</td>
              <td className="py-3 px-4"><StatusSelect endpoint={`/api/admin/leads/${l.id}`} field="status" value={l.status} options={STATUSES} colors={STATUS_COLORS} /></td>
              <td className="py-3 px-4"><LeadDeleteButton id={l.id} /></td>
            </tr>
          ))}</tbody>
        </table>
        {leads.length === 0 && <div className="text-center py-16 text-gray-400">No leads yet.</div>}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
