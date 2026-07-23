'use client'

import { useState, useEffect, useRef } from 'react'
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
  Sparkles,
  Cpu,
  ChevronDown,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp, type HRPage } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'
import { translations } from '@/lib/translations'
import { useAIProvider } from '@/components/providers/AIProviderContext'

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

        {/* AI Engine Dropdown */}
        <AiEngineDropdown isCollapsed={isCollapsed} />

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

function AiEngineDropdown({ isCollapsed }: { isCollapsed: boolean }) {
  const { aiProvider, aiModel, allowedProviders, updateAiPreference, providersHealth } = useAIProvider()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const providerDetails = {
    auto: { label: '✨ Auto routing', icon: Sparkles, color: 'text-emerald-500' },
    gemini: { label: 'Google Gemini', icon: Cpu, color: 'text-blue-500' },
    groq: { label: 'Groq AI', icon: Cpu, color: 'text-orange-500' },
    openai: { label: 'OpenAI', icon: Cpu, color: 'text-purple-500' },
    claude: { label: 'Anthropic Claude', icon: Cpu, color: 'text-amber-600' },
    deepseek: { label: 'DeepSeek', icon: Cpu, color: 'text-cyan-500' }
  }

  const modelsForProvider: Record<string, { id: string; label: string }[]> = {
    gemini: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    ],
    groq: [
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' },
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    ]
  }

  const currentProvider = providerDetails[aiProvider as keyof typeof providerDetails] || providerDetails.auto
  const CurrentIcon = currentProvider.icon

  if (isCollapsed) {
    return (
      <div className="relative flex justify-center w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center border bg-card hover:bg-muted transition-all cursor-pointer relative",
            aiProvider === 'auto' ? "border-emerald-500/30" : aiProvider === 'gemini' ? "border-blue-500/30" : "border-orange-500/30"
          )}
          title={`AI Engine: ${currentProvider.label}`}
        >
          <CurrentIcon className={cn("w-4 h-4", currentProvider.color)} />
          {aiProvider !== 'auto' && (
            <span className={cn(
              "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-card",
              providersHealth[aiProvider as 'gemini' | 'groq'] === 'healthy' ? "bg-emerald-500" :
              providersHealth[aiProvider as 'gemini' | 'groq'] === 'checking' ? "bg-amber-400 animate-pulse" :
              "bg-rose-500"
            )} />
          )}
        </button>

        {isOpen && (
          <div className="absolute bottom-10 left-12 w-48 rounded-lg border border-border bg-card shadow-lg p-1.5 space-y-1 z-[100] text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">AI Engine</p>
            {allowedProviders.includes('gemini') && (
              <button
                onClick={() => {
                  updateAiPreference('gemini', 'gemini-2.5-flash')
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-muted transition-colors cursor-pointer",
                  aiProvider === 'gemini' && "bg-muted font-semibold text-foreground"
                )}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span>Gemini</span>
              </button>
            )}
            {allowedProviders.includes('groq') && (
              <button
                onClick={() => {
                  updateAiPreference('groq', 'llama-3.1-8b-instant')
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-muted transition-colors cursor-pointer",
                  aiProvider === 'groq' && "bg-muted font-semibold text-foreground"
                )}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Groq</span>
              </button>
            )}
            <button
              onClick={() => {
                updateAiPreference('auto', '')
                setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-muted transition-colors cursor-pointer",
                aiProvider === 'auto' && "bg-muted font-semibold text-foreground"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Auto Routing</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 p-2 bg-muted/45 rounded-xl border border-border/80 text-left relative" ref={dropdownRef}>
      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider px-1">AI Engine</span>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-card/85 text-xs text-foreground cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2 truncate">
          <CurrentIcon className={cn("w-3.5 h-3.5 shrink-0", currentProvider.color)} />
          <span className="font-semibold truncate">{currentProvider.label}</span>
          {aiProvider !== 'auto' && (
            <span className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              providersHealth[aiProvider as 'gemini' | 'groq'] === 'healthy' ? "bg-emerald-500 animate-pulse" :
              providersHealth[aiProvider as 'gemini' | 'groq'] === 'checking' ? "bg-amber-400 animate-pulse" :
              "bg-rose-500"
            )} />
          )}
        </div>
        <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
      </button>

      {aiProvider !== 'auto' && (
        <div className="flex flex-col gap-0.5 mt-0.5 pl-1">
          <span className="text-[8px] font-medium text-muted-foreground/60 truncate">
            {aiProvider === 'gemini' ? 'Auto: best Gemini model per task' : 'Auto: best Groq model per task'}
          </span>
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-[105%] left-0 w-full rounded-xl border border-border bg-card shadow-lg p-1.5 space-y-0.5 z-[100]">
          <p className="text-[8px] font-bold text-muted-foreground uppercase px-2 py-1 border-b border-border mb-1">Select Provider</p>
          
          <button
            onClick={() => {
              updateAiPreference('auto', '')
              setIsOpen(false)
            }}
            className={cn(
              "w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs hover:bg-muted transition-colors cursor-pointer",
              aiProvider === 'auto' && "bg-brand/10 text-brand font-semibold"
            )}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Auto Routing</span>
            </div>
            {aiProvider === 'auto' && <Check className="w-3 h-3" />}
          </button>

          {allowedProviders.includes('gemini') && (
            <button
              onClick={() => {
                updateAiPreference('gemini', 'gemini-2.5-flash')
                setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs hover:bg-muted transition-colors cursor-pointer",
                aiProvider === 'gemini' && "bg-brand/10 text-brand font-semibold"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Google Gemini</span>
              </div>
              {aiProvider === 'gemini' && <Check className="w-3 h-3" />}
            </button>
          )}

          {allowedProviders.includes('groq') && (
            <button
              onClick={() => {
                updateAiPreference('groq', 'llama-3.1-8b-instant')
                setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs hover:bg-muted transition-colors cursor-pointer",
                aiProvider === 'groq' && "bg-brand/10 text-brand font-semibold"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Groq AI</span>
              </div>
              {aiProvider === 'groq' && <Check className="w-3 h-3" />}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
