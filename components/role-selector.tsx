'use client'

import { Shield, User, Brain, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import Link from 'next/link'
import styles from '@/app/landing.module.css'
import { ThemeToggle } from '@/components/theme-toggle'

export function RoleSelector() {
  const { setRole } = useApp()
  const router = useRouter()

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
      {/* Landing Page Background System */}
      <div className={styles.heroBackground}>
        <div className={styles.blurredCircle1}></div>
        <div className={styles.blurredCircle2}></div>
        <div className={styles.animatedGrid}></div>
        {/* Glowing particles */}
        {Array.from({ length: 10 }).map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 73) % 100;
          const delay = (i * 0.6).toFixed(2);
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

      {/* Floating ThemeToggle & Back link */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
        <Link 
          href="/" 
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          ← Back to Site
        </Link>
        <ThemeToggle />
      </div>

      {/* Logo / Brand */}
      <div className="mb-12 text-center relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <Brain className="w-6 h-6 text-teal-400 animate-pulse" />
          </div>
          <span className="font-sora text-3xl font-bold tracking-tight text-white">
            Ergono<span className="text-teal-400">AI</span>
          </span>
        </div>
        <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
          Occupational health & ergonomics platform for MENA region workplaces
        </p>
      </div>

      {/* Role selection */}
      <div className="w-full max-w-3xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-center text-xs uppercase tracking-widest text-slate-500 mb-8 font-mono">
          Select your role to continue
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HR Manager */}
          <button
            onClick={() => {
              setRole('hr')
              router.push('/signup?role=hr')
            }}
            className="group relative p-8 rounded-2xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md hover:border-teal-500/40 transition-all duration-300 text-left cursor-pointer shadow-2xl hover:shadow-[0_0_50px_rgba(20,184,166,0.15)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/20 transition-all shrink-0">
                <Shield className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h2 className="font-sora text-lg font-bold text-white mb-2">HR Manager</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Manage department spaces, review aggregated wellbeing data, hazard checklists, and AI-driven recommendations.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-white/5">
              <ul className="space-y-2">
                {[
                  'Company-wide wellbeing overview',
                  'Facility hazard checklist',
                  'AI recommendations engine',
                  'Exportable compliance reports',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-450 shrink-0 bg-teal-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-6 flex justify-end">
              <div className="text-xs text-teal-400 font-bold group-hover:text-teal-300 transition-colors">Get Started →</div>
            </div>
          </button>

          {/* Employee */}
          <button
            onClick={() => {
              setRole('employee')
              router.push('/signup?role=employee')
            }}
            className="group relative p-8 rounded-2xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300 text-left cursor-pointer shadow-2xl hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all shrink-0">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-sora text-lg font-bold text-white mb-2">Employee</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Complete private self-assessments, track your personal wellbeing, and report hazard observations.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-white/5">
              <ul className="space-y-2">
                {[
                  'Private wellbeing assessment',
                  'Interactive body map',
                  'Personal score history',
                  'Hazard observation reports',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 shrink-0 bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-6 flex justify-end">
              <div className="text-xs text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">Get Started →</div>
            </div>
          </button>
        </div>

        {/* Privacy notice */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Activity className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-white">Privacy by design.</strong> Individual employee responses are never visible to HR, Safety Officers, or the OSH Committee. Only anonymized aggregates above the configured threshold are shared.
          </p>
        </div>
      </div>
    </div>
  )
}
