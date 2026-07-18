'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Company } from '@/lib/types'
import { sessionService } from '@/lib/auth/session'
import { SessionContext } from './SessionProvider'
import { auditLogger } from '@/lib/audit/logger'

interface CompanyContextType {
  activeCompany: Company | null
  companies: Company[]
  isLoading: boolean
  switchCompany: (companyId: string) => Promise<void>
  refreshCompany: () => Promise<void>
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const sessionCtx = useContext(SessionContext)
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  if (!sessionCtx) {
    throw new Error('CompanyProvider must be used within SessionProvider')
  }

  const { user, isLoading: sessionLoading } = sessionCtx

  const refreshCompany = async () => {
    if (!user) {
      setActiveCompany(null)
      setCompanies([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const userCompanies = await sessionService.fetchCompanies(user.id)
      setCompanies(userCompanies)
      
      // Keep existing active company if it's still in the list, otherwise use the first one
      if (userCompanies.length > 0) {
        if (!activeCompany || !userCompanies.find(c => c.id === activeCompany.id)) {
          setActiveCompany(userCompanies[0])
        }
      } else {
        setActiveCompany(null)
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const switchCompany = async (companyId: string) => {
    const target = companies.find(c => c.id === companyId)
    if (target && target.id !== activeCompany?.id) {
      setActiveCompany(target)
      auditLogger.logClient({ 
        event: 'company_switched', 
        userId: user?.id, 
        companyId: target.id 
      })
    }
  }

  useEffect(() => {
    if (!sessionLoading) {
      refreshCompany()
    } else {
      setIsLoading(true)
    }
  }, [user, sessionLoading])

  return (
    <CompanyContext.Provider value={{ activeCompany, companies, isLoading, switchCompany, refreshCompany }}>
      {children}
    </CompanyContext.Provider>
  )
}
