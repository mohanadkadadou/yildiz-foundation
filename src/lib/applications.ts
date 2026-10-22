import { unlink } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { PRIVATE_DIR } from './private-files'

export async function getSessionUser() {
  const session = await getServerSession(authOptions)
  const u = session?.user as { id?: string; role?: string; email?: string | null; name?: string | null } | undefined
  if (!u?.id) return null
  return { id: u.id, role: u.role || 'STUDENT', email: u.email || '', name: u.name || '' }
}

export const EDITABLE_STATUSES = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW'] as const
export const isEditable = (status: string) => (EDITABLE_STATUSES as readonly string[]).includes(status)

export async function removeStoredFiles(storedNames: string[]) {
  await Promise.all(storedNames.map(n => unlink(path.join(PRIVATE_DIR, n)).catch(() => {})))
}

export const REQUIRED_DOC_RULE = (types: string[]) =>
  types.includes('PASSPORT') && (types.includes('CERTIFICATE') || types.includes('TRANSCRIPT'))
