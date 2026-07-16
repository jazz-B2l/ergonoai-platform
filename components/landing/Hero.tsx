'use client'

import styles from '@/app/landing.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function Hero() {
  const { language } = useApp()
  const t = translations[language].hero
  const tc = translations[language].common

  return (
    <section className="relative min-h-[120vh] pt-32 overflow-hidden flex flex-col items-center isolate">
      {/* Background Elements */}
      <div className={styles.heroBackground}>
        <div className={styles.blurredCircle1}></div>
        <div className={styles.blurredCircle2}></div>
        <div className={styles.animatedGrid}></div>
        {/* Glowing particles */}
        {Array.from({ length: 15 }).map((_, i) => {
          const left = (i * 31) % 100;
          const top = (i * 67) % 100;
          const delay = (i * 0.5).toFixed(2);
          return (
            <div 
              key={i} 
              className={styles.glowingParticle} 
              style={{ 
                left: `${left}%`, 
                top: `${top}%`,
                animationDelay: `${delay}s` 
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <h1 className="font-sora text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
          {t.titleLine1}<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
            {t.titleLine2}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/role-select" className="w-full sm:w-auto text-center bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-4 rounded-full text-base font-semibold transition-all shadow-[0_0_40px_rgba(20,184,166,0.4)]">
            {tc.startFreeTrial}
          </Link>
          <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-4 rounded-full text-base font-semibold transition-all border border-white/10">
            {tc.watchDemo}
          </button>
        </div>
      </div>

      {/* 3D Dashboard Mockup */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 mt-32 mb-40">
        <div className={styles.dashboardWrapper}>
          <div className={`${styles.dashboardElement} bg-[#0f172a] rounded-2xl border border-slate-700 overflow-hidden`}>
            {/* Mockup Header */}
            <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-2 bg-[#1e293b]">
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            </div>
            {/* Real App Screenshot */}
            <div className="relative w-full" style={{ paddingBottom: '48.83%' }}>
              <Image
                src="/dashboard-preview.png"
                alt="ErgonoAI Departments Dashboard"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Floating Cards */}
          <div 
            className={`${styles.floatingCard1} ${styles.glassCard} p-4 rounded-xl shadow-2xl flex items-center gap-4`}
            style={language === 'ar' ? { left: 'auto', right: '-5%' } : undefined}
          >
             <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
               <span className="text-teal-400 font-bold text-xl font-geist-mono">87%</span>
             </div>
             <div>
               <p className="text-sm font-semibold text-white">{t.companyHealth}</p>
               <p className="text-xs text-teal-400">{t.riskReduced}</p>
             </div>
          </div>

          <div 
            className={`${styles.floatingCard2} ${styles.glassCard} p-4 rounded-xl shadow-2xl`}
            style={language === 'ar' ? { right: 'auto', left: '-5%' } : undefined}
          >
             <div className="flex items-center gap-3 mb-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <p className="text-sm font-semibold text-white">{t.isoCompliant}</p>
             </div>
             <p className="text-xs text-slate-300">{t.aiReady}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

