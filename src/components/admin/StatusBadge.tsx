const DEFAULT_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800', COMPLETED: 'bg-green-100 text-green-800',
  NEW: 'bg-blue-100 text-blue-800', CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-purple-100 text-purple-800', CONVERTED: 'bg-green-100 text-green-800', LOST: 'bg-gray-100 text-gray-600',
}

export function StatusBadge({ status, colors = DEFAULT_COLORS }: { status: string; colors?: Record<string, string> }) {
  const cls = colors[status] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cls}`}>{status.replace(/_/g, ' ')}</span>
}
