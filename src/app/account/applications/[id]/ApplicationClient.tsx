'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Building2, Loader2, UploadCloud, FileText, Trash2, Eye, CheckCircle2, Circle, Send, MessageCircle, Save, Lock } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'
import { localize } from '@/lib/locale-helpers'
import { AppStatusBadge } from '@/components/account/AppStatusBadge'

interface Doc { id: string; type: string; fileName: string; mimeType: string; size: number; createdAt: Date }
interface Props {
  app: {
    id: string; status: string; intake: string | null; notes: string | null; adminMessage: string | null; createdAt: Date
    university: { slug: string; nameEn: string; nameAr: string; nameTr: string }
    program: { nameEn: string; nameAr: string; nameTr: string } | null
    files: Doc[]; events: { id: string; status: string; note: string | null; createdAt: Date }[]
    user: { phone: string | null; country: string | null }
  }
}

const DOC_TYPES = ['PASSPORT', 'CERTIFICATE', 'TRANSCRIPT', 'PHOTO', 'LANGUAGE', 'OTHER']
const field = 'w-full border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white'
const ERR: Record<string, string> = { profile_incomplete: 'errProfile', documents_missing: 'errDocs', too_large: 'errTooLarge', bad_type: 'errBadType', too_many: 'errTooMany', locked: 'errLocked' }
const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)

