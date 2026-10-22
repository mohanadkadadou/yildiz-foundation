'use client'
import { useTranslations } from '@/components/shared/LocaleProvider'

const COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WAITLISTED: 'bg-purple-100 text-purple-700',
}

export function AppStatusBadge({ status }: { status: string }) {
  const { t } = useTranslations()
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${COLORS[status] || COLORS.DRAFT}`}>{t(`appStatus.${status}`)}</span>
}
