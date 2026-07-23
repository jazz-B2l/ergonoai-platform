'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { ScrollReveal, SpotlightCard } from '@/components/landing/ScrollReveal'

export function DashboardPreview() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const t = translations[language].dashboardPreview

  return (
    <section className="py-28 bg-slate-50 dark:bg-[#020617] border-y border-slate-200 dark:border-slate-800/80 overflow-hidden relative isolate transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <ScrollReveal>
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20 mb-4 inline-block">
            {isAr ? 'لوحة القيادة الذكية' : 'Enterprise Operational Intelligence'}
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            {t.title}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
            {t.desc}
          </p>
        </ScrollReveal>
      </div>

      {/* Massive Interactive Dashboard UI Simulation */}
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal delay={0.2} distance={40}>
          <SpotlightCard className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden shadow-teal-950/40">
            <div className="flex flex-col md:flex-row h-auto md:h-[550px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] p-5 hidden md:block space-y-6">
                <div className="h-7 bg-teal-500/20 rounded-lg w-full border border-teal-500/30 flex items-center px-3 text-xs font-mono text-teal-700 dark:text-teal-300">
                  ⚡ ErgonoAI Core
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-teal-500/20 dark:bg-teal-900/50 rounded w-full border-l-2 border-teal-500 dark:border-teal-400 pl-2 text-[10px] text-teal-700 dark:text-teal-300 flex items-center font-mono">Overview</div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded w-4/5"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded w-3/4"></div>
                </div>
              </div>
              
              {/* Main Area */}
              <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-[#0f172a] overflow-hidden space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-48 border border-slate-300 dark:border-slate-700"></div>
                  <div className="flex gap-2">
                    <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-24 border border-slate-300 dark:border-slate-700"></div>
                    <div className="h-7 bg-teal-600 rounded-lg w-32 shadow-md"></div>
                  </div>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-slate-200/80 dark:bg-[#1e293b] p-4 rounded-xl border border-slate-300 dark:border-slate-700/80">
                      <div className="h-3 bg-slate-400 dark:bg-slate-600 rounded w-1/2 mb-3"></div>
                      <div className="h-7 bg-slate-700 dark:bg-slate-200 rounded w-2/3 mb-2"></div>
                      <div className="h-2 bg-teal-500/30 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-slate-200/80 dark:bg-[#1e293b] p-5 rounded-xl border border-slate-300 dark:border-slate-700/80 h-56 flex flex-col justify-between">
                    <div className="h-4 bg-slate-400 dark:bg-slate-600 rounded w-1/4"></div>
                    {/* Simulated Animated Bar Chart */}
                    <div className="flex-1 flex items-end gap-3 px-2 pt-4">
                      {[35, 55, 45, 75, 65, 95, 85, 50, 70].map((h, i) => (
                        <div key={i} className="w-full bg-teal-500/30 dark:bg-teal-500/20 rounded-t-sm relative group hover:bg-teal-500/50 dark:hover:bg-teal-400/50 transition-colors" style={{ height: `${h}%` }}>
                          <div className="absolute -top-1 left-0 right-0 h-1 bg-teal-500 dark:bg-teal-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-1 bg-slate-200/80 dark:bg-[#1e293b] p-5 rounded-xl border border-slate-300 dark:border-slate-700/80 h-56 flex flex-col justify-between">
                     <div className="h-4 bg-slate-400 dark:bg-slate-600 rounded w-1/2"></div>
                     <div className="space-y-2.5 flex-1 pt-3 overflow-hidden">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-300 dark:border-slate-800">
                           <div className="h-3 bg-slate-400 dark:bg-slate-600 rounded w-1/2"></div>
                           <div className={`h-3 rounded w-1/4 ${i===1?'bg-rose-500/70': i===2?'bg-amber-500/70': 'bg-emerald-500/70'}`}></div>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </ScrollReveal>
      </div>
    </section>
  )
}

