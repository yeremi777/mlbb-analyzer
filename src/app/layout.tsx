import type { Metadata } from 'next'
import { Geist, Geist_Mono, Rajdhani } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta')

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        {
          url: '/favicon.ico',
          sizes: 'any',
        },
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
      apple: {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} ${rajdhani.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
