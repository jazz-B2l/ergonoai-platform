import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

export default function OnboardingCompanyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950/30 flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400">
          <Building2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization Required</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            You are not currently linked to an active organization workspace. Please register or join an organization to continue.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/signup?role=hr"
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
          >
            Register Organization
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/role-select"
            className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Select Role
          </Link>
        </div>
      </div>
    </div>
  )
}
