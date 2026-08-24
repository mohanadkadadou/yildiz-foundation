'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'

export interface BlogPostFormData {
  titleEn: string; titleAr: string; titleTr: string
  excerptEn: string; excerptAr: string; excerptTr: string
  contentEn: string; contentAr: string; contentTr: string
  coverImage: string; category: string; tags: string
  published: boolean
}

const emptyForm: BlogPostFormData = {
  titleEn: '', titleAr: '', titleTr: '',
  excerptEn: '', excerptAr: '', excerptTr: '',
  contentEn: '', contentAr: '', contentTr: '',
  coverImage: '', category: 'Study in Turkey', tags: '',
  published: false,
}

const CATEGORIES = ['Study in Turkey', 'Scholarships', 'Universities', 'Visa & Immigration', 'Student Life', 'General']

interface Props {
  mode: 'create' | 'edit'
  id?: string
  initialData?: Partial<BlogPostFormData>
}

export function BlogPostForm({ mode, id, initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<BlogPostFormData>({ ...emptyForm, ...initialData })
  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (mode === 'create') {
      const { ok } = await adminFetch('/api/admin/blog', { body: form, successMessage: 'Post created', errorMessage: 'Failed to create post' })
      if (ok) router.push('/admin/blog')
    } else {
      const { ok } = await adminFetch(`/api/admin/blog/${id}`, { method: 'PATCH', body: form, successMessage: 'Post updated', errorMessage: 'Failed to update post' })
      if (ok) router.push('/admin/blog')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
        <h2 className="font-bold text-lg mb-4">Titles</h2>
        <div className="space-y-4">
          {[['titleEn', 'Title (English)', 'ltr'], ['titleAr', 'Title (Arabic)', 'rtl'], ['titleTr', 'Title (Turkish)', 'ltr']].map(([k, l, dir]) => (
            <div key={k}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{l}</label>
              <input value={(form as any)[k]} onChange={e => update(k, e.target.value)} dir={dir}
                className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
        <h2 className="font-bold text-lg mb-4">Meta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category</label>
            <select value={form.category} onChange={e => update('category', e.target.value)}
              className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="turkey, scholarships, visa"
              className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Cover Image URL</label>
            <input value={form.coverImage} onChange={e => update('coverImage', e.target.value)} placeholder="https://example.com/cover.jpg"
              className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
            {form.coverImage && <img src={form.coverImage} alt="cover preview" className="mt-2 h-32 w-full object-cover rounded-lg border" />}
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} className="w-4 h-4" />
            Published (visible on site)
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
        <h2 className="font-bold text-lg mb-4">Excerpt</h2>
        <div className="space-y-4">
          {[['excerptEn', 'Excerpt (English)', 'ltr'], ['excerptAr', 'Excerpt (Arabic)', 'rtl'], ['excerptTr', 'Excerpt (Turkish)', 'ltr']].map(([k, l, dir]) => (
            <div key={k}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{l}</label>
              <textarea value={(form as any)[k]} onChange={e => update(k, e.target.value)} rows={2} dir={dir}
                className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-navy-700 text-gray-900 dark:text-white resize-none" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
        <h2 className="font-bold text-lg mb-4">Content</h2>
        <div className="space-y-4">
          {[['contentEn', 'Content (English)', 'ltr'], ['contentAr', 'Content (Arabic)', 'rtl'], ['contentTr', 'Content (Turkish)', 'ltr']].map(([k, l, dir]) => (
            <div key={k}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{l}</label>
              <textarea value={(form as any)[k]} onChange={e => update(k, e.target.value)} rows={8} dir={dir}
                className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-navy-700 text-gray-900 dark:text-white resize-y" />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : mode === 'create' ? '+ Publish Post' : 'Save Changes'}
      </button>
    </form>
  )
}
