import { getOrganizationsAsAdmin } from './actions'
import { OrganizationTable } from '@/components/admin/organization-table'

export default async function AdminPage() {
  const result = await getOrganizationsAsAdmin()

  if (!result.success) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel Connection Failed</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          {result.error}
        </p>
        <a 
          href="/"
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Return Home
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Organizations</h1>
        <p className="text-slate-500 dark:text-slate-400">
          View and manage all signed-up organizations across the platform.
        </p>
      </div>

      <OrganizationTable initialOrgs={result.data || []} />
    </div>
  )
}
