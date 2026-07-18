'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserProfile } from '@/lib/types'
import { sessionService } from '@/lib/auth/session'
import { SessionContext } from './SessionProvider'

interface UserContextType {
  profile: UserProfile | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const sessionCtx = useContext(SessionContext)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  if (!sessionCtx) {
    throw new Error('UserProvider must be used within SessionProvider')
  }

  const { user, isLoading: sessionLoading } = sessionCtx

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await sessionService.fetchProfile(user.id)
      setProfile(data)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!sessionLoading) {
      refreshProfile()
    } else {
      setIsLoading(true)
    }
  }, [user, sessionLoading])

  return (
    <UserContext.Provider value={{ profile, isLoading, refreshProfile }}>
      {children}
    </UserContext.Provider>
  )
}
