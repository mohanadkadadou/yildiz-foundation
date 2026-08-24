'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export interface AlbumPhoto {
  src: string
  title?: string
  subtitle?: string
}

export function AlbumGallery({ photos }: { photos: AlbumPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = () => setOpenIndex(null)
  const prev = () => setOpenIndex(i => (i === null ? null : (i - 1 + photos.length) % photos.length))
  const next = () => setOpenIndex(i => (i === null ? null : (i + 1) % photos.length))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 dark:border-navy-800 text-left"
          >
            <Image src={photo.src} alt={photo.title || 'Yildiz Foundation'} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            {(photo.title || photo.subtitle) && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  {photo.title && <p className="text-white text-sm font-semibold leading-tight">{photo.title}</p>}
                  {photo.subtitle && <p className="text-white/80 text-xs">{photo.subtitle}</p>}
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={close}>
          <button onClick={close} className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-3 md:left-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-3 md:right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="max-w-3xl w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="relative w-full aspect-[3/4] max-h-[75vh] mx-auto rounded-2xl overflow-hidden">
              <Image src={photos[openIndex].src} alt={photos[openIndex].title || 'Yildiz Foundation'} fill className="object-contain" />
            </div>
            {photos[openIndex].title && <p className="text-white font-semibold mt-4">{photos[openIndex].title}</p>}
            {photos[openIndex].subtitle && <p className="text-white/70 text-sm">{photos[openIndex].subtitle}</p>}
          </div>
        </div>
      )}
    </>
  )
}
