'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'
import { useCompany } from '@/hooks/useCompany'
import { Role } from '@/lib/types'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login')
    }
  }, [session, isLoading, router])

  if (isLoading || !session) return null

  return <>{children}</>
}

export function RequireRole({ role, children }: { role: Role | 'admin' | 'safety_officer' | 'manager', children: ReactNode }) {
  const { hasRole, isLoading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !hasRole(role)) {
      router.push('/unauthorized') // or dashboard
    }
  }, [isLoading, hasRole, role, router])

  if (isLoading || !hasRole(role)) return null

  return <>{children}</>
}

export function RequirePermission({ permission, children }: { permission: string, children: ReactNode }) {
  const { can, isLoading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !can(permission)) {
      router.push('/unauthorized')
    }
  }, [isLoading, can, permission, router])

  if (isLoading || !can(permission)) return null

  return <>{children}</>
}

export function RequireCompany({ children }: { children: ReactNode }) {
  const { activeCompany, isLoading } = useCompany()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !activeCompany) {
      router.push('/onboarding/company') // or somewhere they can create/join a company
    }
  }, [isLoading, activeCompany, router])

  if (isLoading || !activeCompany) return null

  return <>{children}</>
}
