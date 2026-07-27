import { prisma } from '@/lib/prisma'

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Leads ({leads.length})</h1>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Name','Email','Phone','Country','Budget','Major','Source','Status'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
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
              <td className="py-3 px-4"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{l.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
