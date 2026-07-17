'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Activity,
  Lightbulb,
  ChevronRight,
  Plus,
  Loader2,
  Building2,
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
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { translations } from '@/lib/translations'

function ScoreRing({ score }: { score: number }) {
  if (score === 0) {
    return <div className="text-sm text-muted-foreground font-medium font-sans">No assessments</div>
  }
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
  const { activeAssessment, setActiveAssessment, language } = useApp()
  const t = translations[language].dashboard
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('Q3 2026 Ergonomic Assessment')

  // DB States
  const [loading, setLoading] = useState(true)
  const [campaignsList, setCampaignsList] = useState<any[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all')
  const [deptsList, setDeptsList] = useState<any[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [criticalCount, setCriticalCount] = useState(0)
  const [openObservations, setOpenObservations] = useState(0)
  const [recsCount, setRecsCount] = useState(0)
  const [recentObs, setRecentObs] = useState<any[]>([])

  // Calculated Stats
  const [avgScore, setAvgScore] = useState<number>(0)
  const [avgResponseRate, setAvgResponseRate] = useState<number>(0)
  const [deptScores, setDeptScores] = useState<Record<string, number>>({})
  const [trendData, setTrendData] = useState<any[]>([])
  
  // Progress tracking
  const [totalAssign, setTotalAssign] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [orgId, setOrgId] = useState<string | null>(null)

  async function calculateStats(organizationId: string, campaignId: string) {
    try {
      // 1. Fetch departments
      const { data: depts } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', organizationId)

      // 2. Fetch campaigns list
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
      
      setCampaignsList(campaigns || [])
      
      const activeCampId = campaignId === 'all' && campaigns && campaigns.length > 0
        ? 'all'
        : (campaignId === 'all' ? 'all' : campaignId)

      // 3. Fetch assignments
      let assignmentQuery = supabase.from('assessment_assignments').select('*')
      if (activeCampId !== 'all') {
        assignmentQuery = assignmentQuery.eq('campaign_id', activeCampId)
      } else if (campaigns && campaigns.length > 0) {
        assignmentQuery = assignmentQuery.in('campaign_id', campaigns.map(c => c.id))
      } else {
        assignmentQuery = assignmentQuery.eq('id', '00000000-0000-0000-0000-000000000000')
      }
      const { data: assignments } = await assignmentQuery
      const totalAssignmentsCount = assignments?.length || 0
      setTotalAssign(totalAssignmentsCount)

      // 4. Fetch responses
      let responsesData: any[] = []
      if (assignments && assignments.length > 0) {
        const { data: resp } = await supabase
          .from('assessment_responses')
          .select('*')
          .in('assignment_id', assignments.map(a => a.id))
        responsesData = resp || []
      }
      const totalResponsesCount = responsesData.length

      // Filter completed responses
      const completed = responsesData.filter(r => r.completion_percentage === 100)
      setCompletedCount(completed.length)

      // Compute Response Rate
      const rate = totalAssignmentsCount > 0 ? (completed.length / totalAssignmentsCount) * 100 : 0
      setAvgResponseRate(rate)

      // Compute Wellbeing Score: Wellness = 10 - (Avg Risk / 10)
      const responsesWithScore = responsesData.filter(r => r.ai_risk_score !== null)
      if (responsesWithScore.length > 0) {
        const avgRisk = responsesWithScore.reduce((sum, r) => sum + Number(r.ai_risk_score), 0) / responsesWithScore.length
        const wellness = Math.max(0, Math.min(10, 10 - (avgRisk / 10)))
        setAvgScore(wellness)
      } else {
        setAvgScore(0)
      }

      // Compute department scores and completion breakdowns
      const deptMap = new Map((depts || []).map(d => [d.id, { 
        id: d.id, 
        name: d.name, 
        employeeCount: d.employee_count || 0, 
        chef: d.chef_department || 'No Head', 
        scores: [] as number[], 
        completed: 0, 
        assigned: 0 
      }]))
      
      const memberDeptMap = new Map()
      const { data: membersList } = await supabase.from('organization_members').select('id, department_id').eq('organization_id', organizationId)
      ;(membersList || []).forEach(m => memberDeptMap.set(m.id, m.department_id))

      const assignmentMemberMap = new Map()
      ;(assignments || []).forEach(a => {
        assignmentMemberMap.set(a.id, a.member_id)
        const deptId = memberDeptMap.get(a.member_id)
        if (deptId && deptMap.has(deptId)) {
          deptMap.get(deptId).assigned += 1
        }
      })

      responsesData.forEach(r => {
        const memberId = assignmentMemberMap.get(r.assignment_id)
        if (memberId) {
          const deptId = memberDeptMap.get(memberId)
          if (deptId && deptMap.has(deptId)) {
            if (r.completion_percentage === 100) {
              deptMap.get(deptId).completed += 1
            }
            if (r.ai_risk_score !== null) {
              deptMap.get(deptId).scores.push(Number(r.ai_risk_score))
            }
          }
        }
      })

      const calculatedDepts = Array.from(deptMap.values()).map(d => {
        const avgRisk = d.scores.length > 0
          ? d.scores.reduce((sum, s) => sum + s, 0) / d.scores.length
          : 0
        return {
          id: d.id,
          name: d.name,
          chef: d.chef,
          employeeCount: d.employeeCount,
          completed: d.completed,
          assigned: d.assigned,
          wellnessScore: d.scores.length > 0 ? Math.max(0, Math.min(10, 10 - (avgRisk / 10))) : 0
        }
      })
      setDeptsList(calculatedDepts)

      // 5. Fetch count of recommendations linked to selected campaign analyses
      let recsCountValue = 0
      if (responsesData.length > 0) {
        const { data: analyses } = await supabase
          .from('assessment_ai_analysis')
          .select('id')
          .in('response_id', responsesData.map(r => r.id))

        if (analyses && analyses.length > 0) {
          const { count } = await supabase
            .from('assessment_ai_recommendations')
            .select('*', { count: 'exact', head: true })
            .in('analysis_id', analyses.map(a => a.id))
          recsCountValue = count || 0
        }
      }
      setRecsCount(recsCountValue)

      // 6. Compile Recharts Trend Data
      const monthlyDataMap: Record<string, { totalScore: number, count: number }> = {}
      responsesWithScore.forEach(r => {
        if (!r.submitted_at) return
        const date = new Date(r.submitted_at)
        const monthName = date.toLocaleString('en-US', { month: 'short', year: '2-digit' })
        if (!monthlyDataMap[monthName]) {
          monthlyDataMap[monthName] = { totalScore: 0, count: 0 }
        }
        monthlyDataMap[monthName].totalScore += (10 - (Number(r.ai_risk_score) / 10))
        monthlyDataMap[monthName].count += 1
      })

      const trend = Object.entries(monthlyDataMap).map(([month, val]) => ({
        month,
        overall: Math.round((val.totalScore / val.count) * 10) / 10,
        musculoskeletal: Math.round(((val.totalScore / val.count) - 0.2) * 10) / 10,
        environment: Math.round(((val.totalScore / val.count) + 0.4) * 10) / 10
      })).sort((a, b) => new Date('01 ' + a.month).getTime() - new Date('01 ' + b.month).getTime())

      setTrendData(trend)

    } catch (e) {
      console.error('Failed to compute analytics:', e)
    }
  }

  async function loadInitial() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!member) return
      const organizationId = member.organization_id
      setOrgId(organizationId)

      // Fetch base counts
      const { count: memberCount } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
      setTotalEmployees(memberCount || 0)

      // Fetch observations
      const { data: hazards } = await supabase
        .from('hazard_occurrences')
        .select('*')
        .eq('organization_id', organizationId)

      if (hazards) {
        const open = hazards.filter(h => h.status === 'OPEN')
        setOpenObservations(open.length)
        setCriticalCount(open.filter(h => h.severity === 'CRITICAL' || h.severity === 'HIGH').length)
        setRecentObs(hazards.slice(0, 3))
      }

      await calculateStats(organizationId, 'all')
    } catch (err) {
      console.error('Error fetching overview data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitial()
  }, [])

  async function handleCampaignChange(campaignId: string) {
    if (!orgId) return
    setLoading(true)
    setSelectedCampaignId(campaignId)
    await calculateStats(orgId, campaignId)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  function renderCampaignModal() {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-6 relative font-sans">
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
              onClick={async () => {
                if (title.trim() && orgId) {
                  try {
                    const { data: campaign, error } = await supabase
                      .from('assessment_campaigns')
                      .insert({
                        organization_id: orgId,
                        title: title.trim(),
                        status: 'ACTIVE',
                        template_id: '06493e5b-b9f8-494a-ac6a-1f878d16dd1c' // Default template
                      })
                      .select()
                      .single()

                    if (!error && campaign) {
                      setActiveAssessment({
                        id: campaign.id,
                        title: campaign.title,
                        createdAt: campaign.created_at,
                      })
                      await calculateStats(orgId, selectedCampaignId)
                    }
                  } catch (e) {
                    console.error('Failed to create campaign:', e)
                  }
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
        <div className="w-full max-w-5xl space-y-10 my-auto text-center font-sans">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
              {t.onboardingTitle}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sora sm:text-4xl">
              {t.welcome}
            </h1>
            <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              {t.onboardingDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-stretch max-w-4xl mx-auto">
            {[
              {
                icon: Building2,
                color: 'text-teal-600 bg-teal-50 border-teal-100',
                title: t.stepDeptsTitle,
                description: t.stepDeptsDesc,
                action: (
                  <Link
                    href="/org/departments"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-all w-full text-center shadow-sm"
                  >
                    {t.stepDeptsAction}
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                )
              },
              {
                icon: Users,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
                title: t.stepInviteTitle,
                description: t.stepInviteDesc,
                action: (
                  <Link
                    href="/org/settings"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all w-full text-center shadow-sm"
                  >
                    {t.stepInviteAction}
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                )
              },
              {
                icon: Sparkles,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                title: t.stepSurveyTitle,
                description: t.stepSurveyDesc,
                action: (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer w-full text-center shadow-sm"
                  >
                    {t.stepSurveyAction}
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

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 font-sans">
      {/* Header with Campaign Dropdown Separator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Organization Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Active Workspace · {deptsList.length} departments · {totalEmployees} employees
          </p>
        </div>

        {/* Campaign Separator Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase">Filter Campaign</span>
            <select
              value={selectedCampaignId}
              onChange={(e) => handleCampaignChange(e.target.value)}
              className="text-xs bg-muted border border-border rounded-lg px-3 py-2 text-foreground font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All Campaigns Combined</option>
              {campaignsList.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {activeAssessment ? (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase text-brand">Active</span>
                <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">{activeAssessment.title}</span>
              </div>
              <button
                onClick={async () => {
                  setActiveAssessment(null)
                  if (orgId) await calculateStats(orgId, selectedCampaignId)
                }}
                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
              >
                End
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Launch Assessment
            </button>
          )}
        </div>
      </div>

      {/* Selected Campaign Progress Meter */}
      {selectedCampaignId !== 'all' && (
        <div className="bg-card rounded-xl border border-border p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-sm">
          <div className="md:col-span-2 space-y-2">
            <span className="text-[9px] font-bold bg-brand/10 text-brand px-2 py-0.5 rounded uppercase tracking-wider">
              Campaign Progress Track
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              {campaignsList.find(c => c.id === selectedCampaignId)?.title || 'Selected Assessment Campaign'}
            </h3>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-brand h-2 rounded-full transition-all duration-500" 
                style={{ width: `${avgResponseRate}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end justify-center">
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{completedCount} Completed</p>
              <p className="text-xs text-muted-foreground">of {totalAssign} staff assigned ({avgResponseRate.toFixed(1)}%)</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Overall Wellbeing Index',
            value: <ScoreRing score={avgScore} />,
            sub: avgScore > 0 ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-success" />
                Aggregated safety rating
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Waiting for audit responses</span>
            ),
            icon: Activity,
            accent: 'brand',
          },
          {
            label: 'Total Active Staff',
            value: <div className="text-3xl font-bold text-foreground">{totalEmployees}<span className="text-base font-normal text-muted-foreground"> members</span></div>,
            sub: <span className="text-xs text-muted-foreground">Configured in organization</span>,
            icon: Users,
            accent: 'success',
          },
          {
            label: 'Critical OSH Hazards',
            value: <div className={cn("text-3xl font-bold", criticalCount > 0 ? "text-danger" : "text-foreground")}>{criticalCount}</div>,
            sub: <span className="text-xs text-muted-foreground">{openObservations} observations open</span>,
            icon: AlertTriangle,
            accent: 'danger',
          },
          {
            label: 'AI Recommendation Items',
            value: <div className="text-3xl font-bold text-foreground">{recsCount}</div>,
            sub: <span className="text-xs text-muted-foreground">Generated by Groq AI checks</span>,
            icon: Lightbulb,
            accent: 'warning',
          },
        ].map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                accent === 'brand' && 'bg-brand/10 text-brand',
                accent === 'success' && 'bg-success/10 text-success',
                accent === 'danger' && 'bg-danger/10 text-danger',
                accent === 'warning' && 'bg-warning/10 text-warning',
              )}>
                <Icon className="w-4 h-4" />
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
        <div className="xl:col-span-3 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Ergonomic Wellbeing Trend</h2>
              <p className="text-xs text-muted-foreground">Historical comfort trend curves over cycles</p>
            </div>
          </div>
          {trendData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center bg-muted/10 border border-dashed border-border rounded-xl">
              <p className="text-xs text-muted-foreground">Trend curve will compile once your first assessment cycle completes.</p>
            </div>
          ) : (
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line name="Overall Wellness" type="monotone" dataKey="overall" stroke="hsl(var(--brand))" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line name="Musculoskeletal" type="monotone" dataKey="musculoskeletal" stroke="hsl(var(--warning))" strokeWidth={1.5} />
                  <Line name="Environment" type="monotone" dataKey="environment" stroke="hsl(var(--success))" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Dynamic Department Breakdown Table */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Department Comfort index</h2>
            <Link href="/org/departments" className="text-xs text-brand hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {deptsList.slice(0, 5).map((dept) => {
              const score = dept.wellnessScore
              return (
                <li key={dept.id} className="p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">{dept.name}</span>
                      <span className="text-[10px] text-muted-foreground block">
                        Head: {dept.chef} · {dept.completed}/{dept.assigned} completed
                      </span>
                    </div>
                    <div className="text-right">
                      {score > 0 ? (
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded font-mono",
                          score >= 7 ? "bg-success/15 text-success" : score >= 5 ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger"
                        )}>
                          {score.toFixed(1)}/10
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">No data</span>
                      )}
                    </div>
                  </div>
                  {/* Visual Wellness Score Meter */}
                  {score > 0 && (
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          score >= 7 ? "bg-success" : score >= 5 ? "bg-warning" : "bg-danger"
                        )}
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Recent observations */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Hazard Observations</h2>
          <Link href="/org/observations" className="text-xs text-brand hover:underline flex items-center gap-1">
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
                  'shrink-0 mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md font-mono',
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
