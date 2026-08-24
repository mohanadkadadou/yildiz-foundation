import type { Locale } from '@/i18n/config'

const SUFFIX: Record<Locale, string> = { en: 'En', ar: 'Ar', tr: 'Tr' }

/**
 * Picks the locale-specific field off a DB record, e.g. localize(uni, 'name', 'ar') -> uni.nameAr.
 * Falls back to the English field if the localized one is missing/empty.
 */
export function localize<T extends Record<string, any>>(entity: T, base: string, locale: Locale): string {
  const value = entity[`${base}${SUFFIX[locale]}`]
  return value || entity[`${base}En`] || ''
}
