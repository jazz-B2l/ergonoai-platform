'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function HowItWorks() {
  const { language } = useApp()
  const t = translations[language].howItWorks

  return (
    <section className="py-24 bg-slate-900 text-white relative isolate">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-sora text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight">
          {t.title}
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-800 -z-10"></div>
          
          {t.steps.map((step: any, idx: number) => (
            <div key={idx} className="flex flex-row md:flex-col items-center md:text-center gap-6 md:gap-4 mb-8 md:mb-0 w-full md:w-1/5 px-2 z-10">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg relative group">
                <div className="absolute inset-0 rounded-full bg-teal-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="font-geist-mono text-3xl text-teal-400 font-bold">{step.num}</span>
              </div>
              <div>
                <h4 className="font-sora text-xl font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

