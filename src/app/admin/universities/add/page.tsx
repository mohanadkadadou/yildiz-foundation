'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AddUniversityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [programs, setPrograms] = useState([{ nameEn: '', degreeType: 'BACHELOR', language: 'ENGLISH', tuitionFeeUSD: '', duration: '4', category: 'Engineering' }])
  const [form, setForm] = useState({
    nameEn: '', nameAr: '', nameTr: '',
    cityEn: '', cityAr: '', cityTr: '',
    type: 'PUBLIC', ranking: '', website: '',
    logoUrl: '', coverImageUrl: '',
    descriptionEn: '', descriptionAr: '', descriptionTr: '',
    establishedYear: '', totalStudents: '', internationalStudents: '',
    isFeatured: false,
  })

  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const addProgram = () => setPrograms(p => [...p, { nameEn: '', degreeType: 'BACHELOR', language: 'ENGLISH', tuitionFeeUSD: '', duration: '4', category: 'Engineering' }])
  const removeProgram = (i: number) => setPrograms(p => p.filter((_, idx) => idx !== i))
  const updateProgram = (i: number, k: string, v: string) => setPrograms(p => p.map((prog, idx) => idx === i ? { ...prog, [k]: v } : prog))

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
          programs: programs.filter(p => p.nameEn).map(p => ({ ...p, tuitionFeeUSD: Number(p.tuitionFeeUSD), duration: Number(p.duration) })),
        }),
      })
      if (res.ok) { toast.success('University added!'); router.push('/admin/universities') }
      else toast.error('Failed to add university')
    } catch { toast.error('Error occurred') }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/universities" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Add New University</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
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
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => update('isFeatured', e.target.checked)} className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured University</label>
            </div>
          </div>
        </div>

        {/* Images */}
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

        {/* Descriptions */}
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

        {/* Programs */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Programs</h2>
            <button type="button" onClick={addProgram} className="flex items-center gap-1.5 bg-navy-100 dark:bg-navy-700 text-navy-800 dark:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-navy-200 transition-colors">
              <Plus className="w-4 h-4" /> Add Program
            </button>
          </div>
          <div className="space-y-4">
            {programs.map((prog, i) => (
              <div key={i} className="border border-gray-100 dark:border-navy-700 rounded-xl p-4 relative">
                <button type="button" onClick={() => removeProgram(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="col-span-2 md:col-span-3">
                    <label className="text-xs text-gray-500 mb-1 block">Program Name</label>
                    <input value={prog.nameEn} onChange={e => updateProgram(i, 'nameEn', e.target.value)} placeholder="e.g. Computer Engineering"
                      className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Degree</label>
                    <select value={prog.degreeType} onChange={e => updateProgram(i, 'degreeType', e.target.value)}
                      className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
                      {['BACHELOR','MASTER','PHD','DIPLOMA'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Language</label>
                    <select value={prog.language} onChange={e => updateProgram(i, 'language', e.target.value)}
                      className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
                      {['ENGLISH','TURKISH','ARABIC','ENGLISH_TURKISH'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Category</label>
                    <select value={prog.category} onChange={e => updateProgram(i, 'category', e.target.value)}
                      className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
                      {['Engineering','Medicine','Business','Law','Social Sciences','Architecture','Arts'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tuition (USD/yr)</label>
                    <input type="number" value={prog.tuitionFeeUSD} onChange={e => updateProgram(i, 'tuitionFeeUSD', e.target.value)} placeholder="5000"
                      className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Duration (years)</label>
                    <input type="number" value={prog.duration} onChange={e => updateProgram(i, 'duration', e.target.value)}
                      className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : '+ Add University'}
        </button>
      </form>
    </div>
  )
}
