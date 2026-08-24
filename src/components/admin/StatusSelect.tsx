'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { adminFetch } from '@/lib/admin-fetch'

interface Props {
  endpoint: string
  field: string
  value: string
  options: string[]
  colors: Record<string, string>
}

export function StatusSelect({ endpoint, field, value, options, colors }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(value)

  const handleChange = async (newStatus: string) => {
    setStatus(newStatus)
    const { ok } = await adminFetch(endpoint, { method: 'PATCH', body: { [field]: newStatus }, errorMessage: 'Failed to update status' })
    if (!ok) setStatus(value)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer ${colors[status] || 'bg-gray-100 text-gray-700'}`}
    >
      {options.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
    </select>
  )
}
