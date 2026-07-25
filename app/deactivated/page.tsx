import Link from 'next/link'

export default function DeactivatedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Deactivated</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Your organization's account has been deactivated by the system administrator. 
            All physical posture assessments and workspace telemetry are temporarily suspended.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white dark:text-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Back to Homepage
          </Link>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          If you believe this is an error, please reach out to your account administrator or ErgonoAI support.
        </p>
      </div>
    </div>
  )
}
