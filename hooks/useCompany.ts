import { useContext } from 'react'
import { CompanyContext } from '@/components/providers/CompanyProvider'

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

export function useCurrentCompany() {
  const context = useCompany()
  return context.activeCompany
}
