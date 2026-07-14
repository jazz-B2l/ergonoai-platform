'use client'

import {
  Brain,
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Eye,
  Lightbulb,
  FileBarChart,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp, type HRPage } from '@/lib/app-context'
import { cn } from '@/lib/utils'

const navItems: { id: HRPage; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'hazard-checklist', label: 'Hazard Checklist', icon: AlertTriangle, badge: 4 },
  { id: 'observations', label: 'Observations', icon: Eye, badge: 2 },
  { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb, badge: 3 },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function HRSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setRole } = useApp()

  const getIsActive = (id: HRPage) => {
    if (id === 'overview') {
      return pathname === '/hr' || pathname === '/hr/overview'
    }
    return pathname === `/hr/${id}`
  }

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-card border-r border-border">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center">
            <Brain className="w-4 h-4 text-brand" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            ERGO<span className="text-brand">PSYC</span>.AI
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center text-xs font-medium text-brand">
            S
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">Salma Hassan</p>
            <p className="text-xs text-muted-foreground">HR Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="px-2 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Dashboard
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = getIsActive(id)
            const href = id === 'overview' ? '/hr' : `/hr/${id}`
            return (
              <li key={id}>
                <Link
                  href={href}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand/15 text-brand'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {badge !== undefined && (
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full font-medium',
                        isActive
                          ? 'bg-brand/20 text-brand'
                          : 'bg-muted-foreground/20 text-muted-foreground',
                      )}
                    >
                      {badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 shrink-0" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => {
            setRole(null)
            router.push('/')
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Switch Role
        </button>
      </div>
    </aside>
  )
}
