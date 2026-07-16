'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function Problem() {
  const { language } = useApp()
  const t = translations[language].problem

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600">
            {t.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.items.map((item: any, i: number) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 text-xl">
                ❌
              </div>
              <h3 className="font-sora text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <p className="text-teal-600 font-medium mb-4 tracking-wide uppercase text-sm">{t.solutionTag}</p>
          <h2 className="font-sora text-4xl md:text-6xl font-bold text-slate-900">
            {t.meet}
          </h2>
        </div>
      </div>
    </section>
  )
}

