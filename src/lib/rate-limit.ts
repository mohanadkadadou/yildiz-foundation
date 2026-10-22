const hits = new Map<string, { count: number; reset: number }>()

/** Simple in-memory limiter (single server). Returns true when the request is allowed. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.reset < now) { hits.set(key, { count: 1, reset: now + windowMs }); return true }
  entry.count++
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
  return entry.count <= limit
}

export function clientIp(req: Request): string {
  const h = req.headers
  return (h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim()
}
