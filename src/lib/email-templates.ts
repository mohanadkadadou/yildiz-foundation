import { SITE_URL } from './mailer'

export type MailLocale = 'en' | 'ar' | 'tr'
export const toMailLocale = (v: unknown): MailLocale => (v === 'ar' || v === 'tr' ? v : 'en')

const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function layout(locale: MailLocale, title: string, bodyHtml: string, button?: { label: string; url: string }) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const align = locale === 'ar' ? 'right' : 'left'
  const footer = { en: 'Yildiz Foundation — your best educational advisor', ar: 'مؤسسة يلدز — مستشارك التعليمي الأفضل', tr: 'Yildiz Vakfı — en iyi eğitim danışmanınız' }[locale]
  return `<!doctype html><html lang="${locale}" dir="${dir}"><body style="margin:0;background:#f3f4f6;font-family:Segoe UI,Tahoma,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0f2057;padding:22px 28px;text-align:${align};"><span style="color:#fbbf24;font-size:20px;font-weight:700;">Yildiz Foundation</span></td></tr>
<tr><td style="padding:30px 28px;text-align:${align};color:#1f2937;font-size:15px;line-height:1.8;">
<h1 style="margin:0 0 16px;font-size:20px;color:#0f2057;">${esc(title)}</h1>
${bodyHtml}
${button ? `<p style="margin:26px 0 4px;"><a href="${esc(button.url)}" style="background:#fbbf24;color:#0f2057;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:10px;display:inline-block;">${esc(button.label)}</a></p>` : ''}
</td></tr>
<tr><td style="background:#f9fafb;padding:16px 28px;text-align:${align};color:#6b7280;font-size:12px;">${footer}<br><a href="${SITE_URL}" style="color:#6b7280;">${SITE_URL.replace(/^https?:\/\//, '')}</a> · WhatsApp +90 539 575 5269</td></tr>
</table></td></tr></table></body></html>`
}

