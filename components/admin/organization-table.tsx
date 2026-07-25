'use client'

import { useState } from 'react'
import { toggleOrganizationActiveStatus } from '@/app/admin/actions'

interface Org {
  id: string
  name: string
  industry: string | null
  country: string | null
  district: string | null
  city: string | null
  employee_count: number | null
  subscription_plan: string | null
  created_at: string
  is_active: boolean
}

interface OrganizationTableProps {
  initialOrgs: Org[]
}

export function OrganizationTable({ initialOrgs }: OrganizationTableProps) {
  const [orgs, setOrgs] = useState<Org[]>(initialOrgs)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggleActive = async (orgId: string, currentStatus: boolean) => {
    setLoadingId(orgId)
    try {
      const nextStatus = !currentStatus
      await toggleOrganizationActiveStatus(orgId, nextStatus)
      setOrgs(prev => 
        prev.map(o => o.id === orgId ? { ...o, is_active: nextStatus } : o)
      )
    } catch (err) {
      alert('Failed to update organization status. Please try again.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Organization Name</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country / Wilaya</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">Joined Date</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="p-4 font-semibold text-slate-950 dark:text-white text-sm">{org.name}</td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{org.industry || 'N/A'}</td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{org.country || 'N/A'}</td>
                <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                  {new Date(org.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${
                    org.is_active 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                  }`}>
                    {org.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  <button
                    onClick={() => handleToggleActive(org.id, org.is_active)}
                    disabled={loadingId === org.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                      org.is_active 
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400'
                    }`}
                  >
                    {loadingId === org.id ? 'Updating...' : org.is_active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}

            {orgs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-base font-medium">No organizations found</p>
                  <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">Wait for organizations to sign up to see them listed here.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
