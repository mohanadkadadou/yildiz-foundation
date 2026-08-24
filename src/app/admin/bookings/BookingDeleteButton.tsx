'use client'
import { useRouter } from 'next/navigation'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { adminFetch } from '@/lib/admin-fetch'

export function BookingDeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const handleDelete = async () => {
    const { ok } = await adminFetch(`/api/admin/bookings/${id}`, { method: 'DELETE', successMessage: 'Booking deleted', errorMessage: 'Failed to delete booking' })
    if (ok) router.refresh()
  }
  return <ConfirmDeleteDialog itemLabel="booking" onConfirm={handleDelete} />
}
