'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { adminFetch } from '@/lib/admin-fetch'

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  CONSULTANT: 'bg-blue-100 text-blue-800',
  STUDENT: 'bg-gray-100 text-gray-600',
}

interface Props {
  user: { id: string; name: string | null; email: string | null; role: string }
  createdLabel: string
  isSelf: boolean
  isLastAdmin: boolean
}

export function UserRow({ user, createdLabel, isSelf, isLastAdmin }: Props) {
  const router = useRouter()
  const [role, setRole] = useState(user.role)
  const [resetting, setResetting] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    setRole(newRole)
    const { ok } = await adminFetch(`/api/admin/users/${user.id}`, { method: 'PATCH', body: { role: newRole }, successMessage: 'Role updated', errorMessage: 'Failed to update role' })
    if (!ok) setRole(user.role)
    router.refresh()
  }

  const handleResetPassword = async () => {
    const password = window.prompt(`New password for ${user.email} (min 8 characters):`)
    if (!password) return
    setResetting(true)
    await adminFetch(`/api/admin/users/${user.id}/reset-password`, { body: { password }, successMessage: 'Password reset', errorMessage: 'Failed to reset password' })
    setResetting(false)
  }

  const handleDelete = async () => {
    const { ok } = await adminFetch(`/api/admin/users/${user.id}`, { method: 'DELETE', successMessage: 'User deleted', errorMessage: 'Failed to delete user' })
    if (ok) router.refresh()
  }

  return (
    <tr className="border-t border-gray-50 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
      <td className="py-3 px-5 font-medium text-navy-900 dark:text-white">{user.name || '—'}</td>
      <td className="py-3 px-5 text-gray-600 dark:text-gray-300">{user.email}</td>
      <td className="py-3 px-5">
        <select
          value={role}
          onChange={e => handleRoleChange(e.target.value)}
          disabled={isSelf || isLastAdmin}
          className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${ROLE_COLORS[role]}`}
        >
          {['ADMIN', 'CONSULTANT', 'STUDENT'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </td>
      <td className="py-3 px-5 text-gray-500 dark:text-gray-400">{createdLabel}</td>
      <td className="py-3 px-5">
        <div className="flex items-center justify-end gap-1">
          <button onClick={handleResetPassword} disabled={resetting} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-600 transition-colors" title="Reset password">
            {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          </button>
          {!isSelf && !isLastAdmin && <ConfirmDeleteDialog itemLabel="user" onConfirm={handleDelete} />}
        </div>
      </td>
    </tr>
  )
}
