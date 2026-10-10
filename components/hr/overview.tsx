'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Play,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  FileBarChart,
  Filter,
  Search,
  Layers,
  StopCircle,
  X,
  Edit3
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
import { AssessmentCampaignModal } from '@/components/hr/AssessmentCampaignModal'
import { EndCampaignModal } from '@/components/hr/EndCampaignModal'
import { EditCampaignModal } from '@/components/hr/EditCampaignModal'

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

interface CampaignDetailedStat {
  id: string
  title: string
  status: string
  startDate: string | null
  endDate: string | null
  createdAt: string
  config: any
  totalAssigned: number
  completedCount: number
  completionRate: number
  wellnessScore: number | null
  avgRisk: number | null
  targetDeptNames: string[]
}

export function HROverview() {
  const { activeAssessment, setActiveAssessment, language } = useApp()
  const isAr = language === 'ar'
  const t = translations[language].dashboard
  const [modalOpen, setModalOpen] = useState(false)
  const [endModalOpen, setEndModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [campaignToEnd, setCampaignToEnd] = useState<any | null>(null)
  const [campaignToEdit, setCampaignToEdit] = useState<any | null>(null)
  const [campaignToDelete, setCampaignToDelete] = useState<any | null>(null)
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null)

  // DB States
  const [loading, setLoading] = useState(true)
  const [campaignsList, setCampaignsList] = useState<any[]>([])
  const [campaignStatsList, setCampaignStatsList] = useState<CampaignDetailedStat[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all')
  const [campaignFilterTab, setCampaignFilterTab] = useState<'all' | 'ACTIVE' | 'COMPLETED'>('all')
  const [campaignSearchQuery, setCampaignSearchQuery] = useState('')
  const [deptsList, setDeptsList] = useState<any[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [criticalCount, setCriticalCount] = useState(0)
  const [openObservations, setOpenObservations] = useState(0)
  const [recsCount, setRecsCount] = useState(0)
  const [recentObs, setRecentObs] = useState<any[]>([])

  // Calculated Stats for Dashboard KPIs
  const [avgScore, setAvgScore] = useState<number>(0)
  const [avgResponseRate, setAvgResponseRate] = useState<number>(0)
  const [trendData, setTrendData] = useState<any[]>([])
  const [totalAssign, setTotalAssign] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [endingCampaign, setEndingCampaign] = useState(false)

  async function handleEndAssessment(targetCampaignId?: string) {
    const campaignIdToEnd = targetCampaignId || campaignToEnd?.id || activeAssessment?.id
    setEndingCampaign(true)

    // 1. Optimistically clear active assessment from context if it matches
    if (!campaignIdToEnd || campaignIdToEnd === activeAssessment?.id) {
      setActiveAssessment(null)
    }

    try {
      if (campaignIdToEnd) {
        await supabase
          .from('assessment_campaigns')
          .update({
            status: 'COMPLETED',
            end_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('id', campaignIdToEnd)
      } else if (orgId) {
        await supabase
          .from('assessment_campaigns')
          .update({
            status: 'COMPLETED',
            end_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('organization_id', orgId)
          .eq('status', 'ACTIVE')
      }

      setCampaignToEnd(null)
      if (orgId) {
        await calculateStats(orgId, selectedCampaignId)
      }
    } catch (err) {
      console.warn('Error ending assessment in database:', err)
    } finally {
      setEndingCampaign(false)
    }
  }

  async function handleDeleteCampaign(campaignId: string) {
    if (!campaignId) return
    setDeletingCampaignId(campaignId)

    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        if (activeAssessment?.id === campaignId) {
          setActiveAssessment(null)
        }
        if (selectedCampaignId === campaignId) {
          setSelectedCampaignId('all')
        }
        setCampaignToDelete(null)
        if (orgId) {
          await calculateStats(orgId, 'all')
        }
      } else {
        const err = await res.json()
        alert(err.message || 'Failed to delete campaign')
      }
    } catch (err) {
      console.error('Failed to delete campaign:', err)
      alert('An unexpected error occurred while deleting the campaign.')
    } finally {
      setDeletingCampaignId(null)
    }
  }

  async function handleSaveEditedCampaign(updatedData: {
    id: string
    title: string
    status: string
    startDate: string | null
    endDate: string | null
    targetDepartments: string[]
  }) {
    const currentConfig = campaignToEdit?.config || {}
    const res = await fetch(`/api/campaigns/${updatedData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedData.title,
        status: updatedData.status,
        start_date: updatedData.startDate,
        end_date: updatedData.endDate,
        config: {
          ...currentConfig,
          targetDepartments: updatedData.targetDepartments
        }
      })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || err.error || 'Failed to update campaign')
    }

    if (activeAssessment?.id === updatedData.id) {
      if (updatedData.status === 'COMPLETED') {
        setActiveAssessment(null)
      } else {
        setActiveAssessment({
          ...activeAssessment,
          title: updatedData.title,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate
        })
      }
    } else if (updatedData.status === 'ACTIVE' && (!activeAssessment || activeAssessment.id === updatedData.id)) {
      setActiveAssessment({
        id: updatedData.id,
        title: updatedData.title,
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        startDate: updatedData.startDate,
        endDate: updatedData.endDate
      })
    }

    if (orgId) {
      await calculateStats(orgId, selectedCampaignId)
    }
  }

  async function calculateStats(organizationId: string, campaignId: string) {
    try {
      // 1. Fetch departments
      const { data: depts } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', organizationId)
      
      const deptLookup = new Map<string, string>((depts || []).map((d: any) => [d.id, d.name]))

      // 2. Fetch all campaigns list
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
      
      const allCampaigns = campaigns || []
      setCampaignsList(allCampaigns)

      // 3. Fetch all assignments for all campaigns in org
      let allAssignments: any[] = []
      if (allCampaigns.length > 0) {
        const { data: assigns } = await supabase
          .from('assessment_assignments')
          .select('id, campaign_id, member_id, status')
          .in('campaign_id', allCampaigns.map((c: any) => c.id))
        allAssignments = assigns || []
      }

      // 4. Fetch all responses for these assignments
      let allResponses: any[] = []
      if (allAssignments.length > 0) {
        const { data: resps } = await supabase
          .from('assessment_responses')
          .select('id, assignment_id, ai_risk_score, completion_percentage, submitted_at')
          .in('assignment_id', allAssignments.map((a: any) => a.id))
        allResponses = resps || []
      }

      // Map assignment -> campaign
      const assignmentToCampaignMap = new Map<string, string>()
      const campaignAssignmentsCountMap = new Map<string, number>()
      allAssignments.forEach((a: any) => {
        assignmentToCampaignMap.set(a.id, a.campaign_id)
        campaignAssignmentsCountMap.set(a.campaign_id, (campaignAssignmentsCountMap.get(a.campaign_id) || 0) + 1)
      })

      // Map campaign -> completed responses & scores
      const campaignCompletedCountMap = new Map<string, number>()
      const campaignScoresMap = new Map<string, number[]>()

      allResponses.forEach((r: any) => {
        const campId = assignmentToCampaignMap.get(r.assignment_id)
        if (campId) {
          if (r.completion_percentage === 100 || r.ai_risk_score !== null) {
            campaignCompletedCountMap.set(campId, (campaignCompletedCountMap.get(campId) || 0) + 1)
          }
          if (r.ai_risk_score !== null) {
            const current = campaignScoresMap.get(campId) || []
            current.push(Number(r.ai_risk_score))
            campaignScoresMap.set(campId, current)
          }
        }
      })

      // 5. Precalculate Detailed Stats for Each Campaign
      const detailedStats: CampaignDetailedStat[] = allCampaigns.map((c: any) => {
        const assigned = campaignAssignmentsCountMap.get(c.id) || 0
        const completed = campaignCompletedCountMap.get(c.id) || 0
        const scores = campaignScoresMap.get(c.id) || []
        const avgRisk = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
        const wellness = avgRisk !== null ? Math.max(0, Math.min(10, 10 - (avgRisk / 10))) : null
        const rate = assigned > 0 ? Math.round((completed / assigned) * 100) : (completed > 0 ? 100 : 0)

        const targetDeptIds = c.config?.targetDepartments || ['all']
        let targetDeptNames: string[] = ['All Departments']
        if (!targetDeptIds.includes('all') && targetDeptIds.length > 0) {
          targetDeptNames = targetDeptIds.map((id: string) => deptLookup.get(id) || 'Department')
        }

        return {
          id: c.id,
          title: c.title,
          status: c.status || 'ACTIVE',
          startDate: c.start_date,
          endDate: c.end_date,
          createdAt: c.created_at,
          config: c.config,
          totalAssigned: assigned,
          completedCount: completed,
          completionRate: rate,
          wellnessScore: wellness !== null ? Math.round(wellness * 10) / 10 : null,
          avgRisk: avgRisk !== null ? Math.round(avgRisk) : null,
          targetDeptNames
        }
      })

      setCampaignStatsList(detailedStats)

      // 6. Compute Dashboard KPI Stats for Selected Campaign Filter
      const activeCampId = campaignId === 'all' ? 'all' : campaignId

      const filteredAssignments = activeCampId === 'all'
        ? allAssignments
        : allAssignments.filter(a => a.campaign_id === activeCampId)

      const filteredAssignmentIds = new Set(filteredAssignments.map(a => a.id))
      const totalAssignmentsCount = filteredAssignments.length
      setTotalAssign(totalAssignmentsCount)

      const filteredResponses = allResponses.filter(r => filteredAssignmentIds.has(r.assignment_id))
      const completedResponses = filteredResponses.filter(r => r.completion_percentage === 100 || r.ai_risk_score !== null)
      setCompletedCount(completedResponses.length)

      const rate = totalAssignmentsCount > 0 ? (completedResponses.length / totalAssignmentsCount) * 100 : 0
      setAvgResponseRate(rate)

      const responsesWithScore = filteredResponses.filter(r => r.ai_risk_score !== null)
      if (responsesWithScore.length > 0) {
        const avgRisk = responsesWithScore.reduce((sum, r) => sum + Number(r.ai_risk_score), 0) / responsesWithScore.length
        const wellness = Math.max(0, Math.min(10, 10 - (avgRisk / 10)))
        setAvgScore(wellness)
      } else {
        setAvgScore(0)
      }

      // 7. Department breakdown for selected campaign
      const deptMap = new Map<string, any>((depts || []).map((d: any) => [d.id, { 
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
      ;(membersList || []).forEach((m: any) => memberDeptMap.set(m.id, m.department_id))

      const assignmentMemberMap = new Map()
      filteredAssignments.forEach((a: any) => {
        assignmentMemberMap.set(a.id, a.member_id)
        const deptId = memberDeptMap.get(a.member_id)
        if (deptId) {
          const target = deptMap.get(deptId)
          if (target) {
            target.assigned += 1
          }
        }
      })

      filteredResponses.forEach(r => {
        const memberId = assignmentMemberMap.get(r.assignment_id)
        if (memberId) {
          const deptId = memberDeptMap.get(memberId)
          if (deptId) {
            const target = deptMap.get(deptId)
            if (target) {
              if (r.completion_percentage === 100 || r.ai_risk_score !== null) {
                target.completed += 1
              }
              if (r.ai_risk_score !== null) {
                target.scores.push(Number(r.ai_risk_score))
              }
            }
          }
        }
      })

      const calculatedDepts = Array.from(deptMap.values()).map(d => {
        const avgRisk = d.scores.length > 0
          ? d.scores.reduce((sum: any, s: any) => sum + s, 0) / d.scores.length
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

      // 8. Recommendations count
      let recsCountValue = 0
      if (filteredResponses.length > 0) {
        const { data: analyses } = await supabase
          .from('assessment_ai_analysis')
          .select('id')
          .in('response_id', filteredResponses.map(r => r.id))

        if (analyses && analyses.length > 0) {
          const { count } = await supabase
            .from('assessment_ai_recommendations')
            .select('*', { count: 'exact', head: true })
            .in('analysis_id', analyses.map((a: any) => a.id))
          recsCountValue = count || 0
        }
      }
      setRecsCount(recsCountValue)

      // 9. Trend data
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
        const open = hazards.filter((h: any) => h.status === 'OPEN')
        setOpenObservations(open.length)
        setCriticalCount(open.filter((h: any) => h.severity === 'CRITICAL' || h.severity === 'HIGH').length)
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

  // Filtered campaigns for the dedicated list
  const filteredCampaigns = useMemo(() => {
    return campaignStatsList.filter((c) => {
      const matchTab = campaignFilterTab === 'all'
        ? true
        : campaignFilterTab === 'ACTIVE'
          ? c.status === 'ACTIVE'
          : c.status === 'COMPLETED'

      const matchSearch = campaignSearchQuery.trim() === '' || (
        c.title.toLowerCase().includes(campaignSearchQuery.toLowerCase())
      )

      return matchTab && matchSearch
    })
  }, [campaignStatsList, campaignFilterTab, campaignSearchQuery])

  const activeCampaignsCount = campaignStatsList.filter(c => c.status === 'ACTIVE').length
  const completedCampaignsCount = campaignStatsList.filter(c => c.status === 'COMPLETED').length

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  function renderCampaignModal() {
    return (
      <AssessmentCampaignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        departments={deptsList}
        onLaunch={async ({ title: campaignTitle, startDate, endDate, config }) => {
          if (!orgId) return
          try {
            let templateId: string | null = null
            const { data: existingTemplate } = await supabase
              .from('assessment_templates')
              .select('id')
              .limit(1)
              .maybeSingle()

            if (existingTemplate?.id) {
              templateId = existingTemplate.id
            } else {
              const { data: newTemplate } = await supabase
                .from('assessment_templates')
                .insert({
                  name: 'ISO 7730 & NMQ Standard Ergonomic Assessment',
                  code: 'ISO7730_NMQ_STD_' + Date.now(),
                  description: 'Standard ergonomic assessment template for physical and environmental workplace evaluation.',
                  standard: 'ISO7730',
                  version: 1,
                  is_active: true
                })
                .select('id')
                .single()
              templateId = newTemplate?.id || null
            }

            // Mark previous active campaigns as COMPLETED
            await supabase
              .from('assessment_campaigns')
              .update({
                status: 'COMPLETED',
                end_date: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString()
              })
              .eq('organization_id', orgId)
              .eq('status', 'ACTIVE')

            // Insert new campaign
            const { data: campaign, error } = await supabase
              .from('assessment_campaigns')
              .insert({
                organization_id: orgId,
                title: campaignTitle.trim(),
                status: 'ACTIVE',
                start_date: startDate || new Date().toISOString().split('T')[0],
                end_date: endDate || null,
                template_id: templateId,
                config: config
              })
              .select()
              .single()

            if (error) throw new Error(error.message)

            if (campaign) {
              // Create assignments
              let memberQuery = supabase
                .from('organization_members')
                .select('id, department_id')
                .eq('organization_id', orgId)
                .eq('is_active', true)

              const targetDepts = config?.targetDepartments || ['all']
              if (!targetDepts.includes('all') && targetDepts.length > 0) {
                memberQuery = memberQuery.in('department_id', targetDepts)
              }

              const { data: targetMembers } = await memberQuery

              if (targetMembers && targetMembers.length > 0) {
                const assignmentsToInsert = targetMembers.map((m: any) => ({
                  campaign_id: campaign.id,
                  member_id: m.id,
                  status: 'NOT_STARTED'
                }))

                await supabase.from('assessment_assignments').insert(assignmentsToInsert)
              }

              setActiveAssessment({
                id: campaign.id,
                title: campaign.title,
                createdAt: campaign.created_at,
                config: config
              })
              setSelectedCampaignId(campaign.id)
              await calculateStats(orgId, campaign.id)
            }
          } catch (e: any) {
            console.error('Failed to create campaign:', e)
            alert('Failed to launch campaign: ' + (e.message || 'Unknown error'))
          }
        }}
      />
    )
  }

  // Onboarding state when no departments configured
  if (deptsList.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-transparent overflow-y-auto">
        <div className="w-full max-w-5xl space-y-10 my-auto text-center font-sans">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-3 py-1 rounded-full border border-teal-200/50 dark:border-teal-900/30">
              {t.onboardingTitle}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sora sm:text-4xl">
              {t.welcome}
            </h1>
            <p className="text-sm text-slate-500 dark:text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {t.onboardingDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-stretch max-w-4xl mx-auto">
            {[
              {
                icon: Building2,
                color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/30',
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
                color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30',
                title: t.stepInviteTitle,
                description: t.stepInviteDesc,
                action: (
                  <Link
                    href="/org/settings"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all w-full text-center shadow-sm"
                  >
                    {t.stepInviteAction}
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                )
              },
              {
                icon: Sparkles,
                color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
                title: t.stepSurveyTitle,
                description: t.stepSurveyDesc,
                action: (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all cursor-pointer w-full text-center shadow-sm"
                  >
                    {t.stepSurveyAction}
                    <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                  </button>
                )
              }
            ].map(({ icon: Icon, color, title, description, action }) => (
              <div key={title} className="group relative flex flex-col p-6 rounded-2xl bg-card border border-border hover:border-border/80 transition-all duration-300 hover:shadow-md h-full justify-between space-y-6">
                <div className="flex flex-col items-center text-center space-y-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-sm shrink-0 transition-transform group-hover:scale-105 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground font-sora">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] flex-1">{description}</p>
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
    <div className="h-full overflow-y-auto p-6 space-y-8 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-0.5 rounded-full border border-teal-200/50 dark:border-teal-900/30">
              {isAr ? 'لوحة المراقبة والتحليلات' : 'Analytics & OSH Dashboard'}
            </span>
            <span className="text-xs text-muted-foreground">· {deptsList.length} {isAr ? 'أقسام' : 'departments'} · {totalEmployees} {isAr ? 'موظف' : 'staff'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1 font-sora">
            {isAr ? 'لوحة تحليلات السلامة والأرغونوميا' : 'Organization Safety Overview'}
          </h1>
        </div>

        {/* Header Action Buttons & Campaign Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase">{isAr ? 'تصفية الحملة' : 'Active Scope'}</span>
            <select
              value={selectedCampaignId}
              onChange={(e) => handleCampaignChange(e.target.value)}
              className="text-xs bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">{isAr ? 'جميع الحملات مجمعة' : 'All Campaigns Combined'}</option>
              {campaignsList.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} {c.status === 'ACTIVE' ? '(Active)' : '(Completed)'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAr ? 'إطلاق تقييم جديد' : 'Launch Assessment'}
          </button>
        </div>
      </div>

      {/* Filter Active Alert Banner */}
      {selectedCampaignId !== 'all' && (
        <div className="bg-brand/10 border border-brand/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                {isAr ? 'تصفية التحليلات حسب الحملة:' : 'Displaying analytics for:'} <span className="text-brand">{campaignsList.find(c => c.id === selectedCampaignId)?.title}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                {completedCount} of {totalAssign} responses analyzed ({avgResponseRate.toFixed(1)}% complete)
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCampaignChange('all')}
            className="text-xs text-brand font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            {isAr ? 'إعادة ضبط للكل' : 'Reset to All'}
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: isAr ? 'مؤشر الراحة الأرغونومي' : 'Overall Wellbeing Index',
            value: <ScoreRing score={avgScore} />,
            sub: avgScore > 0 ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-success" />
                {isAr ? 'معدل السلامة العام المجمع' : 'Aggregated safety rating'}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">{isAr ? 'بانتظار إجابات التقييم' : 'Awaiting responses'}</span>
            ),
            icon: Activity,
            accent: 'brand',
          },
          {
            label: isAr ? 'إجمالي الموظفين' : 'Total Active Staff',
            value: <div className="text-3xl font-bold text-foreground">{totalEmployees}<span className="text-base font-normal text-muted-foreground"> {isAr ? 'عضو' : 'members'}</span></div>,
            sub: <span className="text-xs text-muted-foreground">{isAr ? 'مسجلين في المنظمة' : 'Configured in workspace'}</span>,
            icon: Users,
            accent: 'success',
          },
          {
            label: isAr ? 'المخاطر الحرجة' : 'Critical OSH Hazards',
            value: <div className={cn("text-3xl font-bold", criticalCount > 0 ? "text-danger" : "text-foreground")}>{criticalCount}</div>,
            sub: <span className="text-xs text-muted-foreground">{openObservations} {isAr ? 'ملاحظة مفتوحة' : 'open observations'}</span>,
            icon: AlertTriangle,
            accent: 'danger',
          },
          {
            label: isAr ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendation Items',
            value: <div className="text-3xl font-bold text-foreground">{recsCount}</div>,
            sub: <span className="text-xs text-muted-foreground">{isAr ? 'مولدة بالـ Gemini AI' : 'Generated by Gemini checks'}</span>,
            icon: Lightbulb,
            accent: 'warning',
          },
        ].map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col justify-between">
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

      {/* 🌟 DEDICATED ASSESSMENT CAMPAIGNS & AUDIT CYCLES SECTION 🌟 */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand" />
              <h2 className="text-base font-bold text-foreground font-sora">
                {isAr ? 'سجل وحملات التقييم الأرغونومي (الجارية والسابقة)' : 'Assessment Campaigns & Audit Cycles'}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAr
                ? 'استعراض جميع حملات التقييم التي تم إطلاقها، متابعة نسب إكمال الموظفين، والتحكم في إغلاقها أو تصفية بياناتها.'
                : 'Manage active running surveys, track employee response rates, and review past ergonomic audit cycles.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={campaignSearchQuery}
                onChange={(e) => setCampaignSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث في الحملات...' : 'Search campaigns...'}
                className="w-full bg-muted/60 border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCampaignFilterTab('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              campaignFilterTab === 'all'
                ? 'bg-brand text-brand-foreground shadow-sm'
                : 'bg-muted/40 border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {isAr ? 'جميع الحملات' : 'All Campaigns'} ({campaignStatsList.length})
          </button>

          <button
            onClick={() => setCampaignFilterTab('ACTIVE')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              campaignFilterTab === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-muted/40 border border-border text-emerald-600 dark:text-emerald-400 hover:text-foreground'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAr ? 'الحملات النشطة والجارية' : 'Active & Running'} ({activeCampaignsCount})
          </button>

          <button
            onClick={() => setCampaignFilterTab('COMPLETED')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              campaignFilterTab === 'COMPLETED'
                ? 'bg-brand text-brand-foreground shadow-sm'
                : 'bg-muted/40 border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {isAr ? 'المكتملة والسابقة' : 'Completed / Past'} ({completedCampaignsCount})
          </button>
        </div>

        {/* Campaign Cards Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10">
            <Layers className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">
              {isAr ? 'لا توجد حملات مطابقة' : 'No assessment campaigns found'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isAr
                ? 'اضغط على "إطلاق تقييم جديد" لبدء دورة تقييم أرغونومي جديدة.'
                : 'Click "Launch Assessment" above to create your first ergonomic survey cycle.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCampaigns.map((camp) => {
              const isActive = camp.status === 'ACTIVE'
              const isSelected = selectedCampaignId === camp.id

              return (
                <div
                  key={camp.id}
                  className={cn(
                    'bg-card rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 hover:shadow-md relative overflow-hidden',
                    isSelected ? 'border-brand ring-2 ring-brand/20' : 'border-border',
                    isActive && 'bg-gradient-to-br from-card via-card to-emerald-500/[0.03]'
                  )}
                >
                  <div>
                    {/* Status & Title Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1.5',
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-muted text-muted-foreground border border-border'
                          )}>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            {isActive ? (isAr ? 'نشط / جاري' : 'Active / Running') : (isAr ? 'مكتمل' : 'Completed')}
                          </span>

                          {isSelected && (
                            <span className="text-[10px] font-bold bg-brand text-brand-foreground px-2 py-0.5 rounded-full">
                              {isAr ? 'محدد حالياً' : 'Current Filter'}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-foreground font-sora">
                          {camp.title}
                        </h3>
                      </div>

                      {/* Wellness Score Badge */}
                      {camp.wellnessScore !== null ? (
                        <div className="text-right shrink-0">
                          <span className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded-lg font-mono block',
                            camp.wellnessScore >= 7 ? 'bg-success/15 text-success' : camp.wellnessScore >= 5 ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
                          )}>
                            {camp.wellnessScore.toFixed(1)}/10
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase">{isAr ? 'الراحة' : 'Comfort'}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                          {isAr ? 'بدون نقاط' : 'No score'}
                        </span>
                      )}
                    </div>

                    {/* Dates & Departments */}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {camp.startDate ? `${new Date(camp.startDate).toLocaleDateString()}` : new Date(camp.createdAt).toLocaleDateString()}
                        {camp.endDate ? ` → ${new Date(camp.endDate).toLocaleDateString()}` : ''}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        {camp.targetDeptNames.join(', ')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-muted/40 p-3 rounded-xl border border-border/50 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">
                          {isAr ? 'معدل استجابة الموظفين' : 'Staff Completion'}
                        </span>
                        <span className="font-bold text-foreground">
                          {camp.completedCount} / {camp.totalAssigned} ({camp.completionRate}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all duration-500',
                            camp.completionRate === 100 ? 'bg-success' : camp.completionRate > 0 ? 'bg-brand' : 'bg-transparent'
                          )}
                          style={{ width: `${Math.min(100, Math.max(5, camp.completionRate))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCampaignChange(camp.id)}
                        className={cn(
                          'inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                          isSelected
                            ? 'bg-brand text-brand-foreground shadow-sm'
                            : 'bg-muted/70 hover:bg-muted text-foreground'
                        )}
                      >
                        <Filter className="w-3 h-3" />
                        {isSelected ? (isAr ? 'معروض الآن' : 'Filtered') : (isAr ? 'تصفية البيانات' : 'Filter Analytics')}
                      </button>

                      <Link
                        href="/org/reports"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground text-xs font-semibold transition-all"
                      >
                        <FileBarChart className="w-3 h-3" />
                        {isAr ? 'التقارير' : 'Reports'}
                      </Link>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCampaignToEdit(camp)
                          setEditModalOpen(true)
                        }}
                        title={isAr ? 'تعديل بيانات الحملة' : 'Edit campaign'}
                        className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {isActive && (
                        <button
                          onClick={() => {
                            setCampaignToEnd(camp)
                            setEndModalOpen(true)
                          }}
                          disabled={endingCampaign}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <StopCircle className="w-3 h-3" />
                          {isAr ? 'إنهاء التقييم' : 'End Campaign'}
                        </button>
                      )}

                      <button
                        onClick={() => setCampaignToDelete(camp)}
                        disabled={deletingCampaignId === camp.id}
                        title={isAr ? 'حذف الحملة' : 'Delete campaign'}
                        className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Chart + Departments Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Trend Chart */}
        <div className="xl:col-span-3 bg-card rounded-2xl border border-border p-5 shadow-sm">
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
        <div className="xl:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Department Comfort Index</h2>
            <Link href="/org/departments" className="text-xs text-brand hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {deptsList.slice(0, 5).map((dept) => {
              const score = dept.wellnessScore
              return (
                <li key={dept.id} className="p-3 rounded-xl bg-muted/30 border border-border space-y-2">
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

      {/* Recent Observations */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
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
              <div key={obs.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
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

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setCampaignToEdit(null)
        }}
        onSave={handleSaveEditedCampaign}
        campaign={campaignToEdit}
        departments={deptsList}
      />

      {/* End Campaign Password Modal */}
      <EndCampaignModal
        isOpen={endModalOpen}
        onClose={() => {
          setEndModalOpen(false)
          setCampaignToEnd(null)
        }}
        onConfirm={async (campId) => {
          await handleEndAssessment(campId)
        }}
        campaignTitle={campaignToEnd?.title || activeAssessment?.title}
        campaignId={campaignToEnd?.id}
      />

      {/* Delete Campaign Confirmation Modal */}
      {campaignToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/20 flex items-center justify-center text-destructive shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sora">
                  {isAr ? 'تأكيد حذف حملة التقييم' : 'Delete Assessment Campaign'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAr
                    ? `هل أنت متأكد من رغبتك في حذف حملة "${campaignToDelete.title}"؟ سيتم حذف جميع التعيينات المرتبطة بها.`
                    : `Are you sure you want to permanently delete "${campaignToDelete.title}"? All associated employee assignments will be removed.`}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={deletingCampaignId !== null}
                onClick={() => setCampaignToDelete(null)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={deletingCampaignId !== null}
                onClick={() => handleDeleteCampaign(campaignToDelete.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {deletingCampaignId === campaignToDelete.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {isAr ? 'جاري الحذف...' : 'Deleting...'}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    {isAr ? 'نعم، حذف الحملة' : 'Delete Campaign'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
