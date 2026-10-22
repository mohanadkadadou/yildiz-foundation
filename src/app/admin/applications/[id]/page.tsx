import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, FileText, Download, Eye, Mail, Phone, Globe2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ApplicationReview } from './ApplicationReview'

export const dynamic = 'force-dynamic'
const DOC_LABEL: Record<string, string> = { PASSPORT: 'Passport', CERTIFICATE: 'High school certificate', TRANSCRIPT: 'Transcript', PHOTO: 'Photo', LANGUAGE: 'Language certificate', OTHER: 'Other' }
const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)

export default async function AdminApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await prisma.application.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true, country: true } },
      university: { select: { slug: true, nameEn: true } }, program: { select: { nameEn: true } },
      files: { orderBy: { createdAt: 'asc' } }, events: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!app) notFound()

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/applications" className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">{app.user.name || app.user.email}</h1>
          <p className="text-sm text-gray-500">{app.university.nameEn}{app.program ? ` · ${app.program.nameEn}` : ''}{app.intake ? ` · ${app.intake}` : ''}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
            <h2 className="font-bold mb-4">Student</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <a href={`mailto:${app.user.email}`} className="flex items-center gap-2 text-blue-600 hover:underline break-all"><Mail className="w-4 h-4 shrink-0" />{app.user.email}</a>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{app.user.phone ? <a href={`https://wa.me/${app.user.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" dir="ltr">{app.user.phone}</a> : '—'}</div>
              <div className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-gray-400" />{app.user.country || '—'}</div>
            </div>
            {app.notes && <div className="mt-4 bg-gray-50 dark:bg-navy-900 rounded-xl p-4 text-sm whitespace-pre-line"><div className="text-xs font-semibold text-gray-500 mb-1">Message from the student</div>{app.notes}</div>}
          </section>

          <section className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
            <h2 className="font-bold mb-4">Documents ({app.files.length})</h2>
            {app.files.length === 0 ? <p className="text-sm text-gray-400">No documents uploaded.</p> : (
              <ul className="space-y-2">{app.files.map(f => (
                <li key={f.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-navy-700">
                  <FileText className="w-5 h-5 text-navy-500 shrink-0" />
                  <div className="min-w-0 flex-1"><div className="text-sm font-medium">{DOC_LABEL[f.type]}</div><div className="text-xs text-gray-400 truncate">{f.fileName} · {kb(f.size)} · {format(new Date(f.createdAt), 'MMM d, yyyy')}</div></div>
                  <a href={`/api/documents/${f.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><Eye className="w-4 h-4" />View</a>
                  <a href={`/api/documents/${f.id}?download=1`} className="flex items-center gap-1 text-sm text-gray-600 hover:underline"><Download className="w-4 h-4" />Download</a>
                </li>
              ))}</ul>
            )}
          </section>
        </div>
        <div className="space-y-6">
          <ApplicationReview id={app.id} status={app.status} adminMessage={app.adminMessage || ''} adminNotes={app.adminNotes || ''} />
          <section className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700">
            <h2 className="font-bold mb-3">History</h2>
            <ol className="space-y-3 text-sm">{app.events.map(e => (
              <li key={e.id}><div className="font-medium">{e.status.replace('_', ' ')}</div><div className="text-xs text-gray-400">{format(new Date(e.createdAt), 'MMM d, yyyy HH:mm')}</div>{e.note && <div className="text-xs text-gray-600 mt-0.5">{e.note}</div>}</li>
            ))}</ol>
          </section>
        </div>
      </div>
    </div>
  )
}
