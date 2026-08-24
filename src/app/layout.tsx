// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { SessionProvider } from '@/components/shared/SessionProvider'
import { LocaleProvider } from '@/components/shared/LocaleProvider'
import { Toaster } from 'react-hot-toast'
import { locales, localeConfig, defaultLocale, type Locale } from '@/i18n/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Yildiz Foundation | Turkish University Consultancy',
    template: '%s | Yildiz Foundation',
  },
  description: 'Expert educational consultancy for international students applying to Turkish universities. Discover universities, programs, and scholarships.',
  keywords: ['Turkish universities', 'study in Turkey', 'Turkish university application', 'international students Turkey'],
  authors: [{ name: 'Yildiz Foundation' }],
  creator: 'Yildiz Foundation',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_SA', 'tr_TR'],
    url: 'https://yildizfoundation.com',
    siteName: 'Yildiz Foundation',
    title: 'Yildiz Foundation | Turkish University Consultancy',
    description: 'Your gateway to Turkish universities. Expert guidance for international students.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Yildiz Foundation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yildiz Foundation | Turkish University Consultancy',
    description: 'Your gateway to Turkish universities.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = cookies().get('locale')?.value
  const locale: Locale = locales.includes(cookieLocale as Locale) ? (cookieLocale as Locale) : defaultLocale

  return (
    <html lang={locale} dir={localeConfig[locale].dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
            <LocaleProvider initialLocale={locale}>
              {children}
              <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1e3a8a', color: '#fff' } }} />
            </LocaleProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
