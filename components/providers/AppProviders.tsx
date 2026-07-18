'use client'

import { ReactNode, useContext } from 'react'
import { SessionProvider, SessionContext } from './SessionProvider'
import { UserProvider, UserContext } from './UserProvider'
import { CompanyProvider, CompanyContext } from './CompanyProvider'
import { PermissionProvider, PermissionContext } from './PermissionProvider'
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

  // If ANY provider is still loading, show the splash screen
  const isAnyLoading = 
    sessionCtx?.isLoading || 
    userCtx?.isLoading || 
    companyCtx?.isLoading || 
    permissionCtx?.isLoading

  if (isAnyLoading) {
    return <SplashLoader />
  }

  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <CompanyProvider>
          <PermissionProvider>
            <ProvidersReadyGate>
              {children}
            </ProvidersReadyGate>
          </PermissionProvider>
        </CompanyProvider>
      </UserProvider>
    </SessionProvider>
  )
}
