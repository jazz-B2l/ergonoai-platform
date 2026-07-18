import type { Metadata, Viewport } from 'next'
import { Inter, Sora, Geist_Mono } from 'next/font/google'
import { AppProvider } from '@/lib/app-context'
import { AppProviders } from '@/components/providers/AppProviders'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'ERGOPSYC.AI — Occupational Health & Wellbeing Platform',
  description:
    'B2B platform for MENA region companies to identify, document, and improve occupational hazards and employee ergonomic wellbeing.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f8fa',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${sora.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppProviders>
          <AppProvider>{children}</AppProvider>
        </AppProviders>
      </body>
    </html>
  )
}
