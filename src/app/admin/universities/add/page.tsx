'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AddUniversityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nameEn: '', nameAr: '', nameTr: '',
    cityEn: '', cityAr: '', cityTr: '', city: '',
    type: 'PUBLIC', ranking: '', website: '',
    descriptionEn: '', descriptionAr: '', descriptionTr: '',
    establishedYear: '', totalStudents: '', internationalStudents: '',
    isFeatured: false,
  })

  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          city: form.cityEn.toLowerCase(),
          ranking: form.ranking ? Number(form.ranking) : null,
          establishedYear: form.establishedYear ? Number(form.establishedYear) : null,
          totalStudents: form.totalStudents ? Number(form.totalStudents) : null,
          internationalStudents: form.internationalStudents ? Number(form.internationalStudents) : null,
        }),
      })
      if (res.ok) {
        toast.success('University added successfully!')
        router.push('/admin/universities')
      } else {
        toast.error('Failed to add university')
      }
    } catch {
      toast.error('Error occurred')
    }
    setLoading(false)
  }

  const fields = [
    ['nameEn', 'University Name (English)', 'text'],
    ['nameAr', 'University Name (Arabic)', 'text'],
    ['nameTr', 'University Name (Turkish)', 'text'],
    ['cityEn', 'City (English)', 'text'],
    ['cityAr', 'City (Arabic)', 'text'],
    ['cityTr', 'City (Turkish)', 'text'],
    ['ranking', 'Ranking', 'number'],
    ['website', 'Website URL', 'url'],
    ['establishedYear', 'Established Year', 'number'],
    ['totalStudents', 'Total Students', 'number'],
    ['internationalStudents', 'International Students', 'number'],
  ]

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/universities" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Add New University</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(([key, label, type]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
              <input type={type} value={(form as any)[key]} onChange={e => update(key, e.target.value)}
                className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)}
              className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white">
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => update('isFeatured', e.target.checked)} className="w-4 h-4 accent-navy-600" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured University</label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description (English)</label>
          <textarea value={form.descriptionEn} onChange={e => update('descriptionEn', e.target.value)} rows={3}
            className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description (Arabic)</label>
          <textarea value={form.descriptionAr} onChange={e => update('descriptionAr', e.target.value)} rows={3} dir="rtl"
            className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description (Turkish)</label>
          <textarea value={form.descriptionTr} onChange={e => update('descriptionTr', e.target.value)} rows={3}
            className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white resize-none" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : '+ Add University'}
        </button>
      </form>
    </div>
  )
}
