'use client'

import Link from 'next/link'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { Shield, ShieldCheck, Lock, Award } from 'lucide-react'
import { ScrollReveal } from '@/components/landing/ScrollReveal'

export function Footer() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const tc = translations[language].common

  return (
    <footer className="bg-[#020617] text-slate-400 pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Call-to-Action Banner */}
        <ScrollReveal>
          <div className="bg-slate-900/90 rounded-3xl p-10 md:p-14 text-center border border-slate-800 shadow-2xl shadow-teal-950/30 mb-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-950/30 via-slate-950/40 to-cyan-950/30 pointer-events-none"></div>
            <h2 className="font-sora text-3xl md:text-5xl font-bold text-white mb-4 relative z-10 tracking-tight">
              {isAr ? 'جاهز لتحويل سلامة بيئة العمل في مؤسستك؟' : 'Ready to Elevate Your Workplace Safety?'}
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed font-sans">
              {isAr
                ? 'انضم للمؤسسات التي تعتمد على ErgonoAI للحد من مخاطر الإصابات العضلية واستخراج تقارير الامتثال.'
                : 'Empower your organization with AI-driven ergonomics, instant hazard checklists, and audit-ready OSH compliance.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/role-select" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-4 rounded-full font-semibold transition-all shadow-[0_0_30px_rgba(20,184,166,0.35)] flex items-center justify-center hover:scale-105">
                {tc.getStarted}
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Badges & Links */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 pb-12 border-b border-slate-800/80">
            
            <div className="md:col-span-6 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-sora font-bold text-2xl text-white tracking-tight">ErgonoAI</span>
              </Link>
              <p className="text-xs md:text-sm text-slate-400 max-w-md leading-relaxed font-sans">
                {isAr
                  ? 'المنصة الأولى المعتمدة بالذكاء الاصطناعي لتحليل بيئة العمل والتوافق مع المعايير الدولية ISO 7730 و OSHA.'
                  : 'The premier AI-powered ergonomics & occupational health platform engineered for continuous risk prevention and ISO / OSHA compliance.'}
              </p>

              {/* Compliance Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-teal-300">
                  <Award className="w-3.5 h-3.5 text-teal-400" /> ISO 7730 Compliant
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> OSHA 1910 Ready
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> Privacy By Design
                </span>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <h4 className="font-sora text-white text-sm font-semibold mb-4">{isAr ? 'روابط المنصة' : 'Platform'}</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
                <li><a href="#features" className="hover:text-teal-400 transition-colors">{isAr ? 'وحدات العمل' : 'Core Modules'}</a></li>
                <li><a href="#ai-spotlight" className="hover:text-teal-400 transition-colors">{isAr ? 'مساعد الذكاء الاصطناعي' : 'Groq AI Copilot'}</a></li>
                <li><Link href="/role-select" className="hover:text-teal-400 transition-colors">{isAr ? 'الدخول للمنصة' : 'Portal Access'}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-sora text-white text-sm font-semibold mb-4">{isAr ? 'المعايير والامتثال' : 'Standards & Compliance'}</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
                <li><span className="text-slate-400">ISO 7730 Thermal Ergonomics</span></li>
                <li><span className="text-slate-400">Nordic NMQ Questionnaire</span></li>
                <li><span className="text-slate-400">RULA & REBA Posture Strain</span></li>
                <li><span className="text-slate-400">OSHA 1910 Audit Records</span></li>
              </ul>
            </div>

          </div>
        </ScrollReveal>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} ErgonoAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>ISO 7730 Accredited Engine</span>
            <span>•</span>
            <span>Enterprise Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}


