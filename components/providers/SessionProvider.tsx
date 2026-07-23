'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { auditLogger } from '@/lib/audit/logger'

interface SessionContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  refreshSession: () => Promise<void>
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

// Create the client once at module level — not inside the component —
// so re-renders never create a second instance with a competing refresh timer.
const supabase = createClient()

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    const { data: { session: newSession }, error } = await supabase.auth.getSession()
    if (!error) {
      setSession(newSession)
      setUser(prevUser => {
        const newUser = newSession?.user || null
        return prevUser?.id === newUser?.id ? prevUser : newUser
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const initialize = async () => {
      await refreshSession()
    }

    initialize()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession)
        setUser(prevUser => {
          const newUser = newSession?.user || null
          return prevUser?.id === newUser?.id ? prevUser : newUser
        })
        setIsLoading(false)

        if (event === 'SIGNED_OUT') {
          // Cross-tab synchronization - only redirect if on a protected route
          const path = window.location.pathname
          const publicRoutes = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/']
          const isPublic = publicRoutes.some(r => path === r || path.startsWith(r + '/'))
          if (!isPublic) {
            auditLogger.logClient({ event: 'logout' })
            window.location.href = '/login'
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider value={{ session, user, isLoading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  )
}
