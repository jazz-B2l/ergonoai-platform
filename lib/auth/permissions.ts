import { AppPermission, Role, AuthState } from '@/lib/types'

export function can(state: AuthState, permissionName: string): boolean {
  if (!state.isAuthenticated || !state.role) return false
  if (isAdmin(state)) return true // Super admins can do anything
  return state.permissions.some(p => p.name === permissionName)
}

export function cannot(state: AuthState, permissionName: string): boolean {
  return !can(state, permissionName)
}

export function hasRole(state: AuthState, role: Role | 'admin' | 'safety_officer' | 'manager'): boolean {
  if (!state.isAuthenticated || !state.role) return false
  return state.role === role
}

export function hasAnyRole(state: AuthState, roles: string[]): boolean {
  if (!state.isAuthenticated || !state.role) return false
  if (isAdmin(state)) return true
  return roles.includes(state.role as string)
}

export function hasAllPermissions(state: AuthState, permissionNames: string[]): boolean {
  if (!state.isAuthenticated) return false
  if (isAdmin(state)) return true
  return permissionNames.every(name => state.permissions.some(p => p.name === name))
}

export function isAdmin(state: AuthState): boolean {
  // Assuming 'admin' or 'super_admin' might be added later
  return state.role === 'admin' || (state.role as any) === 'super_admin'
}

export function isHR(state: AuthState): boolean {
  return state.role === 'hr'
}

export function isManager(state: AuthState): boolean {
  return (state.role as any) === 'manager'
}

export function isSafetyOfficer(state: AuthState): boolean {
  return (state.role as any) === 'safety_officer'
}

export function isEmployee(state: AuthState): boolean {
  return state.role === 'employee'
}
