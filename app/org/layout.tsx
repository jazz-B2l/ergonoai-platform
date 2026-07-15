'use client'

import { HRSidebar } from '@/components/hr/sidebar'

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <HRSidebar />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
