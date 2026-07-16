'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function Navbar() {
  const { language, setLanguage } = useApp()
  const t = translations[language].navbar
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className={`font-sora font-semibold text-xl ${scrolled ? 'text-slate-900' : 'text-white'}`}>ErgonoAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className={`text-sm font-medium transition-colors hover:text-teal-500 ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>{t.features}</Link>
          <Link href="#solutions" className={`text-sm font-medium transition-colors hover:text-teal-500 ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>{t.solutions}</Link>
          <Link href="#ai" className={`text-sm font-medium transition-colors hover:text-teal-500 ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>{t.ai}</Link>
          <Link href="#pricing" className={`text-sm font-medium transition-colors hover:text-teal-500 ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>{t.pricing}</Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              scrolled
                ? 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                : 'border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>

          <Link href="/login" className={`text-sm font-medium transition-colors hover:text-teal-500 ${scrolled ? 'text-slate-600' : 'text-white'}`}>{t.login}</Link>
          <Link href="/role-select" className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-teal-500/25">
            {t.getStarted}
          </Link>
        </div>
      </div>
    </header>
  )
}

