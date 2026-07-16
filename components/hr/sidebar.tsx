'use client'

import { useState, useEffect } from 'react'
import {
  Brain,
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Eye,
  Lightbulb,
  FileBarChart,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp, type HRPage } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'
import { translations } from '@/lib/translations'

const navItems: { id: HRPage; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'hazard-checklist', label: 'Hazard Checklist', icon: AlertTriangle, badge: 4 },
  { id: 'observations', label: 'Observations', icon: Eye, badge: 2 },
  { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb, badge: 3 },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
]

export function HRSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setRole, language } = useApp()
  const [orgName, setOrgName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const t = translations[language].dashboard

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          setLoading(false)
          return
        }

        // Get organization name
        const { data: member } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .limit(1)
          .single()

        if (member) {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', member.organization_id)
            .single()

          if (orgData) {
            setOrgName(orgData.name || '')
          }
        }
      } catch (err) {
        console.error('Error fetching user data in sidebar:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const getIsActive = (id: HRPage) => {
    if (id === 'overview') {
      return pathname === '/org' || pathname === '/org/overview'
    }
    return pathname === `/org/${id}`
  }

  const labelMap: Record<string, string> = {
    'Overview': t.overview,
    'Departments': t.departments,
    'Hazard Checklist': t.hazardChecklist,
    'Observations': t.observations,
    'AI Recommendations': t.recommendations,
    'Reports': t.reports,
  }

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-card border-r border-border" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center">
            <Brain className="w-4 h-4 text-brand" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Ergono<span className="text-brand">AI</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="px-2 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider text-left">
          {t.title}
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = getIsActive(id)
            const href = id === 'overview' ? '/org' : `/org/${id}`
            const translatedLabel = labelMap[label] || label
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
                  <span className="flex-1 text-left">{translatedLabel}</span>
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
                  {isActive && <ChevronRight className={cn("w-3 h-3 shrink-0", language === 'ar' && "rotate-180")} />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border space-y-2.5">
        {/* Account Button */}
        <Link
          href="/org/profile"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all border",
            pathname === '/org/profile'
              ? "bg-brand/10 text-brand border-brand/20"
              : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-semibold text-xs shrink-0 border border-brand/30">
            {orgName ? orgName[0]?.toUpperCase() : 'O'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-foreground truncate">
              {loading ? 'Loading...' : orgName || (language === 'ar' ? 'مسؤول المنشأة' : 'Organization Admin')}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{t.myAccount}</p>
          </div>
        </Link>

        {/* Action Buttons Row */}
        <div className="flex gap-2 w-full items-center">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              setRole(null)
              router.push('/')
            }}
            className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
