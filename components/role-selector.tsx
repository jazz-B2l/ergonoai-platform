'use client'

import { Shield, User, Brain, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import Link from 'next/link'
import styles from '@/app/landing.module.css'
import { ThemeToggle } from '@/components/theme-toggle'
import { translations } from '@/lib/translations'

export function RoleSelector() {
  const { setRole, language } = useApp()
  const router = useRouter()
  const t = translations[language].roleSelect
  const tc = translations[language].common

  return (
    <div className="min-h-screen text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Landing Page Background System */}
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

      {/* Back to Site — top left */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md"
        >
          {language === 'ar' ? '← ' + tc.backToSite : tc.backToSite + ' →'}
        </Link>
      </div>

      {/* Floating ThemeToggle — top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Logo / Brand */}
      <div className="mb-12 text-center relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-teal-500/20 border border-brand/20 dark:border-teal-500/30 flex items-center justify-center shadow-md dark:shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <Brain className="w-6 h-6 text-brand" />
          </div>
          <span className="font-sora text-3xl font-bold tracking-tight text-foreground">
            Ergono<span className="text-brand">AI</span>
          </span>
        </div>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Role selection */}
      <div className="w-full max-w-3xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground/75 mb-8 font-mono">
          {t.title}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HR Manager */}
          <button
            onClick={() => {
              setRole('hr')
              router.push('/signup?role=hr')
            }}
            className="group relative p-8 rounded-2xl border border-border dark:border-white/10 bg-card/80 dark:bg-slate-900/40 hover:bg-card dark:hover:bg-slate-900/60 backdrop-blur-md hover:border-brand/40 dark:hover:border-teal-500/40 transition-all duration-300 text-start cursor-pointer shadow-lg hover:shadow-xl dark:hover:shadow-[0_0_50px_rgba(20,184,166,0.15)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 dark:from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-teal-500/10 border border-brand/20 dark:border-teal-500/20 flex items-center justify-center group-hover:bg-brand/25 dark:group-hover:bg-teal-500/20 transition-all shrink-0">
                <Shield className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h2 className="font-sora text-lg font-bold text-foreground mb-2">{t.hrManager}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.hrManagerDesc}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-border dark:border-white/5">
              <ul className="space-y-2">
                {t.hrFeatures.map((item: string) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-6 flex justify-end">
              <div className="text-xs text-brand font-bold transition-colors">
                {language === 'ar' ? '← ' + tc.getStarted : tc.getStarted + ' →'}
              </div>
            </div>
          </button>

          {/* Employee */}
          <button
            onClick={() => {
              setRole('employee')
              router.push('/signup?role=employee')
            }}
            className="group relative p-8 rounded-2xl border border-border dark:border-white/10 bg-card/80 dark:bg-slate-900/40 hover:bg-card dark:hover:bg-slate-900/60 backdrop-blur-md hover:border-success/40 dark:hover:border-emerald-500/40 transition-all duration-300 text-start cursor-pointer shadow-lg hover:shadow-xl dark:hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-success/5 dark:from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 dark:bg-emerald-500/10 border border-success/20 dark:border-emerald-500/20 flex items-center justify-center group-hover:bg-success/20 dark:group-hover:bg-emerald-500/20 transition-all shrink-0">
                <User className="w-6 h-6 text-success" />
              </div>
              <div>
                <h2 className="font-sora text-lg font-bold text-foreground mb-2">{t.employee}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.employeeDesc}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-border dark:border-white/5">
              <ul className="space-y-2">
                {t.employeeFeatures.map((item: string) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-6 flex justify-end">
              <div className="text-xs text-success font-bold transition-colors">
                {language === 'ar' ? '← ' + tc.getStarted : tc.getStarted + ' →'}
              </div>
            </div>
          </button>
        </div>

        {/* Privacy notice */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-sm">
          <Activity className="w-4 h-4 text-brand mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">{t.privacyTitle}</strong> {t.privacyDesc}
          </p>
        </div>
      </div>
    </div>
  )
}
