import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const updates: any = {}
    if (typeof data.name === 'string') updates.name = data.name.trim() || null
    if (['ADMIN', 'CONSULTANT', 'STUDENT'].includes(data.role)) {
      if (data.role !== 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
        const target = await prisma.user.findUnique({ where: { id: id } })
        if (target?.role === 'ADMIN' && adminCount <= 1) {
          return NextResponse.json({ error: 'Cannot demote the last remaining admin' }, { status: 400 })
        }
      }
      updates.role = data.role
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: updates,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if ((session.user as any).id === id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
  }

  try {
    const target = await prisma.user.findUnique({ where: { id: id } })
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (target.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
      if (adminCount <= 1) return NextResponse.json({ error: 'Cannot delete the last remaining admin' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete: this user has related bookings, applications, or favorites' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
