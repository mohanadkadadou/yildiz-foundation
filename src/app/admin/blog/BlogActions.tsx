'use client'
import { useRouter } from 'next/navigation'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { adminFetch } from '@/lib/admin-fetch'

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const router = useRouter()
  const toggle = async () => {
    await adminFetch(`/api/admin/blog/${id}`, { method: 'PATCH', body: { published: !published }, errorMessage: 'Failed to update' })
    router.refresh()
  }
  return (
    <button onClick={toggle} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
      {published ? '✓ Published' : 'Draft'}
    </button>
  )
}

export function BlogDeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const handleDelete = async () => {
    const { ok } = await adminFetch(`/api/admin/blog/${id}`, { method: 'DELETE', successMessage: 'Post deleted', errorMessage: 'Failed to delete post' })
    if (ok) router.refresh()
  }
  return <ConfirmDeleteDialog itemLabel="post" onConfirm={handleDelete} />
}
