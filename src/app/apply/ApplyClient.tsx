'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'

interface Uni { slug: string; id: string; nameEn: string; nameAr: string; nameTr: string; country: string }
interface Prog { id: string; universityId: string; nameEn: string; nameAr: string; nameTr: string; degreeType: string }

const field = 'w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white'

export function ApplyClient({ universities, programs, initialUniversity, initialProgram }: { universities: Uni[]; programs: Prog[]; initialUniversity: string; initialProgram: string }) {
  const { t, locale } = useTranslations()
  const router = useRouter()
  const [slug, setSlug] = useState(universities.some(u => u.slug === initialUniversity) ? initialUniversity : '')
  const [programId, setProgramId] = useState(initialProgram)
  const [intake, setIntake] = useState('')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  const year = new Date().getFullYear()
  const intakes = [`Fall ${year}`, `Spring ${year + 1}`, `Fall ${year + 1}`]
  const intakeLabel = (v: string) => { const [s, y] = v.split(' '); return `${t(s === 'Fall' ? 'apply.fall' : 'apply.spring')} ${y}` }

  const selected = universities.find(u => u.slug === slug)
  const uniPrograms = useMemo(() => programs.filter(p => p.universityId === selected?.id), [programs, selected])
  const visible = useMemo(() => {
    const s = q.trim().toLowerCase()
    return universities.filter(u => !s || [u.nameEn, u.nameAr, u.nameTr].some(n => n.toLowerCase().includes(s)) || u.slug === slug)
  }, [universities, q, slug])

  const start = async () => {
    if (!slug) return
    setLoading(true)
    try {
      const res = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ universitySlug: slug, programId: programId || null, intake: intake || undefined, locale }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.id) throw new Error()
      router.push(`/account/applications/${data.id}`)
    } catch {
      toast.error(t('apply.errGeneric'))
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-12 px-4 mb-10">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{t('apply.title')}</h1>
          <p className="text-blue-100">{t('apply.subtitle')}</p>
        </div>
      </div>
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white dark:bg-navy-900 rounded-3xl border border-gray-100 dark:border-navy-800 p-6 md:p-8 space-y-5 shadow-sm">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">{t('apply.university')}</label>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('apply.search')} className={`${field} mb-2`} />
            <select value={slug} onChange={e => { setSlug(e.target.value); setProgramId('') }} size={1} className={field}>
              <option value="">{t('apply.chooseUniversity')}</option>
              {visible.map(u => <option key={u.slug} value={u.slug}>{localize(u, 'name', locale)} — {t(`countries.${u.country}`)}</option>)}
            </select>
          </div>
          {selected && (
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">{t('apply.program')}</label>
              <select value={programId} onChange={e => setProgramId(e.target.value)} className={field}>
                <option value="">{t('apply.anyProgram')}</option>
                {uniPrograms.map(p => <option key={p.id} value={p.id}>{localize(p, 'name', locale)} ({t(`programs.${({ BACHELOR: 'bachelor', MASTER: 'master', PHD: 'phd', DIPLOMA: 'diploma' } as Record<string, string>)[p.degreeType] || 'bachelor'}`)})</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">{t('apply.intake')}</label>
            <div className="grid grid-cols-3 gap-2">
              {intakes.map(i => (
                <button key={i} type="button" onClick={() => setIntake(intake === i ? '' : i)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${intake === i ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 hover:border-navy-500'}`}>{intakeLabel(i)}</button>
              ))}
            </div>
          </div>
          <button onClick={start} disabled={!slug || loading} className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t('apply.starting')}</> : t('apply.start')}
          </button>
        </div>
      </div>
    </div>
  )
}
