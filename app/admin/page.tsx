import { getOrganizationsAsAdmin } from './actions'

export default async function AdminPage() {
  const organizations = await getOrganizationsAsAdmin()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Organizations</h1>
        <p className="text-slate-500 dark:text-slate-400">
          View and manage all signed-up organizations across the platform.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization Name</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country / Wilaya</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">City / District</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Employees</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subscription</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {organizations?.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-semibold text-slate-950 dark:text-white text-sm">{org.name}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{org.industry || 'N/A'}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{org.country || 'N/A'}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{org.district || org.city || 'N/A'}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{org.employee_count || '0'}</td>
                  <td className="p-4 text-sm">
                    {org.subscription_plan && (
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${
                        org.subscription_plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        org.subscription_plan === 'PRO' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {org.subscription_plan}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(org.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {(!organizations || organizations.length === 0) && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-base font-medium">No organizations found</p>
                    <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">Wait for organizations to sign up to see them listed here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
