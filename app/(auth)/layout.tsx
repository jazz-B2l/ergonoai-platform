'use client'

import { ReactNode } from 'react'
import { Hexagon } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { language } = useApp()
  const t = translations[language].auth

  return (
    <div className="flex min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Hexagon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              ErgonoAI
            </span>
          </div>
          {children}
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80"
          alt="Office ergonomic workplace"
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
            {t.enterpriseErgonomics}
          </h2>
          <p className="text-lg text-blue-100 max-w-xl">
            {t.heroSubtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
