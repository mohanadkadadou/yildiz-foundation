import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ApplicationClient } from './ApplicationClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My application' }

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) redirect(`/auth/login?callbackUrl=/account/applications/${id}`)

  const app = await prisma.application.findFirst({
    where: { id, userId },
    select: {
      id: true, status: true, intake: true, notes: true, adminMessage: true, createdAt: true,
      university: { select: { slug: true, nameEn: true, nameAr: true, nameTr: true } },
      program: { select: { nameEn: true, nameAr: true, nameTr: true } },
      files: { select: { id: true, type: true, fileName: true, mimeType: true, size: true, createdAt: true }, orderBy: { createdAt: 'asc' } },
      events: { select: { id: true, status: true, note: true, createdAt: true }, orderBy: { createdAt: 'asc' } },
      user: { select: { phone: true, country: true } },
    },
  })
  if (!app) notFound()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <ApplicationClient app={app} />
      <Footer />
    </div>
  )
}
