'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Dices } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function NewAdminUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ADMIN' })

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { ok } = await adminFetch('/api/admin/users', {
      body: form,
      successMessage: 'User created',
      errorMessage: 'Failed to create user',
    })
    if (ok) router.push('/admin/users')
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">New Admin User</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Full Name</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} required
            className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
            className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
          <div className="flex gap-2">
            <input type="text" value={form.password} onChange={e => update('password', e.target.value)} required minLength={8} placeholder="At least 8 characters"
              className="flex-1 border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-navy-500 bg-white dark:bg-navy-700 text-gray-900 dark:text-white" />
            <button type="button" onClick={() => update('password', generatePassword())}
              className="flex items-center gap-1.5 px-3 rounded-xl border border-gray-200 dark:border-navy-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
              <Dices className="w-4 h-4" /> Generate
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Share this password with the user securely — it won't be shown again.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Role</label>
          <select value={form.role} onChange={e => update('role', e.target.value)}
            className="w-full border border-gray-200 dark:border-navy-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-navy-700 text-gray-900 dark:text-white outline-none">
            <option value="ADMIN">Admin — full dashboard access</option>
            <option value="CONSULTANT">Consultant — no dashboard access yet</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : 'Create User'}
        </button>
      </form>
    </div>
  )
}
