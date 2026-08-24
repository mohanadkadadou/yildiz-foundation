import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UniversityForm } from '@/components/admin/UniversityForm'
import { ProgramsManager } from '@/components/admin/ProgramsManager'

export default async function EditUniversityPage({ params }: { params: { id: string } }) {
  const uni = await prisma.university.findUnique({
    where: { id: params.id },
    include: { programs: { orderBy: { createdAt: 'asc' } } },
  })
  if (!uni) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/universities" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Edit {uni.nameEn}</h1>
      </div>

      <div className="space-y-6">
        <UniversityForm
          mode="edit"
          id={uni.id}
          initialData={{
            nameEn: uni.nameEn, nameAr: uni.nameAr, nameTr: uni.nameTr,
            cityEn: uni.cityEn, cityAr: uni.cityAr, cityTr: uni.cityTr,
            type: uni.type, ranking: uni.ranking?.toString() || '', website: uni.website || '',
            logoUrl: uni.logoUrl || '', coverImageUrl: uni.coverImageUrl || '',
            descriptionEn: uni.descriptionEn, descriptionAr: uni.descriptionAr, descriptionTr: uni.descriptionTr,
            establishedYear: uni.establishedYear?.toString() || '', totalStudents: uni.totalStudents?.toString() || '', internationalStudents: uni.internationalStudents?.toString() || '',
            isFeatured: uni.isFeatured, isActive: uni.isActive,
          }}
        />
        <ProgramsManager universityId={uni.id} initialPrograms={uni.programs.map(p => ({ id: p.id, nameEn: p.nameEn, degreeType: p.degreeType, language: p.language, tuitionFeeUSD: p.tuitionFeeUSD, duration: p.duration, category: p.category }))} />
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
