'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Eye, Pencil, ImagePlus, Trash2, ExternalLink, Clock, X, Save, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminFetch } from '@/lib/admin-fetch'
import { uploadImage } from '@/lib/upload-image'
import { RichTextEditor } from './blog/RichTextEditor'

export interface BlogPostFormData {
  slug: string
  titleEn: string; titleAr: string; titleTr: string
  excerptEn: string; excerptAr: string; excerptTr: string
  contentEn: string; contentAr: string; contentTr: string
  coverImage: string; category: string; tags: string[]
  published: boolean
}

const emptyForm: BlogPostFormData = {
  slug: '',
  titleEn: '', titleAr: '', titleTr: '',
  excerptEn: '', excerptAr: '', excerptTr: '',
  contentEn: '', contentAr: '', contentTr: '',
  coverImage: '', category: 'Study in Turkey', tags: [],
  published: false,
}

const CATEGORIES = ['Study in Turkey', 'Scholarships', 'Universities', 'Visa & Immigration', 'Student Life', 'Exams & Courses', 'General']
const LANGS = [
  { code: 'En', label: 'English', dir: 'ltr' as const, titlePh: 'Write a clear, specific title', contentPh: 'Start writing your article…' },
  { code: 'Ar', label: 'العربية', dir: 'rtl' as const, titlePh: 'اكتب عنواناً واضحاً', contentPh: 'ابدأ بكتابة المقال…' },
  { code: 'Tr', label: 'Türkçe', dir: 'ltr' as const, titlePh: 'Açık bir başlık yazın', contentPh: 'Makalenizi yazmaya başlayın…' },
]
const DRAFT_KEY = 'yildiz-blog-draft-new'

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
const textOf = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
const wordsOf = (html: string) => textOf(html).split(' ').filter(Boolean).length

interface Props {
  mode: 'create' | 'edit'
  id?: string
  initialData?: Partial<BlogPostFormData>
}

const inputCls = 'w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white'

