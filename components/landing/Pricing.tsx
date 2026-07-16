'use client'

import Link from 'next/link'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function Pricing() {
  const { language } = useApp()
  const t = translations[language].pricing

  const tiers = [
    {
      name: t.tiers[0].name,
      price: t.tiers[0].price,
      desc: t.tiers[0].desc,
      features: t.tiers[0].features,
      cta: t.tiers[0].cta,
      highlighted: false
    },
    {
      name: t.tiers[1].name,
      price: t.tiers[1].price,
      period: t.period,
      desc: t.tiers[1].desc,
      features: t.tiers[1].features,
      cta: t.tiers[1].cta,
      highlighted: true
    },
    {
      name: t.tiers[2].name,
      price: t.tiers[2].price,
      desc: t.tiers[2].desc,
      features: t.tiers[2].features,
      cta: t.tiers[2].cta,
      highlighted: false
    }
  ]

  return (
    <section id="pricing" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600">
            {t.desc}
          </p>
        </div>


        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <div key={i} className={`rounded-3xl p-8 flex flex-col border ${tier.highlighted ? 'bg-slate-900 text-white border-slate-900 shadow-2xl relative transform md:-translate-y-4' : 'bg-white border-slate-200 shadow-sm'}`}>
              {tier.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-teal-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{t.mostPopular}</span>
                </div>
              )}
              <h3 className={`font-sora text-xl font-semibold mb-2 ${tier.highlighted ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
              <p className={`text-sm mb-6 ${tier.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{tier.desc}</p>
              
              <div className="mb-8">
                <span className="font-sora text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className={`text-sm ${tier.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{tier.period}</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 shrink-0 ${tier.highlighted ? 'text-teal-400' : 'text-teal-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${tier.highlighted ? 'text-slate-300' : 'text-slate-600'}`}>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href="/role-select" className={`w-full py-3 rounded-full font-medium transition-colors text-center ${
                tier.highlighted 
                ? 'bg-teal-500 hover:bg-teal-400 text-slate-900' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
