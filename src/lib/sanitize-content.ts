import sanitizeHtml from 'sanitize-html'

const HAS_HTML = /<\/?[a-z][\s\S]*>/i

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'hr', 'code', 'pre'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, ...(attribs.href && /^https?:/i.test(attribs.href) ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {}) },
    }),
  },
  exclusiveFilter: frame => frame.tag === 'img' && !/^(https?:\/\/|\/uploads\/)/i.test(frame.attribs.src || ''),
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Returns safe HTML. Legacy plain-text posts (no tags) are turned into paragraphs. */
export function toSafeHtml(content: string): string {
  if (!content) return ''
  if (!HAS_HTML.test(content)) {
    return content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean).map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`).join('')
  }
  return sanitizeHtml(content, OPTIONS)
}

export function htmlToText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim()
}

export function readingMinutes(html: string): number {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function slugify(input: string): string {
  return input.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}
