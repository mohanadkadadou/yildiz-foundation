'use client'
import { useTranslations } from '@/components/shared/LocaleProvider'

export function AlbumHeader() {
  const { t } = useTranslations()
  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-12">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('album.title')}</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">{t('album.subtitle')}</p>
      </div>
    </div>
  )
}
