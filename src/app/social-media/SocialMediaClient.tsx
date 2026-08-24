'use client'
import { Youtube, Instagram, MessageCircle, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/components/shared/LocaleProvider'

const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@yildiz_education'
const YOUTUBE_UPLOADS_EMBED = 'https://www.youtube.com/embed/videoseries?list=UUgE7rypVepCqydooBQPi3sw'
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/yildiz_edu'
const INSTAGRAM_REELS = ['DcZa4QxORTo', 'DcWoXuZOneU']
const WHATSAPP_URL = 'https://wa.me/905395755269'

export function SocialMediaClient() {
  const { t } = useTranslations()
  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-12">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('socialMedia.title')}</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">{t('socialMedia.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* YouTube */}
        <div className="uni-card overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 text-white">
            <div className="flex items-center gap-3 mb-1">
              <Youtube className="w-7 h-7" />
              <h2 className="font-bold text-lg">YouTube</h2>
            </div>
            <p className="text-red-100 text-sm">{t('socialMedia.youtubeSubtitle')}</p>
          </div>
          <div className="aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src={YOUTUBE_UPLOADS_EMBED}
              title="Yildiz Education — Latest Videos"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="p-5">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t('socialMedia.youtubeDesc')}</p>
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {t('socialMedia.youtubeBtn')} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Instagram */}
        <div className="uni-card overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-5 text-white">
            <div className="flex items-center gap-3 mb-1">
              <Instagram className="w-7 h-7" />
              <h2 className="font-bold text-lg">Instagram</h2>
            </div>
            <p className="text-pink-50 text-sm">{t('socialMedia.instagramSubtitle')}</p>
          </div>
          <div className="p-4 space-y-4">
            {INSTAGRAM_REELS.map(id => (
              <div key={id} className="rounded-xl overflow-hidden border border-gray-100 dark:border-navy-700" style={{ aspectRatio: '9/13' }}>
                <iframe
                  className="w-full h-full"
                  src={`https://www.instagram.com/reel/${id}/embed`}
                  title={`Yildiz Instagram post ${id}`}
                  scrolling="no"
                />
              </div>
            ))}
          </div>
          <div className="p-5 pt-0 space-y-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('socialMedia.instagramDesc')}</p>
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-opacity text-sm">
              {t('socialMedia.instagramBtn')} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="uni-card overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white">
            <div className="flex items-center gap-3 mb-1">
              <MessageCircle className="w-7 h-7" />
              <h2 className="font-bold text-lg">WhatsApp</h2>
            </div>
            <p className="text-green-50 text-sm">{t('socialMedia.whatsappSubtitle')}</p>
          </div>
          <div className="p-5">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
              {t('socialMedia.whatsappDesc')}
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {t('contact.chatWhatsapp')} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
