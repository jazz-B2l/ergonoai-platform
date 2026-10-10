'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Lightbulb,
  Building2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileBarChart,
  Eye,
  Filter,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

const priorityConfig = {
  high: { bg: 'bg-danger/10 border-danger/20', badge: 'bg-danger/15 text-danger', dot: 'bg-danger' },
  medium: { bg: 'bg-warning/10 border-warning/20', badge: 'bg-warning/15 text-warning', dot: 'bg-warning' },
  low: { bg: 'bg-success/10 border-success/20', badge: 'bg-success/15 text-success', dot: 'bg-success' },
}

export function HRRecommendations() {
  const { activeAssessment, language } = useApp()
  const isAr = language === 'ar'
  const t = translations[language].dashboard

  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  
  // Toggle: 'department' or 'assessment'
  const [groupBy, setGroupBy] = useState<'department' | 'assessment'>('department')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  // Campaigns & Org
  const [campaignsList, setCampaignsList] = useState<any[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all')
  const [orgId, setOrgId] = useState<string | null>(null)

  async function fetchRecommendations(campaignIdToFetch?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Get organization membership
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (!member) return
      const organizationId = member.organization_id
      setOrgId(organizationId)

      // 2. Fetch all departments in organization
      const { data: depts } = await supabase
        .from('departments')
        .select('id, name')
        .eq('organization_id', organizationId)
      const deptMap = new Map((depts || []).map((d: any) => [d.id, d.name]))

      // 3. Fetch all members
      const { data: members } = await supabase
        .from('organization_members')
        .select('id, department_id')
        .eq('organization_id', organizationId)
      
      const memberDeptMap = new Map((members || []).map((m: any) => [m.id, m.department_id]))

      // 4. Fetch campaigns
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id, title, status, created_at')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      const allCampaigns = campaigns || []
      setCampaignsList(allCampaigns)

      const activeTargetCampaignId = campaignIdToFetch !== undefined ? campaignIdToFetch : selectedCampaignId

      let targetCampaignIds = allCampaigns.map((c: any) => c.id)
      if (activeTargetCampaignId && activeTargetCampaignId !== 'all') {
        targetCampaignIds = [activeTargetCampaignId]
      }

      const campaignNameMap = new Map(allCampaigns.map((c: any) => [c.id, c.title]))

      if (targetCampaignIds.length === 0) {
        setRecommendations([])
        return
      }

      // 5. Fetch assignments
      const { data: assignments } = await supabase
        .from('assessment_assignments')
        .select('id, member_id, campaign_id')
        .in('campaign_id', targetCampaignIds)
      
      const assignmentMemberMap = new Map((assignments || []).map((a: any) => [a.id, a.member_id]))
      const assignmentCampaignMap = new Map((assignments || []).map((a: any) => [a.id, a.campaign_id]))

      if (!assignments || assignments.length === 0) {
        setRecommendations([])
        return
      }

      // 6. Fetch responses
      const { data: responses } = await supabase
        .from('assessment_responses')
        .select('id, assignment_id, submitted_at, ai_risk_score, completion_percentage')
        .in('assignment_id', assignments.map((a: any) => a.id))

      if (!responses || responses.length === 0) {
        setRecommendations([])
        return
      }
      
      const responseMemberMap = new Map(responses.map((r: any) => [r.id, assignmentMemberMap.get(r.assignment_id)]))
      const responseCampaignMap = new Map(
        responses.map((r: any) => {
          const campId = assignmentCampaignMap.get(r.assignment_id)
          return [r.id, campaignNameMap.get(campId || '') || 'Ergonomics Campaign']
        })
      )
      const responseDateMap = new Map(
        responses.map((r: any) => [
          r.id, 
          r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : 'N/A'
        ])
      )

      // 7. Fetch analyses with overall summary/notes
      const { data: analyses } = await supabase
        .from('assessment_ai_analysis')
        .select('id, response_id, summary, recommendations')
        .in('response_id', responses.map((r: any) => r.id))

      const analysisMemberMap = new Map((analyses || []).map((a: any) => [a.id, responseMemberMap.get(a.response_id)]))
      const analysisResponseMap = new Map((analyses || []).map((a: any) => [a.id, a.response_id]))
      const analysisSummaryMap = new Map((analyses || []).map((a: any) => [a.id, a.summary]))

      let combined: any[] = []

      // 8. Fetch recommendations from database
      if (analyses && analyses.length > 0) {
        const { data: recs } = await supabase
          .from('assessment_ai_recommendations')
          .select('*')
          .in('analysis_id', analyses.map((a: any) => a.id))
          .order('created_at', { ascending: false })

        if (recs && recs.length > 0) {
          combined = recs.map((r: any) => {
            const responseId = analysisResponseMap.get(r.analysis_id) || ''
            const memberId = analysisMemberMap.get(r.analysis_id)
            const deptId = memberDeptMap.get(memberId)
            const deptName = deptMap.get(deptId) || 'General Workspace'
            const campaignTitle = responseCampaignMap.get(responseId) || 'Assessment Campaign'
            const submittedAt = responseDateMap.get(responseId) || 'N/A'
            const summaryNotes = analysisSummaryMap.get(r.analysis_id) || 'No assessment summary notes available.'
            
            let normPriority: 'low' | 'medium' | 'high' = 'medium'
            const p = (r.priority || 'medium').toLowerCase()
            if (p === 'high' || p === 'critical') normPriority = 'high'
            else if (p === 'low') normPriority = 'low'

            return {
              id: r.id,
              title: r.title,
              description: r.description,
              priority: normPriority,
              category: r.category || 'Ergonomics',
              department: deptName,
              status: r.status || 'PENDING',
              action: r.description,
              responseId,
              campaignTitle,
              submittedAt,
              summaryNotes
            }
          })
        }
      }

      // 9. If no recommendations stored yet but responses exist, synthesize from responses/answers
      if (combined.length === 0 && responses.length > 0) {
        const { data: answers } = await supabase
          .from('response_answers')
          .select('id, response_id, answer_text, numeric_answer, assessment_questions(question_text, category, body_region)')
          .in('response_id', responses.map((r: any) => r.id))

        const answersList = answers || []

        responses.forEach((resp: any, idx: number) => {
          const memberId = responseMemberMap.get(resp.id)
          const deptId = memberDeptMap.get(memberId)
          const deptName = deptMap.get(deptId) || 'General Workspace'
          const campaignTitle = responseCampaignMap.get(resp.id) || 'Assessment Campaign'
          const submittedAt = responseDateMap.get(resp.id) || 'N/A'

          const respAnswers = answersList.filter((a: any) => a.response_id === resp.id)
          
          // Identify pain areas
          const painPoints: string[] = []
          respAnswers.forEach((ans: any) => {
            const num = ans.numeric_answer ?? parseFloat(ans.answer_text)
            const isPain = !isNaN(num) ? num >= 4 : (ans.answer_text === 'yes' || ans.answer_text === 'true')
            const bRegion = ans.assessment_questions?.body_region || ''
            if (isPain && bRegion && !painPoints.includes(bRegion)) {
              painPoints.push(bRegion)
            }
          })

          const syntheticRecs = [
            {
              id: `syn_rec_1_${resp.id}`,
              title: isAr ? 'تعديل بيئة العمل وتوفير مساند دعم قطني' : 'Workstation Ergonomic Adjustment & Lumbar Support',
              description: isAr 
                ? `استناداً إلى نتائج استبيان الموظف (${painPoints.join(', ') || 'الإجهاد العضلي'}), يُوصى بتوفير مقاعد قابلة للضبط مع دعم ديناميكي للظهر.`
                : `Based on reported strain points (${painPoints.join(', ') || 'general musculoskeletal load'}), provide ergonomic seating with dynamic lumbar support.`,
              priority: (painPoints.length >= 2 ? 'high' : 'medium') as 'high' | 'medium',
              category: 'Musculoskeletal',
              department: deptName,
              status: 'PENDING',
              action: isAr 
                ? 'فحص زوايا الجلوس وضبط ارتفاع المقعد والمكتب لمنع انحناء العمود الفقري.'
                : 'Inspect seating angles and adjust desk/chair heights to avoid spinal flexion.',
              responseId: resp.id,
              campaignTitle,
              submittedAt,
              summaryNotes: isAr ? 'استبيان تقييم مكتمل من قِبل الموظف.' : 'Completed ergonomic survey evaluation.'
            },
            {
              id: `syn_rec_2_${resp.id}`,
              title: isAr ? 'معايرة ارتفاع الشاشات ومنع الوهج البصري' : 'Display Elevation & Anti-Glare Calibration',
              description: isAr 
                ? 'ضبط حافة الشاشة العلوية بمستوى العين على بُعد 50-60 سم لتقليل إجهاد الرقبة والأكتاف.'
                : 'Position the top bezel of computer displays at eye level to mitigate cervical and shoulder strain.',
              priority: 'medium' as const,
              category: 'Physical',
              department: deptName,
              status: 'PENDING',
              action: isAr 
                ? 'توزيع حوامل شاشات قابلة للتعديل وفلاتر حماية ضد الإنعكاس الضوئي.'
                : 'Deploy adjustable monitor risers and anti-glare filters across desk workstations.',
              responseId: resp.id,
              campaignTitle,
              submittedAt,
              summaryNotes: isAr ? 'توصيات وقائية مبنية على الإجهاد البصري والوضعية.' : 'Preventive ergonomics based on visual posture.'
            },
            {
              id: `syn_rec_3_${resp.id}`,
              title: isAr ? 'بروتوكول فترات الراحة الحركية القصيرة (Micro-breaks)' : 'Postural Recovery Micro-Break Protocol',
              description: isAr 
                ? 'تطبيق فترات تمدد حركي لمدة 3-5 دقائق كل 60 دقيقة لتنشيط الدورة الدموية وتقليل التيبس العضلي.'
                : 'Institute structured 3-5 minute active movement and stretching intervals every 60 minutes.',
              priority: 'low' as const,
              category: 'Negative/Passive',
              department: deptName,
              status: 'PENDING',
              action: isAr 
                ? 'إرسال تذكيرات آلية وتشجيع الموظفين على تمارين الإطالة المكتبية.'
                : 'Schedule automated desktop stretch reminders to counter prolonged static sitting.',
              responseId: resp.id,
              campaignTitle,
              submittedAt,
              summaryNotes: isAr ? 'تحسين مرونة وحيوية بيئة العمل المكتبية.' : 'Improve dynamic workplace mobility.'
            }
          ]

          combined.push(...syntheticRecs)
        })
      }

      setRecommendations(combined)
      if (combined.length > 0 && !expanded) {
        setExpanded(combined[0].id)
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateFreshAI() {
    if (!orgId) return
    setGenerating(true)
    try {
      // Find unanalyzed responses or trigger recommendations
      const { data: assignments } = await supabase
        .from('assessment_assignments')
        .select('id')
        .eq('campaign_id', selectedCampaignId !== 'all' ? selectedCampaignId : campaignsList[0]?.id)

      if (assignments && assignments.length > 0) {
        const { data: responses } = await supabase
          .from('assessment_responses')
          .select('id')
          .in('assignment_id', assignments.map((a: any) => a.id))

        if (responses && responses.length > 0) {
          for (const resp of responses) {
            await fetch('/api/ai/assessment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ responseId: resp.id })
            }).catch(e => console.warn(e))
          }
        }
      }

      await fetchRecommendations(selectedCampaignId)
    } catch (err) {
      console.error('Failed to trigger AI recommendations:', err)
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    // Initial fetch: default to activeAssessment if available
    const initialCamp = activeAssessment?.id || 'all'
    setSelectedCampaignId(initialCamp)
    fetchRecommendations(initialCamp)
  }, [])

  // Sync when activeAssessment changes
  useEffect(() => {
    if (activeAssessment?.id && activeAssessment.id !== selectedCampaignId) {
      setSelectedCampaignId(activeAssessment.id)
      fetchRecommendations(activeAssessment.id)
    }
  }, [activeAssessment?.id])

  async function handleCampaignSelect(campId: string) {
    setSelectedCampaignId(campId)
    setLoading(true)
    await fetchRecommendations(campId)
    setLoading(false)
  }

  async function updateStatus(recId: string, newStatus: string) {
    try {
      if (!recId.startsWith('syn_rec')) {
        await supabase
          .from('assessment_ai_recommendations')
          .update({ status: newStatus })
          .eq('id', recId)
      }
      
      setRecommendations(prev => 
        prev.map(r => r.id === recId ? { ...r, status: newStatus } : r)
      )
    } catch (err) {
      console.error('Failed to update recommendation status:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  const selectedCampaignObj = campaignsList.find(c => c.id === selectedCampaignId)

  // Filter recommendations by priority
  const filteredRecs = priorityFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.priority === priorityFilter)

  // 1. Grouping by Department
  const groupedByDept = filteredRecs.reduce((acc: Record<string, { department: string; items: any[] }>, rec) => {
    const key = rec.department
    if (!acc[key]) {
      acc[key] = {
        department: rec.department,
        items: []
      }
    }
    acc[key].items.push(rec)
    return acc
  }, {})

  // 2. Grouping by Anonymized Assessment
  const groupedByAssessment = filteredRecs.reduce((acc: Record<string, { index: number; campaignTitle: string; submittedAt: string; department: string; summaryNotes: string; items: any[] }>, rec) => {
    const key = rec.responseId
    if (!acc[key]) {
      acc[key] = {
        index: Object.keys(acc).length + 1,
        campaignTitle: rec.campaignTitle,
        submittedAt: rec.submittedAt,
        department: rec.department,
        summaryNotes: rec.summaryNotes,
        items: []
      }
    }
    acc[key].items.push(rec)
    return acc
  }, {})

  function RecommendationCard({ rec }: { rec: any }) {
    const { bg, badge, dot } = priorityConfig[rec.priority as 'low' | 'medium' | 'high'] || priorityConfig.medium
    const isOpen = expanded === rec.id
    const isCompleted = rec.status === 'COMPLETED'
    const isInProgress = rec.status === 'IN_PROGRESS'

    return (
      <div className={cn(
        'rounded-xl border overflow-hidden transition-all shadow-sm', 
        isOpen ? bg : 'bg-card border-border',
        isCompleted && 'opacity-60 hover:opacity-100'
      )}>
        <button
          onClick={() => setExpanded(isOpen ? null : rec.id)}
          className="w-full flex items-start gap-4 p-4 text-left font-sans cursor-pointer"
        >
          <div className={cn('mt-1.5 w-2 h-2 rounded-full shrink-0', dot)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className={cn(
                'text-sm font-semibold text-foreground leading-snug',
                isCompleted && 'line-through text-muted-foreground'
              )}>
                {rec.title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                {rec.status !== 'PENDING' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand/10 text-brand uppercase">
                    {rec.status.replace('_', ' ')}
                  </span>
                )}
                <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize', badge)}>
                  {rec.priority}
                </span>
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
              <span>{rec.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-muted-foreground" />
                {rec.department}
              </span>
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="px-10 pb-4 space-y-3 font-sans">
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-brand/5 border border-brand/15">
              <ChevronRight className="w-4 h-4 text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-brand mb-1">
                  {isAr ? 'الإجراء التصحيحي المقترح' : 'Recommended Action'}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.action}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {!isCompleted && !isInProgress && (
                <button 
                  onClick={() => updateStatus(rec.id, 'IN_PROGRESS')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer font-medium"
                >
                  {isAr ? 'بدء التنفيذ' : 'Mark as In Progress'}
                </button>
              )}
              {isInProgress && (
                <button 
                  onClick={() => updateStatus(rec.id, 'COMPLETED')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-success text-success-foreground hover:opacity-90 transition-opacity cursor-pointer font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isAr ? 'تأكيد الإنجاز' : 'Mark as Completed'}
                </button>
              )}
              {isCompleted && (
                <button 
                  onClick={() => updateStatus(rec.id, 'PENDING')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  {isAr ? 'إعادة الفتح' : 'Reopen'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header with Campaign Dropdown & Actions */}
      <div className="flex items-start justify-between font-sans flex-wrap gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground font-sora">
              {isAr ? 'التوصيات والإجراءات التصحيحية الذكية' : 'AI Corrective Recommendations'}
            </h1>
            {selectedCampaignObj && (
              <span className={cn(
                'text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border',
                selectedCampaignObj.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-muted text-muted-foreground border-border'
              )}>
                {selectedCampaignObj.status === 'ACTIVE' ? (isAr ? 'حملة نشطة' : 'Active Campaign') : (isAr ? 'حملة مكتملة' : 'Completed')}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isAr
              ? 'توصيات أرغونومية وإجراءات وقائية مقترحة بالذكاء الاصطناعي بناءً على نتائج استبيانات التقييم المكتملة'
              : 'AI-synthesized ergonomic interventions and workplace ergonomic corrective actions based on assessment survey findings'}
          </p>
        </div>

        {/* Campaign Filter & Quick Links */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {campaignsList.length > 0 && (
            <div className="flex items-center gap-2 bg-muted/60 border border-border px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                {isAr ? 'الحملة:' : 'Campaign:'}
              </span>
              <select
                value={selectedCampaignId}
                onChange={(e) => handleCampaignSelect(e.target.value)}
                className="text-xs bg-transparent border-0 text-foreground font-bold cursor-pointer outline-none focus:ring-0"
              >
                <option value="all" className="bg-card text-foreground">
                  {isAr ? 'جميع الحملات (All Campaigns)' : 'All Campaigns'}
                </option>
                {campaignsList.map(c => (
                  <option key={c.id} value={c.id} className="bg-card text-foreground">
                    {c.title} {c.status === 'ACTIVE' ? '🟢 (Active)' : '🔵 (Completed)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleGenerateFreshAI}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {isAr ? 'جاري التحليل...' : 'Analyzing...'}
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                {isAr ? 'تحديث بالذكاء الاصطناعي' : 'AI Scan & Refresh'}
              </>
            )}
          </button>

          <Link
            href="/org/hazard-checklist"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground text-xs font-semibold transition-all border border-border"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {isAr ? 'قائمة المخاطر' : 'Hazard Checklist'}
          </Link>

          <Link
            href="/org/reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground text-xs font-semibold transition-all border border-border"
          >
            <FileBarChart className="w-3.5 h-3.5" />
            {isAr ? 'التقارير' : 'Reports'}
          </Link>
        </div>
      </div>

      {/* Filter and Group Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Priority Tabs */}
        <div className="flex items-center gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map((p) => {
            const count = p === 'all' ? recommendations.length : recommendations.filter(r => r.priority === p).length
            return (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer capitalize',
                  priorityFilter === p
                    ? 'bg-brand text-brand-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {p === 'all' ? (isAr ? 'جميع الأولويات' : 'All Priorities') : p} ({count})
              </button>
            )
          })}
        </div>

        {/* Group View Toggle */}
        <div className="flex items-center gap-1 bg-muted/60 border border-border p-1 rounded-xl font-sans">
          <button
            onClick={() => setGroupBy('department')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              groupBy === 'department' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            {isAr ? 'حسب القسم' : 'By Department'}
          </button>
          <button
            onClick={() => setGroupBy('assessment')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              groupBy === 'assessment' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            {isAr ? 'حسب التقييم' : 'By Assessment Survey'}
          </button>
        </div>
      </div>

      {/* Recommendations Content */}
      {filteredRecs.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-muted/10 font-sans space-y-3">
          <Lightbulb className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <h3 className="text-base font-bold text-foreground font-sora">
            {isAr ? 'لا توجد توصيات مسجلة لهذه الحملة حتى الآن' : 'No AI recommendations generated yet'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            {isAr
              ? 'بمجرد أن يُكمل الموظفون استبيانات التقييم الأرغونومي، سيقوم محرك الذكاء الاصطناعي بتحليل النتائج واقتراح التوصيات المناسبة لكل قسم.'
              : 'Once staff submit ergonomic assessments for this campaign, the AI engine synthesizes targeted interventions for each department.'}
          </p>
          <button
            onClick={handleGenerateFreshAI}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-sm cursor-pointer disabled:opacity-50 mt-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isAr ? 'إجراء مسح وتحليل الآن' : 'Scan & Generate Interventions'}
          </button>
        </div>
      ) : groupBy === 'department' ? (
        <div className="space-y-6">
          {Object.entries(groupedByDept).map(([deptName, group]) => (
            <div key={deptName} className="space-y-3 font-sans">
              <div className="flex items-center gap-2 px-1">
                <Building2 className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-bold text-foreground font-sora">{deptName}</h2>
                <span className="text-xs text-muted-foreground">({group.items.length} {isAr ? 'توصية' : 'actions'})</span>
              </div>
              <div className="space-y-2.5">
                {group.items.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByAssessment).map(([respId, group]) => (
            <div key={respId} className="bg-card/50 border border-border rounded-2xl p-5 space-y-4 font-sans">
              <div className="flex items-start justify-between gap-4 border-b border-border pb-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                      {isAr ? `تقييم موظف #${group.index}` : `Assessment #${group.index}`}
                    </span>
                    <span className="text-xs font-semibold text-foreground font-sora">{group.campaignTitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5">
                    <span>{isAr ? 'القسم:' : 'Department:'} {group.department}</span>
                    <span>·</span>
                    <span>{isAr ? 'تاريخ التقديم:' : 'Submitted:'} {group.submittedAt}</span>
                  </div>
                </div>
              </div>

              {group.summaryNotes && (
                <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                  {group.summaryNotes}
                </p>
              )}

              <div className="space-y-2.5">
                {group.items.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
