export async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
  const body = new FormData()
  body.append('file', file)
  try {
    const res = await fetch('/api/admin/upload', { method: 'POST', body })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { error: data.error || 'Upload failed' }
    return { url: data.url }
  } catch {
    return { error: 'Network error while uploading' }
  }
}
