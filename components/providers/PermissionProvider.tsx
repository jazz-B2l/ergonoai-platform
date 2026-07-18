'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Role, AppPermission } from '@/lib/types'
import { sessionService } from '@/lib/auth/session'
import { SessionContext } from './SessionProvider'
import { CompanyContext } from './CompanyProvider'

interface PermissionContextType {
  role: Role | null
  permissions: AppPermission[]
  isLoading: boolean
  refreshPermissions: () => Promise<void>
}

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

export function PermissionProvider({ children }: { children: ReactNode }) {
  const sessionCtx = useContext(SessionContext)
  const companyCtx = useContext(CompanyContext)
  
  const [role, setRole] = useState<Role | null>(null)
  const [permissions, setPermissions] = useState<AppPermission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  if (!sessionCtx || !companyCtx) {
    throw new Error('PermissionProvider must be used within SessionProvider and CompanyProvider')
  }

  const { user, isLoading: sessionLoading } = sessionCtx
  const { activeCompany, isLoading: companyLoading } = companyCtx

  const refreshPermissions = async () => {
    if (!user || !activeCompany) {
      setRole(null)
      setPermissions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const userRole = await sessionService.fetchRole(user.id, activeCompany.id)
      setRole(userRole)
      
      if (userRole) {
        const rolePerms = await sessionService.fetchPermissions(userRole)
        setPermissions(rolePerms?.permissions || [])
      } else {
        setPermissions([])
      }
    } catch (err) {
      console.error('Failed to fetch permissions:', err)
      setRole(null)
      setPermissions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!sessionLoading && !companyLoading) {
      refreshPermissions()
    } else {
      setIsLoading(true)
    }
  // We explicitly want to refresh when activeCompany changes (company switching)
  }, [user, activeCompany, sessionLoading, companyLoading])

  return (
    <PermissionContext.Provider value={{ role, permissions, isLoading, refreshPermissions }}>
      {children}
    </PermissionContext.Provider>
  )
}
