import toast from 'react-hot-toast'

interface Options {
  method?: string
  body?: unknown
  successMessage?: string
  errorMessage?: string
}

export async function adminFetch(url: string, { method = 'POST', body, successMessage, errorMessage }: Options = {}) {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      toast.error(data.error || errorMessage || 'Something went wrong')
      return { ok: false, data }
    }
    if (successMessage) toast.success(successMessage)
    return { ok: true, data }
  } catch {
    toast.error(errorMessage || 'Network error')
    return { ok: false, data: null }
  }
}
