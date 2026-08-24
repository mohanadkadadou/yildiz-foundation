'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminFetch } from '@/lib/admin-fetch'

export interface UniversityFormData {
  nameEn: string; nameAr: string; nameTr: string
  cityEn: string; cityAr: string; cityTr: string
  type: string; ranking: string; website: string
  logoUrl: string; coverImageUrl: string
  descriptionEn: string; descriptionAr: string; descriptionTr: string
  establishedYear: string; totalStudents: string; internationalStudents: string
  isFeatured: boolean; isActive: boolean
}

const emptyForm: UniversityFormData = {
  nameEn: '', nameAr: '', nameTr: '',
  cityEn: '', cityAr: '', cityTr: '',
  type: 'PUBLIC', ranking: '', website: '',
  logoUrl: '', coverImageUrl: '',
  descriptionEn: '', descriptionAr: '', descriptionTr: '',
  establishedYear: '', totalStudents: '', internationalStudents: '',
  isFeatured: false, isActive: true,
}

interface Props {
  mode: 'create' | 'edit'
  id?: string
  initialData?: Partial<UniversityFormData>
}

export function UniversityForm({ mode, id, initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<UniversityFormData>({ ...emptyForm, ...initialData })

  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...form,
      city: form.cityEn.toLowerCase(),
      ranking: form.ranking ? Number(form.ranking) : null,
      establishedYear: form.establishedYear ? Number(form.establishedYear) : null,
      totalStudents: form.totalStudents ? Number(form.totalStudents) : null,
      internationalStudents: form.internationalStudents ? Number(form.internationalStudents) : null,
    }

    if (mode === 'create') {
      const { ok, data } = await adminFetch('/api/admin/universities', { body: payload, errorMessage: 'Failed to add university' })
      if (ok) { toast.success('University added! Now add its programs below.'); router.push(`/admin/universities/${data.id}/edit`) }
    } else {
      const { ok } = await adminFetch(`/api/admin/universities/${id}`, { method: 'PATCH', body: payload, successMessage: 'University updated', errorMessage: 'Failed to update university' })
      if (ok) router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
        <h2 className="font-bold text-lg mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[['nameEn','Name (English)'],['nameAr','Name (Arabic)'],['nameTr','Name (Turkish)'],['cityEn','City (English)'],['cityAr','City (Arabic)'],['cityTr','City (Turkish)'],['ranking','Ranking'],['website','Website URL'],['establishedYear','Established Year'],['totalStudents','Total Students'],['internationalStudents','International Students']].map(([k,l]) => (
            <div key={k}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{l}</label>
              <input value={(form as any)[k]} onChange={e => update(k, e.target.value)}
                className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)}
              className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={form.isFeatured} onChange={e => update('isFeatured', e.target.checked)} className="w-4 h-4" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={form.isActive} onChange={e => update('isActive', e.target.checked)} className="w-4 h-4" />
              Active (visible on site)
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
        <h2 className="font-bold text-lg mb-4">Images (URL)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Logo URL</label>
            <input value={form.logoUrl} onChange={e => update('logoUrl', e.target.value)} placeholder="https://example.com/logo.png"
              className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
            {form.logoUrl && <img src={form.logoUrl} alt="logo preview" className="mt-2 h-16 object-contain rounded-lg border" />}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Cover Image URL</label>
            <input value={form.coverImageUrl} onChange={e => update('coverImageUrl', e.target.value)} placeholder="https://example.com/cover.jpg"
              className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
            {form.coverImageUrl && <img src={form.coverImageUrl} alt="cover preview" className="mt-2 h-20 w-full object-cover rounded-lg border" />}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
        <h2 className="font-bold text-lg mb-4">Descriptions</h2>
        <div className="space-y-4">
          {[['descriptionEn','Description (English)','ltr'],['descriptionAr','Description (Arabic)','rtl'],['descriptionTr','Description (Turkish)','ltr']].map(([k,l,dir]) => (
            <div key={k}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{l}</label>
              <textarea value={(form as any)[k]} onChange={e => update(k, e.target.value)} rows={3} dir={dir}
                className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-navy-700 text-gray-900 dark:text-white resize-none" />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : mode === 'create' ? '+ Add University' : 'Save Changes'}
      </button>
    </form>
  )
}
