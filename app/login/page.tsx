'use client'

import Link from 'next/link'
import { Shield, User, Brain, ArrowRight } from 'lucide-react'

export default function LoginRoleSelectionPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(circle_at_top,_var(--color-brand-muted))_0_0] opacity-50 blur-3xl pointer-events-none z-0"></div>

      {/* Logo / Brand */}
      <div className="mb-12 text-center relative z-10">
        <Link href="/" className="inline-flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-brand" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            ERGO<span className="text-brand">PSYC</span>.AI
          </span>
        </Link>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          Sign in to access your occupational health & ergonomics portal
        </p>
      </div>

      {/* Role selection */}
      <div className="w-full max-w-2xl relative z-10">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8 font-mono">
          Select your destination to sign in
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Organization Login */}
          <Link
            href="/login/org"
            className="group relative p-8 rounded-2xl border border-border bg-card hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center group-hover:bg-brand/20 transition-colors shrink-0">
                  <Shield className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-1">
                    Organization Portal
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand" />
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    For HR Managers & Admin. Manage department spaces, review safety compliance checklists, and view AI recommendation telemetry.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                Organization Dashboard
              </span>
              <span className="text-xs text-brand font-semibold group-hover:underline">
                Sign in →
              </span>
            </div>
          </Link>

          {/* Employee Login */}
          <Link
            href="/login/employee"
            className="group relative p-8 rounded-2xl border border-border bg-card hover:border-success/40 hover:bg-success/5 transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center group-hover:bg-success/20 transition-colors shrink-0">
                  <User className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-1">
                    Employee Portal
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-success" />
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    For Staff & Team Members. Access your private assessments, track score histories, and report ergonomic hazard observations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                Personal Space
              </span>
              <span className="text-xs text-success font-semibold group-hover:underline">
                Sign in →
              </span>
            </div>
          </Link>
        </div>

        {/* Signup notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Don't have an account?{' '}
            <Link href="/role-select" className="font-semibold text-brand hover:underline">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
