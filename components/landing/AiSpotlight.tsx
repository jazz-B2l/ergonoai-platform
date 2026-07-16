'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function AiSpotlight() {
  const { language } = useApp()
  const t = translations[language].aiSpotlight

  const [isVisible, setIsVisible] = useState(false)
  const fullText = t.userQuery
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    // Reset typing when language changes
    setTypedText('')
  }, [language, fullText])

  useEffect(() => {
    // Simple intersection observer simulation for demo
    const handleScroll = () => {
      const el = document.getElementById('ai-spotlight')
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75) {
          setIsVisible(true)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isVisible && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, typedText, fullText])

  return (
    <section id="ai-spotlight" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Dynamic Gradient Background for AI section */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white/50"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600">
            {t.desc}
          </p>
        </div>

        {/* ChatGPT Style Window */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 justify-center relative">
            <span className="text-xs font-semibold text-slate-500 font-sora">{t.copilotTitle}</span>
          </div>
          
          <div className="p-8 space-y-8 min-h-[400px]">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-teal-600 text-white rounded-2xl rounded-tr-sm px-6 py-4 max-w-[80%] shadow-sm">
                <p className="font-inter text-base">
                  {typedText}
                  <span className="inline-block w-1 h-5 bg-white ml-1 animate-pulse align-middle"></span>
                </p>
              </div>
            </div>

            {/* AI Response - only show when typing is done */}
            {typedText === fullText && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-6 py-6 max-w-[90%] border border-slate-200">
                  <p className="font-inter mb-4">{t.aiIntro}</p>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900 font-sora">{t.issuesTitle}</span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold font-geist-mono">{t.riskLabel}</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• <span className="font-semibold">{t.primaryIssue}:</span> {t.primaryIssueVal}</li>
                      <li>• <span className="font-semibold">{t.secondaryIssue}:</span> {t.secondaryIssueVal}</li>
                      <li>• <span className="font-semibold">{t.impact}:</span> {t.impactVal}</li>
                    </ul>
                  </div>

                  <p className="text-sm text-slate-600 font-medium">{t.aiFooter}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

