'use client'

import styles from '@/app/landing.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { Sparkles, TrendingUp, Info, ShieldCheck, ChevronRight } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { MouseEvent, useState } from 'react'

const dashboardImages = [
  { src: '/dashboard-preview.png', alt: 'ErgonoAI Departments Dashboard', label: 'Departments' },
  { src: '/dashboard-preview-2.jpg', alt: 'ErgonoAI AI Recommendations Dashboard', label: 'AI Recommendations' },
]

export function Hero() {
  const { language } = useApp()
  const t = translations[language].hero
  const tc = translations[language].common

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageKey, setImageKey] = useState(0)

  function handleNextImage() {
    setCurrentImageIndex((prev) => (prev + 1) % dashboardImages.length)
    setImageKey((prev) => prev + 1)
  }

  // Mouse parallax motion for 3D Dashboard preview
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(smoothY, [-300, 300], [12, 4])
  const rotateY = useTransform(smoothX, [-500, 500], [-8, 8])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - (left + width / 2)
    const y = e.clientY - (top + height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-[120vh] pt-32 overflow-hidden flex flex-col items-center isolate"
    >
      {/* Background Elements */}
      <div className={styles.heroBackground}>
        <div className={styles.blurredCircle1}></div>
        <div className={styles.blurredCircle2}></div>
        <div className={styles.animatedGrid}></div>
        {/* Giant ErgonoAI watermark background text */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[11vw] font-black opacity-[0.04] dark:opacity-[0.03] text-slate-900 dark:text-white tracking-widest uppercase font-sora z-0 whitespace-nowrap">
          {t.ergonoaiWord}
        </div>
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
        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-sora text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8"
        >
          {t.titleLine1}<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300">
            {t.titleLine2}
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t.subtitle}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/role-select" className="w-full sm:w-auto text-center bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-4 rounded-full text-base font-semibold transition-all shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:scale-105">
            {tc.startFreeTrial}
          </Link>
          <button className="w-full sm:w-auto bg-slate-200/80 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white backdrop-blur-md px-8 py-4 rounded-full text-base font-semibold transition-all border border-slate-300 dark:border-white/10 hover:scale-105">
            {tc.watchDemo}
          </button>
        </motion.div>
      </div>

      {/* 3D Dashboard Mockup */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 mt-16 md:mt-32 mb-20 md:mb-40">
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className={styles.dashboardWrapper}
        >
          <div className={`${styles.dashboardElement} bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl`}>
            {/* Mockup Header */}
            <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 bg-slate-100 dark:bg-[#1e293b]">
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            </div>
            {/* Real App Screenshot — switchable */}
            <div className="relative w-full" style={{ paddingBottom: '48.83%' }}>
              <Image
                key={imageKey}
                src={dashboardImages[currentImageIndex].src}
                alt={dashboardImages[currentImageIndex].alt}
                fill
                className={`object-cover object-top ${styles.dashboardImage}`}
                priority
              />
            </div>
          </div>

          {/* Dynamic Expandable Floating Card 1: Company Health */}
          <div 
            className={`${styles.floatingCard1} ${styles.glassCard} p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col gap-2 group cursor-pointer transition-all duration-400 w-full md:w-64 lg:w-72 hover:w-full md:hover:w-96 lg:hover:w-[420px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 hover:border-teal-400/50 hover:scale-105`}
            style={language === 'ar' ? { left: 'auto', right: '-5%' } : undefined}
          >
             <div className="flex items-center justify-between gap-3 shrink-0">
               <div className="flex items-center gap-3 min-w-0">
                 <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0 border border-teal-500/30 group-hover:scale-110 transition-transform duration-300">
                   <span className="text-teal-600 dark:text-teal-400 font-bold text-xl font-geist-mono">87%</span>
                 </div>
                 <div className="min-w-0">
                   <p className={`text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors truncate ${styles.dynamicText}`}>{t.companyHealth}</p>
                   <p className={`text-xs sm:text-sm text-teal-600 dark:text-teal-400 font-medium whitespace-nowrap ${styles.dynamicText}`}>{t.riskReduced}</p>
                 </div>
               </div>
               <Sparkles className={`w-5 h-5 text-teal-600/60 dark:text-teal-400/60 group-hover:text-teal-600 dark:group-hover:text-teal-300 group-hover:rotate-12 transition-all duration-300 shrink-0 ${styles.dynamicIcon}`} />
             </div>

             {/* Smooth Grid Expansion on Hover */}
             <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
               <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                 <div className="pt-3.5 mt-1 border-t border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans space-y-2">
                   <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                     <TrendingUp className="w-3.5 h-3.5 shrink-0" /> Ergonomic Safety Index
                   </div>
                   <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-normal">{t.companyHealthExplanation}</p>
                 </div>
               </div>
             </div>

             {/* Hint when collapsed */}
             <div className="grid grid-rows-[1fr] group-hover:grid-rows-[0fr] transition-[grid-template-rows] duration-300">
               <span className={`overflow-hidden text-[11px] text-slate-500 dark:text-slate-400/80 flex items-center gap-1 font-mono pt-1 ${styles.dynamicText}`}>
                 <span>✨ {t.hoverForDetails}</span>
               </span>
             </div>
          </div>

          {/* Next Image Button — above floatingCard2 */}
          <button
            onClick={handleNextImage}
            className={styles.nextImageBtn}
            aria-label="Next dashboard screenshot"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="text-xs font-semibold font-mono">Next</span>
          </button>

          {/* Dynamic Expandable Floating Card 2: ISO 7730 */}
          <div 
            className={`${styles.floatingCard2} ${styles.glassCard} p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col gap-2 group cursor-pointer transition-all duration-400 w-full md:w-64 lg:w-72 hover:w-full md:hover:w-96 lg:hover:w-[420px] bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 hover:border-emerald-400/50 hover:scale-105`}
            style={language === 'ar' ? { right: 'auto', left: '-5%' } : undefined}
          >
             <div className="flex items-center justify-between gap-3 shrink-0">
               <div className="min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                   <p className={`text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors truncate ${styles.dynamicText}`}>{t.isoCompliant}</p>
                 </div>
                 <p className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap ${styles.dynamicText}`}>{t.aiReady}</p>
               </div>
               <Info className={`w-5 h-5 text-emerald-600/60 dark:text-emerald-400/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 group-hover:rotate-12 transition-all duration-300 shrink-0 ${styles.dynamicIcon}`} />
             </div>

             {/* Smooth Grid Expansion on Hover */}
             <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
               <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                 <div className="pt-3.5 mt-1 border-t border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans space-y-2">
                   <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                     <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> ISO 7730 Thermal & Comfort Standard
                   </div>
                   <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-normal">{t.iso7730Explanation}</p>
                 </div>
               </div>
             </div>

             {/* Hint when collapsed */}
             <div className="grid grid-rows-[1fr] group-hover:grid-rows-[0fr] transition-[grid-template-rows] duration-300">
               <span className={`overflow-hidden text-[11px] text-slate-500 dark:text-slate-400/80 flex items-center gap-1 font-mono pt-1 ${styles.dynamicText}`}>
                 <span>ℹ️ {t.hoverForDetails}</span>
               </span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
