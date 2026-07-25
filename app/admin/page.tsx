import { getOrganizationsAsAdmin } from './actions'
import { OrganizationTable } from '@/components/admin/organization-table'

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

      <OrganizationTable initialOrgs={organizations || []} />
    </div>
  )
}
