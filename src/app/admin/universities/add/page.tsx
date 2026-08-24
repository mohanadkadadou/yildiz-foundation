import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { UniversityForm } from '@/components/admin/UniversityForm'

export default function AddUniversityPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/universities" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Add New University</h1>
      </div>
      <UniversityForm mode="create" />
    </div>
  )
}
