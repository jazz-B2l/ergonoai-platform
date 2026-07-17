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
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp, type HRPage } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'
import { translations } from '@/lib/translations'

const navItems: { id: HRPage; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'hazard-checklist', label: 'Hazard Checklist', icon: AlertTriangle },
  { id: 'observations', label: 'Observations', icon: Eye },
  { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
]

export function HRSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setRole, language } = useApp()
  const [orgName, setOrgName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const t = translations[language].dashboard

  useEffect(() => {
    // Load collapse state from local storage
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') {
      setIsCollapsed(true)
    }

    async function fetchUserData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          setLoading(false)
          return
        }

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

  const toggleCollapse = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem('sidebar-collapsed', String(next))
  }

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
    <aside 
      className={cn(
        "shrink-0 h-screen flex flex-col bg-card border-r border-border transition-all duration-300 relative", 
        isCollapsed ? "w-16" : "w-60"
      )} 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Absolute floating toggle button */}
      <button
        onClick={toggleCollapse}
        className={cn(
          "absolute top-5 z-50 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer shadow-sm transition-transform",
          language === 'ar' ? "left-[-12px]" : "right-[-12px]"
        )}
        aria-label="Toggle Sidebar Size"
      >
        {isCollapsed ? (
          language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          language === 'ar' ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Brand */}
      <div className="px-4 py-5 border-b border-border">
        <div className={cn("flex items-center gap-2.5", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-brand" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-semibold tracking-tight text-foreground transition-opacity duration-200">
              Ergono<span className="text-brand">AI</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left transition-opacity duration-200">
            {t.title}
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = getIsActive(id)
            const href = id === 'overview' ? '/org' : `/org/${id}`
            const translatedLabel = labelMap[label] || label
            return (
              <li key={id}>
                <Link
                  href={href}
                  className={cn(
                    'w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand/15 text-brand'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? translatedLabel : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate transition-opacity duration-200">
                      {translatedLabel}
                    </span>
                  )}
                  {!isCollapsed && isActive && (
                    <ChevronRight className={cn("w-3 h-3 shrink-0", language === 'ar' && "rotate-180")} />
                  )}
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
            "w-full flex items-center gap-3 p-2 rounded-xl text-sm transition-all border",
            pathname === '/org/profile'
              ? "bg-brand/10 text-brand border-brand/20"
              : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? (language === 'ar' ? 'حسابي' : 'My Account') : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-semibold text-xs shrink-0 border border-brand/30">
            {orgName ? orgName[0]?.toUpperCase() : 'O'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left transition-opacity duration-200">
              <p className="text-xs font-semibold text-foreground truncate">
                {loading ? 'Loading...' : orgName || (language === 'ar' ? 'مسؤول المنشأة' : 'Organization Admin')}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{t.myAccount}</p>
            </div>
          )}
        </Link>

        {/* Action Buttons */}
        <div className={cn("flex w-full items-center", isCollapsed ? "flex-col gap-3" : "gap-2")}>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              setRole(null)
              router.push('/')
            }}
            className={cn(
              "flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer rounded-lg shrink-0",
              isCollapsed ? "p-2 justify-center" : "flex-1 gap-3 px-3 py-2.5 text-sm text-left"
            )}
            title={isCollapsed ? t.logout : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>{t.logout}</span>}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
