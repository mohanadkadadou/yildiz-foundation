import { prisma } from '@/lib/prisma'

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({ orderBy: { createdAt: 'desc' }, include: { university: { select: { nameEn: true } } } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Programs ({programs.length})</h1>
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 dark:bg-navy-900">
            {['Program','University','Degree','Language','Duration','Tuition'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>{programs.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-700">
              <td className="py-3 px-4 font-medium">{p.nameEn}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{p.university.nameEn}</td>
              <td className="py-3 px-4"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{p.degreeType}</span></td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{p.language}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{p.duration}yr</td>
              <td className="py-3 px-4 font-semibold text-yellow-600">${p.tuitionFeeUSD.toLocaleString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
