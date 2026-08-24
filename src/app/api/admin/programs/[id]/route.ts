import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const program = await prisma.program.update({
      where: { id: params.id },
      data: {
        nameEn: data.nameEn, nameAr: data.nameAr || data.nameEn, nameTr: data.nameTr || data.nameEn,
        degreeType: data.degreeType, language: data.language,
        tuitionFeeUSD: Number(data.tuitionFeeUSD) || 0, duration: Number(data.duration) || 4,
        category: data.category,
      },
    })
    return NextResponse.json({ success: true, program })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.program.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete: applications reference this program' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 })
  }
}
