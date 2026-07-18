import { useContext } from 'react'
import { UserContext } from '@/components/providers/UserProvider'

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function useCurrentUser() {
  const context = useUser()
  return context.profile
}
