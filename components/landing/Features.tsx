'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function Features() {
  const { language } = useApp()
  const items = translations[language].featuresSection.items

  const gradients = [
    "linear-gradient(135deg, #0f766e, #14b8a6)",
    "linear-gradient(135deg, #1e293b, #334155)",
    "linear-gradient(135deg, #f59e0b, #fbbf24)",
    "linear-gradient(135deg, #3b82f6, #60a5fa)"
  ]

  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {items.map((feature: any, idx: number) => (
          <div key={idx} className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            {/* Image Side - Mocked with CSS gradient for realistic preview block */}
            <div className="w-full md:w-1/2">
              <div 
                className="aspect-[4/3] rounded-2xl shadow-2xl relative overflow-hidden"
                style={{ background: gradients[idx] || gradients[0] }}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-8 rounded-xl border border-white/20 p-6 shadow-inner">
                  {/* Abstract UI representation */}
                  <div className="w-1/3 h-4 bg-white/30 rounded mb-6"></div>
                  <div className="w-full h-32 bg-white/20 rounded mb-4"></div>
                  <div className="flex gap-4">
                    <div className="w-1/2 h-20 bg-white/20 rounded"></div>
                    <div className="w-1/2 h-20 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Text Side */}
            <div className="w-full md:w-1/2">
              <h3 className="font-sora text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {feature.title}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

