import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AlbumGallery } from '@/components/album/AlbumGallery'
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
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 py-14 px-4 mb-12">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Yildiz Album</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">Moments from our journey — visits, partnerships, and milestones with our partner universities</p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <AlbumGallery photos={photos} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
