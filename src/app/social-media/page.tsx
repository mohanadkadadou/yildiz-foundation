import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SocialMediaClient } from './SocialMediaClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Social Media', description: 'Follow Yildiz Foundation on YouTube, Instagram, and WhatsApp.' }

export default function SocialMediaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <SocialMediaClient />
      <Footer />
    </div>
  )
}
