'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminFetch } from '@/lib/admin-fetch'

const STATUSES = [['DRAFT', 'Draft'], ['SUBMITTED', 'Submitted'], ['UNDER_REVIEW', 'Under review'], ['WAITLISTED', 'Waitlisted'], ['ACCEPTED', 'Accepted'], ['REJECTED', 'Not accepted']]
const field = 'w-full border border-gray-200 dark:border-navy-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white'

export function ApplicationReview({ id, status, adminMessage, adminNotes }: { id: string; status: string; adminMessage: string; adminNotes: string }) {
  const router = useRouter()
  const [st, setSt] = useState(status)
  const [message, setMessage] = useState(adminMessage)
  const [notes, setNotes] = useState(adminNotes)
  const [notify, setNotify] = useState(true)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const { ok, data } = await adminFetch(`/api/admin/applications/${id}`, { method: 'PATCH', body: { status: st, adminMessage: message, adminNotes: notes, notify }, errorMessage: 'Failed to save' })
    setSaving(false)
    if (!ok) return
    toast.success(data?.emailed ? 'Saved — student notified by email' : 'Saved')
    router.refresh()
  }
  const remove = async () => {
    if (!confirm('Delete this application and all its documents permanently?')) return
    const { ok } = await adminFetch(`/api/admin/applications/${id}`, { method: 'DELETE', successMessage: 'Application deleted' })
    if (ok) { router.push('/admin/applications'); router.refresh() }
  }

  return (
    <section className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700 space-y-4">
      <h2 className="font-bold">Review</h2>
      <div><label className="text-sm font-medium mb-1 block">Status</label>
        <select value={st} onChange={e => setSt(e.target.value)} className={field}>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div><label className="text-sm font-medium mb-1 block">Message to the student</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} maxLength={3000} placeholder="Visible to the student and included in the email (e.g. “Please upload a clearer passport scan”)" className={`${field} resize-none`} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} className="w-4 h-4" />Email the student about this update</label>
      <div><label className="text-sm font-medium mb-1 block">Internal notes <span className="text-gray-400 font-normal">(never shown to the student)</span></label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={`${field} resize-none`} /></div>
      <button onClick={save} disabled={saving} className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">{saving && <Loader2 className="w-4 h-4 animate-spin" />}Save changes</button>
      <button onClick={remove} className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-xl text-sm"><Trash2 className="w-4 h-4" />Delete application</button>
    </section>
  )
}
