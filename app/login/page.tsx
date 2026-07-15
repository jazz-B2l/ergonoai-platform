'use client'

import Link from 'next/link'
import { Shield, User, Brain, ArrowRight } from 'lucide-react'
import styles from '@/app/landing.module.css'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LoginRoleSelectionPage() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Landing Page Background System (Visible/glowing in dark mode, clean/subtle in light mode) */}
      <div className={`${styles.heroBackground} opacity-30 dark:opacity-100 transition-opacity duration-300`}>
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
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-2 px-4 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md"
        >
          ← Back to Site
        </Link>
        <ThemeToggle />
      </div>

      {/* Logo / Brand */}
      <div className="mb-12 text-center relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <Link href="/" className="inline-flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-teal-500/20 border border-brand/20 dark:border-teal-500/30 flex items-center justify-center shadow-md dark:shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <Brain className="w-6 h-6 text-brand" />
          </div>
          <span className="font-sora text-3xl font-bold tracking-tight text-foreground">
            Ergono<span className="text-brand">AI</span>
          </span>
        </Link>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          Sign in to access your occupational health & ergonomics portal
        </p>
      </div>

      {/* Role selection */}
      <div className="w-full max-w-3xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground/75 mb-8 font-mono">
          Select your destination to sign in
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Login */}
          <Link
            href="/login/org"
            className="group relative p-8 rounded-2xl border border-border dark:border-white/10 bg-card/80 dark:bg-slate-900/40 hover:bg-card dark:hover:bg-slate-900/60 backdrop-blur-md hover:border-brand/40 dark:hover:border-teal-500/40 transition-all duration-300 text-left flex flex-col justify-between shadow-lg hover:shadow-xl dark:hover:shadow-[0_0_50px_rgba(20,184,166,0.15)] hover:-translate-y-1"
          >
            {/* Ambient card glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 dark:from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-teal-500/10 border border-brand/20 dark:border-teal-500/20 flex items-center justify-center group-hover:bg-brand/25 dark:group-hover:bg-teal-500/20 transition-all shrink-0">
                  <Shield className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h2 className="font-sora text-lg font-bold text-foreground mb-2 flex items-center gap-1.5">
                    Organization Portal
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand" />
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    For HR Managers & Admin. Manage department spaces, review safety compliance checklists, and view AI recommendation telemetry.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-border dark:border-white/5 flex justify-between items-center">
              <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                Organization Dashboard
              </span>
              <span className="text-xs text-brand font-bold">
                Log in →
              </span>
            </div>
          </Link>

          {/* Employee Login */}
          <Link
            href="/login/employee"
            className="group relative p-8 rounded-2xl border border-border dark:border-white/10 bg-card/80 dark:bg-slate-900/40 hover:bg-card dark:hover:bg-slate-900/60 backdrop-blur-md hover:border-success/40 dark:hover:border-emerald-500/40 transition-all duration-300 text-left flex flex-col justify-between shadow-lg hover:shadow-xl dark:hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:-translate-y-1"
          >
            {/* Ambient card glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-success/5 dark:from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 dark:bg-emerald-500/10 border border-success/20 dark:border-emerald-500/20 flex items-center justify-center group-hover:bg-success/20 dark:group-hover:bg-emerald-500/20 transition-all shrink-0">
                  <User className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="font-sora text-lg font-bold text-foreground mb-2 flex items-center gap-1.5">
                    Employee Portal
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-success" />
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    For Staff & Team Members. Access your private assessments, track score histories, and report ergonomic hazard observations.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-border dark:border-white/5 flex justify-between items-center">
              <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                Personal Space
              </span>
              <span className="text-xs text-success font-bold">
                Log in →
              </span>
            </div>
          </Link>
        </div>

        {/* Signup notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Don't have an account?{' '}
            <Link href="/role-select" className="font-semibold text-brand hover:underline transition-colors">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