export function ApplicationClient({ app }: Props) {
  const { t, locale } = useTranslations()
  const router = useRouter()
  const Back = locale === 'ar' ? ArrowRight : ArrowLeft
  const [phone, setPhone] = useState(app.user.phone || '')
  const [country, setCountry] = useState(app.user.country || '')
  const [notes, setNotes] = useState(app.notes || '')
  const [busy, setBusy] = useState<string | null>(null)
  const [docType, setDocType] = useState('PASSPORT')
  const fileRef = useRef<HTMLInputElement>(null)

  const isDraft = app.status === 'DRAFT'
  const editable = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW'].includes(app.status)
  const types = app.files.map(f => f.type)
  const hasRequired = types.includes('PASSPORT') && (types.includes('CERTIFICATE') || types.includes('TRANSCRIPT'))
  const errText = (code?: string) => t(`appDetail.${(code && ERR[code]) || 'errGeneric'}`)

  const call = async (url: string, init: RequestInit) => {
    const res = await fetch(url, init)
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, data }
  }

  const save = async (submit = false) => {
    setBusy(submit ? 'submit' : 'save')
    const { ok, data } = await call(`/api/applications/${app.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, country, notes, ...(submit ? { action: 'submit' } : {}) }),
    })
    setBusy(null)
    if (!ok) { toast.error(errText(data.error)); return }
    toast.success(submit ? t('appDetail.submittedOk') : t('appDetail.saved'))
    router.refresh()
  }

  const upload = async (file?: File) => {
    if (!file) return
    setBusy('upload')
    const body = new FormData()
    body.append('file', file)
    body.append('type', docType)
    const { ok, data } = await call(`/api/applications/${app.id}/documents`, { method: 'POST', body })
    setBusy(null)
    if (!ok) { toast.error(errText(data.error)); return }
    router.refresh()
  }

  const removeDoc = async (id: string) => {
    setBusy(`del-${id}`)
    const { ok, data } = await call(`/api/applications/${app.id}/documents/${id}`, { method: 'DELETE' })
    setBusy(null)
    if (!ok) { toast.error(errText(data.error)); return }
    router.refresh()
  }

  const deleteDraft = async () => {
    if (!confirm(t('appDetail.confirmDelete'))) return
    setBusy('delete')
    const { ok } = await call(`/api/applications/${app.id}`, { method: 'DELETE' })
    if (ok) { router.push('/account'); router.refresh() } else { setBusy(null); toast.error(t('appDetail.errGeneric')) }
  }

  const progressSteps = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DECISION']
  const reached = (step: string) => step === 'DECISION' ? ['ACCEPTED', 'REJECTED', 'WAITLISTED'].includes(app.status) : app.events.some(e => e.status === step) || (step === 'DRAFT')

  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-10 px-4 mb-8">
        <div className="container mx-auto max-w-4xl">
          <Link href="/account" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4"><Back className="w-4 h-4" />{t('appDetail.back')}</Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"><Building2 className="w-6 h-6 text-gold-400" />{localize(app.university, 'name', locale)}</h1>
              {app.program && <p className="text-blue-100 mt-1">{localize(app.program, 'name', locale)}</p>}
              {app.intake && <p className="text-blue-200 text-sm mt-1">{t('appDetail.intake')}: {app.intake}</p>}
            </div>
            <AppStatusBadge status={app.status} />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {app.adminMessage && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
              <h2 className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-2"><MessageCircle className="w-4 h-4" />{t('appDetail.messageFromTeam')}</h2>
              <p className="text-amber-900 dark:text-amber-100 text-sm whitespace-pre-line">{app.adminMessage}</p>
            </div>
          )}
          {!isDraft && editable && <p className="text-sm text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-200 rounded-xl px-4 py-3">{t('appDetail.lockedInfo')}</p>}
          {!editable && <p className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 dark:bg-navy-800 dark:text-gray-300 rounded-xl px-4 py-3"><Lock className="w-4 h-4" />{t('appDetail.decidedInfo')}</p>}

          <section className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-6">
            <h2 className="font-bold text-lg text-navy-900 dark:text-white mb-4">{t('appDetail.details')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">{t('appDetail.phone')}</label><input dir="ltr" value={phone} onChange={e => setPhone(e.target.value)} disabled={!editable} className={field} /></div>
              <div><label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">{t('appDetail.country')}</label><input value={country} onChange={e => setCountry(e.target.value)} disabled={!editable} className={field} /></div>
            </div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">{t('appDetail.note')}</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} disabled={!editable} rows={3} maxLength={3000} placeholder={t('appDetail.notePlaceholder')} className={`${field} resize-none`} />
            {editable && (
              <button onClick={() => save(false)} disabled={busy === 'save'} className="mt-4 inline-flex items-center gap-2 border border-gray-200 dark:border-navy-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-800 disabled:opacity-50">
                {busy === 'save' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{t('appDetail.saveDraft')}
              </button>
            )}
          </section>

          <section className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-6">
            <div className="flex items-center justify-between gap-3 mb-1"><h2 className="font-bold text-lg text-navy-900 dark:text-white">{t('appDetail.documents')}</h2></div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('appDetail.documentsHelp')}</p>
            <p className={`text-xs mb-4 ${hasRequired ? 'text-green-600' : 'text-amber-600'}`}>{t('appDetail.requiredHint')}</p>

            {editable && (
              <div className="flex flex-col sm:flex-row gap-2 mb-5 p-3 rounded-xl bg-gray-50 dark:bg-navy-800">
                <select value={docType} onChange={e => setDocType(e.target.value)} aria-label={t('appDetail.chooseType')} className={`${field} sm:flex-1`}>
                  {DOC_TYPES.map(d => <option key={d} value={d}>{t(`docTypes.${d}`)}{d === 'PASSPORT' ? ` *` : ''}</option>)}
                </select>
                <button onClick={() => fileRef.current?.click()} disabled={busy === 'upload'} className="inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">
                  {busy === 'upload' ? <><Loader2 className="w-4 h-4 animate-spin" />{t('appDetail.uploading')}</> : <><UploadCloud className="w-4 h-4" />{t('appDetail.upload')}</>}
                </button>
                <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={e => { upload(e.target.files?.[0]); e.target.value = '' }} />
              </div>
            )}

            {app.files.length === 0 ? <p className="text-sm text-gray-400 py-4 text-center">{t('appDetail.noDocs')}</p> : (
              <ul className="space-y-2">
                {app.files.map(f => (
                  <li key={f.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-navy-700">
                    <FileText className="w-5 h-5 text-navy-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-navy-900 dark:text-white truncate">{t(`docTypes.${f.type}`)}</div>
                      <div className="text-xs text-gray-400 truncate" dir="ltr">{f.fileName} · {kb(f.size)}</div>
                    </div>
                    <a href={`/api/documents/${f.id}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-500" title={t('appDetail.view')} aria-label={t('appDetail.view')}><Eye className="w-4 h-4" /></a>
                    {editable && app.status !== 'UNDER_REVIEW' && (
                      <button onClick={() => removeDoc(f.id)} disabled={busy === `del-${f.id}`} className="p-2 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-50" title={t('appDetail.remove')} aria-label={t('appDetail.remove')}>
                        {busy === `del-${f.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {isDraft && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => save(true)} disabled={busy === 'submit'} className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {busy === 'submit' ? <><Loader2 className="w-4 h-4 animate-spin" />{t('appDetail.submitting')}</> : <><Send className="w-4 h-4" />{t('appDetail.submit')}</>}
              </button>
              <button onClick={deleteDraft} disabled={busy === 'delete'} className="px-5 py-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium">{t('appDetail.deleteDraft')}</button>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <section className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-5">
            <h2 className="font-bold text-navy-900 dark:text-white mb-4">{t('appDetail.timeline')}</h2>
            <ol className="space-y-4">
              {progressSteps.map(step => {
                const done = reached(step)
                const label = step === 'DECISION' ? (['ACCEPTED', 'REJECTED', 'WAITLISTED'].includes(app.status) ? t(`appStatus.${app.status}`) : `${t('appStatus.ACCEPTED')} / ${t('appStatus.REJECTED')}`) : t(`appStatus.${step}`)
                const ev = app.events.filter(e => step === 'DECISION' ? ['ACCEPTED', 'REJECTED', 'WAITLISTED'].includes(e.status) : e.status === step).slice(-1)[0]
                return (
                  <li key={step} className="flex gap-3">
                    {done ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 shrink-0" />}
                    <div>
                      <div className={`text-sm font-semibold ${done ? 'text-navy-900 dark:text-white' : 'text-gray-400'}`}>{label}</div>
                      {ev && <div className="text-xs text-gray-400">{format(new Date(ev.createdAt), 'MMM d, yyyy')}</div>}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
          <section className="bg-blue-900 rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-3">{t('appDetail.needHelp')}</h3>
            <a href="https://wa.me/905395755269" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-semibold transition-colors"><MessageCircle className="w-4 h-4" />{t('appDetail.whatsapp')}</a>
          </section>
        </aside>
      </div>
    </div>
  )
}