export function BlogPostForm({ mode, id, initialData }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<BlogPostFormData>({ ...emptyForm, ...initialData })
  const [lang, setLang] = useState(0)
  const [preview, setPreview] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [coverUploading, setCoverUploading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [dirty, setDirty] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const saved = useRef(false)
  const coverRef = useRef<HTMLInputElement>(null)

  const update = <K extends keyof BlogPostFormData>(k: K, v: BlogPostFormData[K]) => {
    setForm(p => ({ ...p, [k]: v }))
    setDirty(true)
  }

  // restore an unsaved draft of a new post
  useEffect(() => {
    if (mode !== 'create') return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw)
      if (draft?.titleEn || draft?.contentEn) {
        setForm({ ...emptyForm, ...draft })
        setSlugTouched(!!draft.slug)
        setEditorKey(k => k + 1)
        toast('Restored your unsaved draft', { icon: '📝' })
      }
    } catch { /* ignore */ }
  }, [mode])

  // auto-save draft locally while creating
  useEffect(() => {
    if (mode !== 'create' || !dirty) return
    const t = setTimeout(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)) } catch { /* ignore */ } }, 800)
    return () => clearTimeout(t)
  }, [form, dirty, mode])

  // warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (dirty && !saved.current) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const L = LANGS[lang]
  const title = (form as any)[`title${L.code}`] as string
  const excerpt = (form as any)[`excerpt${L.code}`] as string
  const content = (form as any)[`content${L.code}`] as string

  const onTitle = (v: string) => {
    update(`title${L.code}` as keyof BlogPostFormData, v as any)
    if (L.code === 'En' && !slugTouched) setForm(p => ({ ...p, titleEn: v, slug: slugify(v) }))
  }

  const stats = useMemo(() => {
    const words = wordsOf(content)
    return { words, minutes: Math.max(1, Math.round(words / 200)) }
  }, [content])

  const filled = LANGS.map(l => !!(form as any)[`title${l.code}`]?.trim() && wordsOf((form as any)[`content${l.code}`]) > 0)

  const addTags = (raw: string) => {
    const incoming = raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    if (!incoming.length) return
    update('tags', Array.from(new Set([...form.tags, ...incoming])).slice(0, 12))
    setTagInput('')
  }

  const uploadCover = async (file?: File) => {
    if (!file) return
    setCoverUploading(true)
    const res = await uploadImage(file)
    setCoverUploading(false)
    if (res.url) update('coverImage', res.url)
    else toast.error(res.error || 'Upload failed')
  }

  const save = async (publishOverride?: boolean) => {
    if (!form.titleEn.trim()) { setLang(0); toast.error('Please add an English title first'); return }
    if (!wordsOf(form.contentEn)) { setLang(0); toast.error('The English article body is empty'); return }
    const body = { ...form, published: publishOverride ?? form.published }
    setSaving(true)
    const result = mode === 'create'
      ? await adminFetch('/api/admin/blog', { body, errorMessage: 'Failed to create post' })
      : await adminFetch(`/api/admin/blog/${id}`, { method: 'PATCH', body, errorMessage: 'Failed to update post' })
    setSaving(false)
    if (!result.ok) return
    saved.current = true
    try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
    toast.success(body.published ? (mode === 'create' ? 'Article published' : 'Article updated') : 'Draft saved')
    router.push('/admin/blog')
    router.refresh()
  }

  const primaryLabel = !form.published ? 'Save draft' : mode === 'create' ? 'Publish' : 'Update'

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-8 px-8 py-3 mb-6 bg-gray-50/90 dark:bg-navy-950/90 backdrop-blur border-b border-gray-200 dark:border-navy-700 flex items-center gap-3">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl" aria-label="Back to posts"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-bold text-navy-900 dark:text-white flex-1 truncate">{mode === 'create' ? 'New article' : 'Edit article'}</h1>
        <span className={`hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold ${form.published ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{form.published ? 'Published' : 'Draft'}</span>
        <button type="button" onClick={() => setPreview(p => !p)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-navy-800">
          {preview ? <><Pencil className="w-4 h-4" />Edit</> : <><Eye className="w-4 h-4" />Preview</>}
        </button>
        {mode === 'create' && !form.published && (
          <button type="button" disabled={saving} onClick={() => save(true)} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-navy-800 text-navy-800 dark:text-white dark:border-white/40 text-sm font-semibold hover:bg-navy-800 hover:text-white disabled:opacity-50">
            <Send className="w-4 h-4" />Publish now
          </button>
        )}
        <button type="button" disabled={saving} onClick={() => save()} className="flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold px-5 py-2 rounded-xl text-sm disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{primaryLabel}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="space-y-5 min-w-0">
          <div className="flex gap-2">
            {LANGS.map((l, i) => (
              <button key={l.code} type="button" onClick={() => setLang(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${lang === i ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 dark:border-navy-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800'}`}>
                <span className={`w-2 h-2 rounded-full ${filled[i] ? 'bg-green-400' : 'bg-gray-300'}`} />{l.label}
              </button>
            ))}
          </div>
          {lang > 0 && !filled[lang] && <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">Not translated yet — visitors using this language will see the English version until you fill this in.</p>}

          {preview ? (
            <article className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 p-6 md:p-10" dir={L.dir}>
              {form.coverImage && <img src={form.coverImage} alt="" className="w-full max-h-80 object-cover rounded-2xl mb-6" />}
              <span className="inline-block bg-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">{form.category}</span>
              <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-3 leading-tight">{title || '(No title)'}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 pb-6 border-b border-gray-100 dark:border-navy-700">{excerpt}</p>
              <div className="article-body" dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          ) : null}

          {LANGS.map((l, i) => (
            <div key={`${l.code}-${editorKey}`} className={!preview && lang === i ? 'space-y-4' : 'hidden'}>
              <input value={(form as any)[`title${l.code}`]} onChange={e => { if (lang === i) onTitle(e.target.value) }} dir={l.dir} placeholder={l.titlePh}
                className="w-full text-2xl md:text-3xl font-bold border-0 border-b-2 border-gray-200 dark:border-navy-600 focus:border-gold-500 bg-transparent px-1 py-3 outline-none text-navy-900 dark:text-white placeholder:text-gray-300" />
              <div>
                <textarea value={(form as any)[`excerpt${l.code}`]} onChange={e => update(`excerpt${l.code}` as keyof BlogPostFormData, e.target.value as any)} rows={2} dir={l.dir} maxLength={300}
                  placeholder={l.code === 'En' ? 'Short summary shown on cards and in Google results (120–160 characters is ideal)' : l.code === 'Ar' ? 'ملخص قصير يظهر في البطاقات ونتائج جوجل' : 'Kartlarda ve Google sonuçlarında görünen kısa özet'}
                  className={`${inputCls} resize-none`} />
                <div className={`text-xs mt-1 text-end ${(form as any)[`excerpt${l.code}`].length >= 120 && (form as any)[`excerpt${l.code}`].length <= 160 ? 'text-green-600' : 'text-gray-400'}`}>{(form as any)[`excerpt${l.code}`].length}/160</div>
              </div>
              <RichTextEditor value={(form as any)[`content${l.code}`]} dir={l.dir} placeholder={l.contentPh}
                onChange={html => update(`content${l.code}` as keyof BlogPostFormData, html as any)} />
            </div>
          ))}

          {!preview && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{stats.words} words</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{stats.minutes} min read</span>
              {mode === 'create' && dirty && <span className="text-green-600">Draft auto-saved on this device</span>}
            </div>
          )}
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700">
            <h2 className="font-bold text-sm mb-3">Status</h2>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: false, l: 'Draft' }, { v: true, l: 'Published' }].map(o => (
                <button key={o.l} type="button" onClick={() => update('published', o.v)}
                  className={`py-2 rounded-xl text-sm font-semibold border transition-colors ${form.published === o.v ? (o.v ? 'bg-green-600 text-white border-green-600' : 'bg-gray-700 text-white border-gray-700') : 'border-gray-200 dark:border-navy-600 text-gray-600 dark:text-gray-300'}`}>{o.l}</button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">{form.published ? 'Visible to everyone once you save.' : 'Only admins can see drafts.'}</p>
          </section>

          <section className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700">
            <h2 className="font-bold text-sm mb-3">Cover image</h2>
            {form.coverImage ? (
              <div className="relative">
                <img src={form.coverImage} alt="Cover" className="w-full h-40 object-cover rounded-xl border border-gray-100" />
                <button type="button" onClick={() => update('coverImage', '')} className="absolute top-2 end-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80" aria-label="Remove cover"><Trash2 className="w-4 h-4" /></button>
              </div>
            ) : (
              <button type="button" onClick={() => coverRef.current?.click()} disabled={coverUploading}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-navy-500 hover:text-navy-700 transition-colors">
                {coverUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
                <span className="text-sm">{coverUploading ? 'Uploading…' : 'Upload cover image'}</span>
                <span className="text-xs text-gray-400">JPG, PNG or WebP · wide images look best</span>
              </button>
            )}
            <input ref={coverRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={e => { uploadCover(e.target.files?.[0]); e.target.value = '' }} />
          </section>

          <section className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700 space-y-4">
            <div>
              <label className="text-sm font-bold mb-1.5 block">Category</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className={inputCls}>
                {Array.from(new Set([...CATEGORIES, form.category])).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-1.5 block">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2.5 py-1 rounded-full">
                    #{t}<button type="button" onClick={() => update('tags', form.tags.filter(x => x !== t))} aria-label={`Remove ${t}`}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Type a tag, press Enter"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTags(tagInput) } }} onBlur={() => addTags(tagInput)} className={inputCls} />
            </div>
          </section>

          <section className="bg-white dark:bg-navy-800 rounded-2xl p-5 border border-gray-100 dark:border-navy-700">
            <h2 className="font-bold text-sm mb-1.5">Page address (URL)</h2>
            <input value={form.slug} dir="ltr" onChange={e => { setSlugTouched(true); update('slug', slugify(e.target.value)) }} placeholder="auto-generated-from-title" className={inputCls} />
            <p className="text-xs text-gray-400 mt-2 break-all" dir="ltr">yildizeducation.com/blog/{form.slug || '…'}</p>
            {mode === 'edit' && form.slug && <p className="text-xs text-amber-600 mt-2">Changing the address breaks links people already shared.</p>}
            {mode === 'edit' && form.published && form.slug && (
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-3"><ExternalLink className="w-3.5 h-3.5" />View on site</a>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
