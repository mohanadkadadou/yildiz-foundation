import path from 'path'

// Application documents (passports, certificates…) are sensitive: stored OUTSIDE the web root
// and only ever served through an authenticated route.
export const PRIVATE_DIR = process.env.PRIVATE_UPLOAD_DIR || path.join(process.cwd(), 'private-uploads')

export const MAX_DOC_BYTES = 10 * 1024 * 1024
export const MAX_DOCS_PER_APPLICATION = 15

const SIGNATURES: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { mime: 'application/pdf', ext: 'pdf', test: b => b.subarray(0, 5).toString('latin1') === '%PDF-' },
  { mime: 'image/jpeg', ext: 'jpg', test: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', ext: 'png', test: b => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
]

/** Detects the real file type from its bytes (never trusts the filename or browser MIME type). */
export function detectDocument(buf: Buffer) {
  return SIGNATURES.find(s => s.test(buf)) || null
}

export function safeFileName(name: string) {
  const base = name.replace(/[\\/]/g, '_').replace(/[^\p{L}\p{N}._ -]/gu, '').trim().slice(0, 120)
  return base || 'document'
}
