'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function Standards() {
  const { language } = useApp()
  const t = translations[language].standards

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
          {t.title}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">ISO</div>
            <span className="font-sora font-semibold text-xl text-slate-800">7730</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sora font-bold text-2xl text-slate-800 tracking-tighter">NMQ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sora font-bold text-2xl text-slate-800 tracking-tighter">RULA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sora font-bold text-2xl text-slate-800 tracking-tighter">REBA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold font-sora text-slate-800 tracking-widest border-2 border-slate-800 px-2 rounded-sm">OSHA</div>
          </div>
        </div>
      </div>
    </section>
  )
}

