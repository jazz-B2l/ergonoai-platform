import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Restricted</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            You do not have the required permissions or role to view this page or resource.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 transition-colors shadow-sm"
          >
            Back to Safety Overview
          </Link>
          <Link
            href="/role-select"
            className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Switch Role / Portal
          </Link>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Need access? Please contact your organization administrator.
        </p>
      </div>
    </div>
  )
}
