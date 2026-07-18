import { useContext } from 'react'
import { PermissionContext } from '@/components/providers/PermissionProvider'
import { useAuth } from './useAuth'
import { useCompany } from './useCompany'
import { useUser } from './useUser'
import * as permUtils from '@/lib/auth/permissions'
import { AuthState } from '@/lib/types'

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }

  const { session } = useAuth()
  const { profile } = useUser()
  const { activeCompany } = useCompany()

  // Construct AuthState for utilities
  const authState: AuthState = {
    user: profile,
    activeCompany,
    role: context.role,
    permissions: context.permissions,
    isAuthenticated: !!session,
    isLoading: context.isLoading
  }

  return {
    ...context,
    can: (permissionName: string) => permUtils.can(authState, permissionName),
    cannot: (permissionName: string) => permUtils.cannot(authState, permissionName),
    hasRole: (role: any) => permUtils.hasRole(authState, role),
    hasAnyRole: (roles: string[]) => permUtils.hasAnyRole(authState, roles),
    hasAllPermissions: (permissions: string[]) => permUtils.hasAllPermissions(authState, permissions),
    isAdmin: () => permUtils.isAdmin(authState),
    isHR: () => permUtils.isHR(authState),
    isManager: () => permUtils.isManager(authState),
    isSafetyOfficer: () => permUtils.isSafetyOfficer(authState),
    isEmployee: () => permUtils.isEmployee(authState),
  }
}
