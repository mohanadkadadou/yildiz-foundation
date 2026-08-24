'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { adminFetch } from '@/lib/admin-fetch'

export interface ProgramData {
  id: string; nameEn: string; degreeType: string; language: string
  tuitionFeeUSD: number; duration: number; category: string
}

const DEGREES = ['BACHELOR', 'MASTER', 'PHD', 'DIPLOMA']
const LANGUAGES = ['ENGLISH', 'TURKISH', 'ARABIC', 'ENGLISH_TURKISH']
const CATEGORIES = ['Engineering', 'Medicine', 'Business', 'Law', 'Social Sciences', 'Architecture', 'Arts']
const emptyNew = { nameEn: '', degreeType: 'BACHELOR', language: 'ENGLISH', tuitionFeeUSD: '', duration: '4', category: 'Engineering' }

function ProgramRow({ program, onSaved, onDeleted }: { program: ProgramData; onSaved: () => void; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(program)
  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    const { ok } = await adminFetch(`/api/admin/programs/${program.id}`, { method: 'PATCH', body: form, successMessage: 'Program updated', errorMessage: 'Failed to update program' })
    setSaving(false)
    if (ok) { setEditing(false); onSaved() }
  }

  const del = async () => {
    const { ok } = await adminFetch(`/api/admin/programs/${program.id}`, { method: 'DELETE', successMessage: 'Program deleted', errorMessage: 'Failed to delete program' })
    if (ok) onDeleted()
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between border border-gray-100 dark:border-navy-700 rounded-xl p-3 text-sm">
        <div>
          <span className="font-medium text-navy-900 dark:text-white">{program.nameEn}</span>
          <span className="text-gray-400 mx-2">·</span>
          <span className="text-gray-500 dark:text-gray-400">{program.degreeType} · {program.duration}yr · ${program.tuitionFeeUSD.toLocaleString()}/yr</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setEditing(true)} className="text-xs font-medium text-navy-600 dark:text-blue-400 hover:underline px-2">Edit</button>
          <ConfirmDeleteDialog itemLabel="program" onConfirm={del} />
        </div>
      </div>
    )
  }

  return (
    <div className="border border-navy-200 dark:border-navy-600 rounded-xl p-4 space-y-3">
      <input value={form.nameEn} onChange={e => update('nameEn', e.target.value)} placeholder="Program name"
        className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select value={form.degreeType} onChange={e => update('degreeType', e.target.value)} className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
          {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={form.language} onChange={e => update('language', e.target.value)} className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={form.category} onChange={e => update('category', e.target.value)} className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" value={form.tuitionFeeUSD} onChange={e => update('tuitionFeeUSD', e.target.value)} placeholder="Tuition USD/yr"
          className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="number" value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="Duration (years)"
          className="w-32 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
        <button onClick={save} disabled={saving} className="ml-auto text-sm font-semibold bg-navy-800 text-white px-4 py-2 rounded-lg hover:bg-navy-900 disabled:opacity-50 flex items-center gap-1.5">
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
        </button>
        <button onClick={() => { setForm(program); setEditing(false) }} className="text-sm text-gray-500 px-3 py-2">Cancel</button>
      </div>
    </div>
  )
}

export function ProgramsManager({ universityId, initialPrograms }: { universityId: string; initialPrograms: ProgramData[] }) {
  const router = useRouter()
  const [programs, setPrograms] = useState(initialPrograms)
  const [adding, setAdding] = useState(false)
  const [newProgram, setNewProgram] = useState(emptyNew)

  const refresh = () => router.refresh()

  const handleAdd = async () => {
    if (!newProgram.nameEn.trim()) return
    setAdding(true)
    const { ok, data } = await adminFetch('/api/admin/programs', {
      body: { ...newProgram, universityId, tuitionFeeUSD: Number(newProgram.tuitionFeeUSD), duration: Number(newProgram.duration) },
      successMessage: 'Program added', errorMessage: 'Failed to add program',
    })
    setAdding(false)
    if (ok) { setPrograms(p => [...p, data.program]); setNewProgram(emptyNew) }
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
      <h2 className="font-bold text-lg mb-4">Programs ({programs.length})</h2>
      <div className="space-y-3 mb-4">
        {programs.map(p => (
          <ProgramRow key={p.id} program={p} onSaved={refresh} onDeleted={() => setPrograms(prev => prev.filter(x => x.id !== p.id))} />
        ))}
        {programs.length === 0 && <p className="text-sm text-gray-400">No programs yet.</p>}
      </div>

      <div className="border border-dashed border-gray-200 dark:border-navy-600 rounded-xl p-4 space-y-3">
        <input value={newProgram.nameEn} onChange={e => setNewProgram(p => ({ ...p, nameEn: e.target.value }))} placeholder="New program name, e.g. Computer Engineering"
          className="w-full border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={newProgram.degreeType} onChange={e => setNewProgram(p => ({ ...p, degreeType: e.target.value }))} className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
            {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={newProgram.language} onChange={e => setNewProgram(p => ({ ...p, language: e.target.value }))} className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={newProgram.category} onChange={e => setNewProgram(p => ({ ...p, category: e.target.value }))} className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" value={newProgram.tuitionFeeUSD} onChange={e => setNewProgram(p => ({ ...p, tuitionFeeUSD: e.target.value }))} placeholder="Tuition USD/yr"
            className="border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="number" value={newProgram.duration} onChange={e => setNewProgram(p => ({ ...p, duration: e.target.value }))} placeholder="Duration (years)"
            className="w-32 border border-gray-200 dark:border-navy-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none" />
          <button onClick={handleAdd} disabled={adding || !newProgram.nameEn.trim()} className="ml-auto flex items-center gap-1.5 bg-navy-100 dark:bg-navy-700 text-navy-800 dark:text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-200 disabled:opacity-50 transition-colors">
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Program
          </button>
        </div>
      </div>
    </div>
  )
}
