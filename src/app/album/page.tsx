import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AlbumGallery } from '@/components/album/AlbumGallery'
import { AlbumHeader } from './AlbumHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Yildiz Album', description: 'Photos from Yildiz Foundation — visits, partnerships, and milestones with our partner universities.' }

const photos = Array.from({ length: 20 }, (_, i) => ({
  src: `/images/album/yildiz-moment-${String(i + 1).padStart(2, '0')}.jpeg`,
}))

export default function AlbumPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <AlbumHeader />
        <div className="container mx-auto px-4">
          <AlbumGallery photos={photos} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
