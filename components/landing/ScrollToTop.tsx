'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useApp } from '@/lib/app-context'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const { language } = useApp()
  const isAr = language === 'ar'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label={isAr ? 'العودة إلى الأعلى' : 'Back to top'}
      title={isAr ? 'العودة إلى الأعلى' : 'Back to top'}
      className={`fixed bottom-8 ${isAr ? 'left-8' : 'right-8'} z-50 p-3.5 rounded-full bg-teal-600 dark:bg-teal-500 text-white shadow-xl shadow-teal-500/25 border border-teal-400/40 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-teal-500 dark:hover:bg-teal-400 cursor-pointer ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  )
}
