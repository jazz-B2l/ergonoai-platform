'use client'

import { ReactNode, useContext } from 'react'
import { SessionProvider, SessionContext } from './SessionProvider'
import { UserProvider, UserContext } from './UserProvider'
import { CompanyProvider, CompanyContext } from './CompanyProvider'
import { PermissionProvider, PermissionContext } from './PermissionProvider'
import { AIProviderProvider } from './AIProviderContext'
import { Loader2 } from 'lucide-react'

function SplashLoader() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white">
      <Loader2 className="h-10 w-10 animate-spin text-zinc-400 mb-4" />
      <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading ErgonoAI Enterprise...</p>
    </div>
  )
}

function ProvidersReadyGate({ children }: { children: ReactNode }) {
  const sessionCtx = useContext(SessionContext)
  const userCtx = useContext(UserContext)
  const companyCtx = useContext(CompanyContext)
  const permissionCtx = useContext(PermissionContext)

  // Determine if we are on a public route where we don't need user details
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const publicRoutes = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/']
  const isPublic = publicRoutes.some(r => path === r || path.startsWith(r + '/'))

  // If session is still loading, we must always wait to know the auth state
  if (sessionCtx?.isLoading) {
    return <SplashLoader />
  }

  // If we are on a public route, we don't need to block on profile, company, or permissions loading
  if (!isPublic) {
    const isProtectedLoading = 
      userCtx?.isLoading || 
      companyCtx?.isLoading || 
      permissionCtx?.isLoading

    if (isProtectedLoading) {
      return <SplashLoader />
    }
  }

  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <CompanyProvider>
          <AIProviderProvider>
            <PermissionProvider>
              <ProvidersReadyGate>
                {children}
              </ProvidersReadyGate>
            </PermissionProvider>
          </AIProviderProvider>
        </CompanyProvider>
      </UserProvider>
    </SessionProvider>
  )
}
