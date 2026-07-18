import { useContext } from 'react'
import { SessionContext } from '@/components/providers/SessionProvider'

export function useAuth() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a SessionProvider')
  }
  return context
}
