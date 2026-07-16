'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { useState } from 'react'

export function Faq() {
  const { language } = useApp()
  const t = translations[language].faq

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t.title}
          </h2>
        </div>

        <div className="space-y-4">
          {t.items.map((faq: any, idx: number) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-start px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-slate-50 transition-colors"
              >
                <span className="font-sora font-semibold text-slate-900">{faq.q}</span>
                <span className={`text-slate-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
