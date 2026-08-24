'use client'
import { useRouter } from 'next/navigation'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { adminFetch } from '@/lib/admin-fetch'

export function LeadDeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const handleDelete = async () => {
    const { ok } = await adminFetch(`/api/admin/leads/${id}`, { method: 'DELETE', successMessage: 'Lead deleted', errorMessage: 'Failed to delete lead' })
    if (ok) router.refresh()
  }
  return <ConfirmDeleteDialog itemLabel="lead" onConfirm={handleDelete} />
}
