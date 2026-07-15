'use client'

import { Shield, User, Brain, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'

export function RoleSelector() {
  const { setRole } = useApp()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo / Brand */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-brand" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            ERGO<span className="text-brand">PSYC</span>.AI
          </span>
        </div>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          Occupational health & ergonomics platform for MENA region workplaces
        </p>
      </div>

      {/* Role selection */}
      <div className="w-full max-w-2xl">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8 font-mono">
          Select your role to continue
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button
            onClick={() => {
              setRole('hr')
              router.push('/signup?role=hr')
            }}
            className="group relative p-8 rounded-2xl border border-border bg-card hover:border-brand/40 hover:bg-brand/5 transition-all duration-200 text-left cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center group-hover:bg-brand/20 transition-colors shrink-0">
                <Shield className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">HR Manager</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage department spaces, review aggregated wellbeing data, hazard checklists, and AI-driven recommendations.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <ul className="space-y-2">
                {[
                  'Company-wide wellbeing overview',
                  'Facility hazard checklist',
                  'AI recommendations engine',
                  'Exportable compliance reports',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs text-brand font-medium">Get Started →</div>
            </div>
          </button>

          {/* Employee */}
          <button
            onClick={() => {
              setRole('employee')
              router.push('/signup?role=employee')
            }}
            className="group relative p-8 rounded-2xl border border-border bg-card hover:border-success/40 hover:bg-success/5 transition-all duration-200 text-left cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center group-hover:bg-success/20 transition-colors shrink-0">
                <User className="w-6 h-6 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Employee</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete private self-assessments, track your personal wellbeing, and report hazard observations.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <ul className="space-y-2">
                {[
                  'Private wellbeing assessment',
                  'Interactive body map',
                  'Personal score history',
                  'Hazard observation reports',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-success/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs text-success font-medium">Get Started →</div>
            </div>
          </button>
        </div>

        {/* Privacy notice */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
          <Activity className="w-4 h-4 text-brand mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Privacy by design.</strong> Individual employee responses are never visible to HR, Safety Officers, or the OSH Committee. Only anonymized aggregates above the configured threshold are shared.
          </p>
        </div>
      </div>
    </div>
  )
}
