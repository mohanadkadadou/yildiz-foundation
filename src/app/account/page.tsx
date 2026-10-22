import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AccountClient } from './AccountClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My Applications' }

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) redirect('/auth/login?callbackUrl=/account')

  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      university: { select: { slug: true, nameEn: true, nameAr: true, nameTr: true } },
      program: { select: { nameEn: true, nameAr: true, nameTr: true } },
      _count: { select: { files: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Navbar />
      <AccountClient name={session?.user?.name || ''} applications={applications} />
      <Footer />
    </div>
  )
}
