import { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Activity,
  Lightbulb,
  ChevronRight,
  Plus,
  ArrowRight,
  Loader2,
  Building2,
  UserPlus,
  Sparkles,
  Play
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  organizationWellbeingTrend,
  aiRecommendations,
} from '@/lib/types'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function ScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100
  const color =
    score >= 7 ? 'text-success' : score >= 5 ? 'text-warning' : 'text-danger'
  return (
    <div className={cn('text-3xl font-bold tabular-nums', color)}>
      {score.toFixed(1)}
      <span className="text-base font-normal text-muted-foreground">/10</span>
    </div>
  )
}

export function HROverview() {
  const { activeAssessment, setActiveAssessment } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('Q3 2026 Ergonomic Assessment')

  // DB States
  const [loading, setLoading] = useState(true)
  const [deptsList, setDeptsList] = useState<any[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [criticalCount, setCriticalCount] = useState(0)
  const [openObservations, setOpenObservations] = useState(0)
  const [recsCount, setRecsCount] = useState(0)
  const [recentObs, setRecentObs] = useState<any[]>([])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get the HR manager's organization_id
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!member) return
      const organizationId = member.organization_id

      // Fetch departments in this organization
      const { data: depts } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', organizationId)

      // Count total organization members (employees)
      const { count: memberCount } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)

      // Fetch hazard observations for this organization
      const { data: hazards } = await supabase
        .from('hazard_occurrences')
        .select('*')
        .eq('organization_id', organizationId)

      // Fetch AI Recommendations count
      const { data: recs } = await supabase
        .from('assessment_ai_recommendations')
        .select('id, priority')
        .limit(10)

      setDeptsList(depts || [])
      setTotalEmployees(memberCount || 0)

      if (hazards) {
        const open = hazards.filter(h => h.status === 'OPEN')
        setOpenObservations(open.length)
        setCriticalCount(open.filter(h => h.severity === 'CRITICAL' || h.severity === 'HIGH').length)
        setRecentObs(hazards.slice(0, 3))
      }

      setRecsCount(recs ? recs.length : 0)
    } catch (err) {
      console.error('Error fetching overview data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  const avgScore = 0
  const avgResponseRate = 0

  function renderCampaignModal() {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-6 relative">
          <h3 className="text-lg font-semibold text-foreground mb-2">Launch New Assessment Campaign</h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Launch a new ergonomic assessment cycle. All employees will be required to fill this out upon entering the employee space.
          </p>
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Assessment Campaign Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (title.trim()) {
                  setActiveAssessment({
                    id: `assessment_${Date.now()}`,
                    title: title.trim(),
                    createdAt: new Date().toISOString(),
                  })
                  setModalOpen(false)
                }
              }}
              className="px-4 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors cursor-pointer"
            >
              Launch Campaign
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Onboarding Checklist for Empty State
  if (deptsList.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-slate-50/50 overflow-y-auto">
        <div className="w-full max-w-5xl space-y-10 my-auto text-center">
          
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
              Onboarding Checklist
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sora sm:text-4xl">
              Welcome to ErgonoAI
            </h1>
            <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Configure your workspace in three simple steps to start analyzing ergonomic wellbeing and identifying hazard trends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-stretch max-w-4xl mx-auto">
            {[
              {
                icon: Building2,
                color: 'text-teal-600 bg-teal-50 border-teal-100',
                title: '1. Departments',
                description: 'Set up distinct workspaces to group employees.',
                action: (
                  <Link
                    href="/hr/departments"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-all w-full text-center shadow-sm"
                  >
                    Configure Spaces
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                )
              },
              {
                icon: UserPlus,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
                title: '2. Invite Staff',
                description: 'Create site locations and generate invite codes.',
                action: (
                  <Link
                    href="/hr/settings"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all w-full text-center shadow-sm"
                  >
                    Invite Employees
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )
              },
              {
                icon: Sparkles,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                title: '3. Launch Survey',
                description: 'Start an ISO-compliant ergonomics assessment.',
                action: (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer w-full text-center shadow-sm"
                  >
                    Launch Campaign
                    <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                  </button>
                )
              }
            ].map(({ icon: Icon, color, title, description, action }) => (
              <div key={title} className="group relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-md h-full justify-between space-y-6">
                <div className="flex flex-col items-center text-center space-y-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-sm shrink-0 transition-transform group-hover:scale-105 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-sora">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] flex-1">{description}</p>
                </div>
                <div className="pt-2">
                  {action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {modalOpen && renderCampaignModal()}
      </div>
    )
  }

  // Normal Dashboard (once they have departments configured)
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Organization Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Active Workspace · {deptsList.length} departments · {totalEmployees} employees
          </p>
        </div>

        {/* Campaign Control */}
        <div className="flex items-center gap-3">
          {activeAssessment ? (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-brand/10 border border-brand/20">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-brand font-semibold">Active Campaign</span>
                <span className="text-xs font-semibold text-foreground">{activeAssessment.title}</span>
              </div>
              <button
                onClick={() => setActiveAssessment(null)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                End Campaign
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors cursor-pointer"
            >
              Launch Assessment
            </button>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Overall Wellbeing Score',
            value: <ScoreRing score={avgScore} />,
            sub: <span className="text-xs text-muted-foreground">Waiting for assessment results</span>,
            icon: Activity,
            accent: 'brand',
          },
          {
            label: 'Total Registered Staff',
            value: <div className="text-3xl font-bold text-foreground">{totalEmployees}<span className="text-base font-normal text-muted-foreground"> members</span></div>,
            sub: <span className="text-xs text-muted-foreground">{deptsList.length} departments configured</span>,
            icon: Users,
            accent: 'success',
          },
          {
            label: 'Critical Hazards',
            value: <div className={cn("text-3xl font-bold", criticalCount > 0 ? "text-danger" : "text-foreground")}>{criticalCount}</div>,
            sub: <span className="text-xs text-muted-foreground">{openObservations} observations open</span>,
            icon: AlertTriangle,
            accent: 'danger',
          },
          {
            label: 'AI Recommendations',
            value: <div className="text-3xl font-bold text-foreground">{recsCount}</div>,
            sub: <span className="text-xs text-muted-foreground">Generated by AI inspection</span>,
            icon: Lightbulb,
            accent: 'warning',
          },
        ].map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                accent === 'brand' && 'bg-brand/10',
                accent === 'success' && 'bg-success/10',
                accent === 'danger' && 'bg-danger/10',
                accent === 'warning' && 'bg-warning/10',
              )}>
                <Icon className={cn(
                  'w-4 h-4',
                  accent === 'brand' && 'text-brand',
                  accent === 'success' && 'text-success',
                  accent === 'danger' && 'text-danger',
                  accent === 'warning' && 'text-warning',
                )} />
              </div>
            </div>
            {value}
            <div className="mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Departments */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Trend chart */}
        <div className="xl:col-span-3 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Wellbeing Trend</h2>
              <p className="text-xs text-muted-foreground">Organization-wide · Assessment History</p>
            </div>
          </div>
          <div className="h-[220px] flex items-center justify-center bg-muted/10 border border-dashed border-border rounded-xl">
            <p className="text-xs text-muted-foreground">Trend data will compile once your first assessment cycle completes.</p>
          </div>
        </div>

        {/* Department list */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Departments</h2>
            <Link href="/hr/departments" className="text-xs text-brand hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {deptsList.slice(0, 5).map((dept) => (
              <li key={dept.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <div>
                  <span className="text-xs font-semibold text-foreground block">{dept.name}</span>
                  <span className="text-[10px] text-muted-foreground block truncate max-w-[150px]">{dept.description || 'No description'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-brand block">Active</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent observations */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Hazard Observations</h2>
          <Link href="/hr/observations" className="text-xs text-brand hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        {recentObs.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-border rounded-xl bg-muted/10">
            <p className="text-xs text-muted-foreground">No occupational hazards have been reported yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentObs.map((obs) => (
              <div key={obs.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <span className={cn(
                  'shrink-0 mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md',
                  obs.severity === 'CRITICAL' && 'bg-danger/15 text-danger',
                  obs.severity === 'HIGH' && 'bg-warning/15 text-warning',
                  obs.severity === 'MEDIUM' && 'bg-brand/15 text-brand',
                  obs.severity === 'LOW' && 'bg-success/15 text-success',
                )}>
                  {obs.severity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{obs.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{obs.status} · {new Date(obs.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && renderCampaignModal()}
    </div>
  )
}