const row = (k: string, v: string) => `<tr><td style="padding:6px 14px 6px 0;color:#6b7280;">${esc(k)}</td><td style="padding:6px 0;font-weight:600;">${esc(v)}</td></tr>`
const table = (rows: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px 0;">${rows}</table>`

const MEETING: Record<MailLocale, Record<string, string>> = {
  en: { ZOOM: 'Zoom call', GOOGLE_MEET: 'Google Meet', WHATSAPP: 'WhatsApp call', IN_PERSON: 'In person' },
  ar: { ZOOM: 'مكالمة زووم', GOOGLE_MEET: 'غوغل ميت', WHATSAPP: 'مكالمة واتساب', IN_PERSON: 'حضورياً' },
  tr: { ZOOM: 'Zoom görüşmesi', GOOGLE_MEET: 'Google Meet', WHATSAPP: 'WhatsApp görüşmesi', IN_PERSON: 'Yüz yüze' },
}

export function bookingConfirmation(p: { locale: MailLocale; firstName: string; date: string; time: string; meetingType: string }) {
  const L = p.locale
  const t = {
    en: { subject: 'We received your consultation request', title: `Thank you, ${p.firstName}!`, intro: 'Your free consultation request has been received. One of our advisors will contact you within 24 hours to confirm the appointment.', date: 'Preferred date', time: 'Preferred time', type: 'Meeting type', note: 'If you need anything sooner, reply to this email or message us on WhatsApp.' },
    ar: { subject: 'استلمنا طلب الاستشارة الخاص بك', title: `شكراً ${p.firstName}!`, intro: 'تم استلام طلب الاستشارة المجانية. سيتواصل معك أحد مستشارينا خلال 24 ساعة لتأكيد الموعد.', date: 'التاريخ المفضل', time: 'الوقت المفضل', type: 'نوع الاجتماع', note: 'إذا احتجت أي شيء بشكل أسرع، يمكنك الرد على هذه الرسالة أو مراسلتنا على واتساب.' },
    tr: { subject: 'Danışmanlık talebinizi aldık', title: `Teşekkürler ${p.firstName}!`, intro: 'Ücretsiz danışmanlık talebiniz alındı. Danışmanlarımızdan biri randevuyu onaylamak için 24 saat içinde sizinle iletişime geçecek.', date: 'Tercih edilen tarih', time: 'Tercih edilen saat', type: 'Görüşme türü', note: 'Daha hızlı yardıma ihtiyacınız olursa bu e-postayı yanıtlayın veya WhatsApp\'tan yazın.' },
  }[L]
  const html = layout(L, t.title, `<p>${esc(t.intro)}</p>${table(row(t.date, p.date) + row(t.time, p.time) + row(t.type, MEETING[L][p.meetingType] || p.meetingType))}<p>${esc(t.note)}</p>`)
  return { subject: t.subject, html }
}

export function adminNewBooking(b: { firstName: string; lastName: string; email: string; phone: string; country: string; preferredDate: string; preferredTime: string; meetingType: string; majorInterest?: string | null; budget?: number | null; notes?: string | null }) {
  const html = layout('en', 'New consultation booking', table(
    row('Name', `${b.firstName} ${b.lastName}`) + row('Email', b.email) + row('Phone', b.phone) + row('Country', b.country) +
    row('Date', b.preferredDate) + row('Time', b.preferredTime) + row('Meeting', MEETING.en[b.meetingType] || b.meetingType) +
    row('Major', b.majorInterest || '-') + row('Budget', b.budget ? `$${b.budget}` : '-') + row('Notes', b.notes || '-'),
  ), { label: 'Open bookings', url: `${SITE_URL}/admin/bookings` })
  return { subject: `New booking: ${b.firstName} ${b.lastName}`, html }
}

const STATUS_TEXT: Record<MailLocale, Record<string, string>> = {
  en: { SUBMITTED: 'Submitted', UNDER_REVIEW: 'Under review', ACCEPTED: 'Accepted', REJECTED: 'Not accepted', WAITLISTED: 'Waitlisted', DRAFT: 'Draft' },
  ar: { SUBMITTED: 'تم التقديم', UNDER_REVIEW: 'قيد المراجعة', ACCEPTED: 'مقبول', REJECTED: 'غير مقبول', WAITLISTED: 'قائمة الانتظار', DRAFT: 'مسودة' },
  tr: { SUBMITTED: 'Gönderildi', UNDER_REVIEW: 'İnceleniyor', ACCEPTED: 'Kabul edildi', REJECTED: 'Kabul edilmedi', WAITLISTED: 'Bekleme listesi', DRAFT: 'Taslak' },
}

export function applicationReceived(p: { locale: MailLocale; name: string; university: string; program?: string | null; id: string }) {
  const L = p.locale
  const t = {
    en: { subject: 'We received your application', title: `Hello ${p.name},`, intro: 'Your application has been submitted. Our team will review it and your documents, and we will email you with every update.', uni: 'University', prog: 'Program', btn: 'Track my application' },
    ar: { subject: 'استلمنا طلب التقديم الخاص بك', title: `مرحباً ${p.name}،`, intro: 'تم إرسال طلبك. سيراجع فريقنا الطلب والمستندات وسنرسل لك بريداً إلكترونياً مع كل تحديث.', uni: 'الجامعة', prog: 'التخصص', btn: 'تابع طلبي' },
    tr: { subject: 'Başvurunuzu aldık', title: `Merhaba ${p.name},`, intro: 'Başvurunuz gönderildi. Ekibimiz başvurunuzu ve belgelerinizi inceleyecek, her gelişmede size e-posta göndereceğiz.', uni: 'Üniversite', prog: 'Program', btn: 'Başvurumu takip et' },
  }[L]
  const html = layout(L, t.title, `<p>${esc(t.intro)}</p>${table(row(t.uni, p.university) + (p.program ? row(t.prog, p.program) : ''))}`, { label: t.btn, url: `${SITE_URL}/account/applications/${p.id}` })
  return { subject: t.subject, html }
}

export function applicationStatus(p: { locale: MailLocale; name: string; university: string; status: string; message?: string | null; id: string }) {
  const L = p.locale
  const status = STATUS_TEXT[L][p.status] || p.status
  const t = {
    en: { subject: `Application update: ${status}`, title: `Hello ${p.name},`, intro: `There is an update on your application to ${p.university}.`, st: 'New status', msg: 'Message from our team', btn: 'View my application' },
    ar: { subject: `تحديث على طلبك: ${status}`, title: `مرحباً ${p.name}،`, intro: `هناك تحديث على طلبك للتقديم في ${p.university}.`, st: 'الحالة الجديدة', msg: 'رسالة من فريقنا', btn: 'عرض طلبي' },
    tr: { subject: `Başvuru güncellemesi: ${status}`, title: `Merhaba ${p.name},`, intro: `${p.university} başvurunuzla ilgili bir güncelleme var.`, st: 'Yeni durum', msg: 'Ekibimizden mesaj', btn: 'Başvurumu görüntüle' },
  }[L]
  const msg = p.message ? `<p style="background:#f9fafb;border-radius:10px;padding:12px 16px;"><strong>${esc(t.msg)}:</strong><br>${esc(p.message).replace(/\n/g, '<br>')}</p>` : ''
  const html = layout(L, t.title, `<p>${esc(t.intro)}</p>${table(row(t.st, status))}${msg}`, { label: t.btn, url: `${SITE_URL}/account/applications/${p.id}` })
  return { subject: t.subject, html }
}

export function adminNewApplication(p: { studentName: string; email: string; university: string; program?: string | null; id: string; docs: number }) {
  const html = layout('en', 'New application submitted', table(
    row('Student', p.studentName) + row('Email', p.email) + row('University', p.university) + row('Program', p.program || '-') + row('Documents', String(p.docs)),
  ), { label: 'Review application', url: `${SITE_URL}/admin/applications/${p.id}` })
  return { subject: `New application: ${p.studentName} → ${p.university}`, html }
}

export function welcomeEmail(p: { locale: MailLocale; name: string }) {
  const L = p.locale
  const t = {
    en: { subject: 'Welcome to Yildiz Foundation', title: `Welcome, ${p.name}!`, intro: 'Your account is ready. You can now apply to universities, upload your documents and follow every step of your application online.', btn: 'Go to my account' },
    ar: { subject: 'أهلاً بك في مؤسسة يلدز', title: `أهلاً بك ${p.name}!`, intro: 'حسابك جاهز. يمكنك الآن التقديم للجامعات ورفع مستنداتك ومتابعة كل خطوات طلبك عبر الإنترنت.', btn: 'الذهاب إلى حسابي' },
    tr: { subject: 'Yildiz Vakfı\'na hoş geldiniz', title: `Hoş geldiniz ${p.name}!`, intro: 'Hesabınız hazır. Artık üniversitelere başvurabilir, belgelerinizi yükleyebilir ve başvurunuzun her adımını çevrimiçi takip edebilirsiniz.', btn: 'Hesabıma git' },
  }[L]
  return { subject: t.subject, html: layout(L, t.title, `<p>${esc(t.intro)}</p>`, { label: t.btn, url: `${SITE_URL}/account` }) }
}
