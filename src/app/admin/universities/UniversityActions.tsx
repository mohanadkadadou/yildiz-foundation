'use client'
import { useRouter } from 'next/navigation'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { adminFetch } from '@/lib/admin-fetch'

export function UniversityToggle({ id, field, value }: { id: string; field: 'isActive' | 'isFeatured'; value: boolean }) {
  const router = useRouter()
  const toggle = async () => {
    await adminFetch(`/api/admin/universities/${id}`, { method: 'PATCH', body: { [field]: !value }, errorMessage: 'Failed to update' })
    router.refresh()
  }
  return (
    <button onClick={toggle} className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${value ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
      {field === 'isActive' ? (value ? 'Active' : 'Inactive') : (value ? '⭐ Featured' : 'Not Featured')}
    </button>
  )
}

export function UniversityDelete({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const handleDelete = async () => {
    const { ok } = await adminFetch(`/api/admin/universities/${id}`, { method: 'DELETE', successMessage: 'University deleted', errorMessage: 'Failed to delete university' })
    if (ok) router.refresh()
  }
  return <ConfirmDeleteDialog itemLabel="university" title={`Delete ${name}?`} onConfirm={handleDelete} />
}
