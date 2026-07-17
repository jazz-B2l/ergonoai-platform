'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Building2, ChevronRight, ChevronDown, Sparkles, Loader2, CheckCircle2, Clipboard, ShieldAlert } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const priorityConfig = {
  high: { bg: 'bg-danger/10 border-danger/20', badge: 'bg-danger/15 text-danger', dot: 'bg-danger' },
  medium: { bg: 'bg-warning/10 border-warning/20', badge: 'bg-warning/15 text-warning', dot: 'bg-warning' },
  low: { bg: 'bg-success/10 border-success/20', badge: 'bg-success/15 text-success', dot: 'bg-success' },
}

export function HRRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  
  // Toggle: 'department' or 'assessment'
  const [groupBy, setGroupBy] = useState<'department' | 'assessment'>('department')

  async function fetchRecommendations() {
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
      const orgId = member.organization_id

      // 2. Fetch all departments in organization
      const { data: depts } = await supabase
        .from('departments')
        .select('id, name')
        .eq('organization_id', orgId)
      const deptMap = new Map((depts || []).map(d => [d.id, d.name]))

      // 3. Fetch all members
      const { data: members } = await supabase
        .from('organization_members')
        .select('id, department_id')
        .eq('organization_id', orgId)
      
      const memberDeptMap = new Map((members || []).map(m => [m.id, m.department_id]))

      // 4. Fetch campaigns
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id, title')
        .eq('organization_id', orgId)
      const campaignIds = (campaigns || []).map(c => c.id)
      const campaignNameMap = new Map((campaigns || []).map(c => [c.id, c.title]))

      if (campaignIds.length === 0) {
        setRecommendations([])
        return
      }

      // 5. Fetch assignments
      const { data: assignments } = await supabase
        .from('assessment_assignments')
        .select('id, member_id, campaign_id')
        .in('campaign_id', campaignIds)
      
      const assignmentMemberMap = new Map((assignments || []).map(a => [a.id, a.member_id]))
      const assignmentCampaignMap = new Map((assignments || []).map(a => [a.id, a.campaign_id]))

      if (!assignments || assignments.length === 0) {
        setRecommendations([])
        return
      }

      // 6. Fetch responses
      const { data: responses } = await supabase
        .from('assessment_responses')
        .select('id, assignment_id, submitted_at')
        .in('assignment_id', assignments.map(a => a.id))

      if (!responses || responses.length === 0) {
        setRecommendations([])
        return
      }
      
      const responseMemberMap = new Map(responses.map(r => [r.id, assignmentMemberMap.get(r.assignment_id)]))
      const responseCampaignMap = new Map(
        responses.map(r => {
          const campaignId = assignmentCampaignMap.get(r.assignment_id)
          return [r.id, campaignNameMap.get(campaignId || '') || 'Ergonomics Campaign']
        })
      )
      const responseDateMap = new Map(
        responses.map(r => [
          r.id, 
          r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : 'N/A'
        ])
      )

      // 7. Fetch analyses with overall summary/notes
      const { data: analyses } = await supabase
        .from('assessment_ai_analysis')
        .select('id, response_id, summary')
        .in('response_id', responses.map(r => r.id))

      if (!analyses || analyses.length === 0) {
        setRecommendations([])
        return
      }
      
      const analysisMemberMap = new Map(analyses.map(a => [a.id, responseMemberMap.get(a.response_id)]))
      const analysisResponseMap = new Map(analyses.map(a => [a.id, a.response_id]))
      const analysisSummaryMap = new Map(analyses.map(a => [a.id, a.summary]))

      // 8. Fetch recommendations
      const { data: recs } = await supabase
        .from('assessment_ai_recommendations')
        .select('*')
        .in('analysis_id', analyses.map(a => a.id))
        .order('created_at', { ascending: false })

      if (recs) {
        const combined = recs.map(r => {
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
        setRecommendations(combined)
        if (combined.length > 0 && !expanded) {
          setExpanded(combined[0].id)
        }
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  async function updateStatus(recId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('assessment_ai_recommendations')
        .update({ status: newStatus })
        .eq('id', recId)

      if (error) throw error
      
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

  // 1. Grouping by Department
  const groupedByDept = recommendations.reduce((acc: Record<string, { department: string; items: any[] }>, rec) => {
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
  const groupedByAssessment = recommendations.reduce((acc: Record<string, { index: number; campaignTitle: string; submittedAt: string; department: string; summaryNotes: string; items: any[] }>, rec) => {
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
                <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full capitalize', badge)}>
                  {rec.priority}
                </span>
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>{rec.category}</span>
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="px-10 pb-4 space-y-3 font-sans">
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-brand/5 border border-brand/15">
              <ChevronRight className="w-4 h-4 text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-brand mb-1">Recommended Action</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.action}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {!isCompleted && !isInProgress && (
                <button 
                  onClick={() => updateStatus(rec.id, 'IN_PROGRESS')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer font-medium"
                >
                  Mark as In Progress
                </button>
              )}
              {isInProgress && (
                <button 
                  onClick={() => updateStatus(rec.id, 'COMPLETED')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-success text-success-foreground hover:opacity-90 transition-opacity cursor-pointer font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Completed
                </button>
              )}
              {isCompleted && (
                <button 
                  onClick={() => updateStatus(rec.id, 'PENDING')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
                >
                  Reopen Recommendation
                </button>
              )}
              <button 
                onClick={() => updateStatus(rec.id, 'DISMISSED')}
                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-foreground">AI Recommendations</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span className="text-xs text-brand font-medium">Anonymized Insights</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Ergonomic modifications and comfort action items generated by Groq AI
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg border border-border shrink-0">
          <button
            onClick={() => setGroupBy('department')}
            className={cn(
              "text-xs px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer",
              groupBy === 'department' ? "bg-card text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Group by Department
          </button>
          <button
            onClick={() => setGroupBy('assessment')}
            className={cn(
              "text-xs px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer",
              groupBy === 'assessment' ? "bg-card text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Group by Assessment & Notes
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-brand/5 border border-brand/15 font-sans">
        <Lightbulb className="w-4 h-4 text-brand mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Anonymity Guaranteed.</strong> Individual identity metrics are omitted. The system associates assessments purely to the department or to an anonymous assessment index token.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10 font-sans">
          <Sparkles className="w-8 h-8 text-brand/40 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">No recommendations generated yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Once employees complete their ergonomic questionnaires, safety analyses will auto-populate this page with recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Group by Department view */}
          {groupBy === 'department' && (
            <div className="space-y-8">
              {Object.entries(groupedByDept).map(([deptName, group]) => (
                <div key={deptName} className="space-y-4 border border-border bg-card/10 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-border pb-3 font-sans">
                    <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground leading-snug">{group.department} Department</h2>
                      <p className="text-xs text-muted-foreground">{group.items.length} active safety checks</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {group.items.map((r) => (
                      <RecommendationCard key={r.id} rec={r} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Group by Individual Assessment & Notes view */}
          {groupBy === 'assessment' && (
            <div className="space-y-8">
              {Object.entries(groupedByAssessment).map(([responseId, group]) => (
                <div key={responseId} className="space-y-4 border border-border bg-card/10 rounded-2xl p-5 shadow-sm">
                  {/* Header Block */}
                  <div className="flex items-start justify-between border-b border-border pb-3 flex-wrap gap-2 font-sans">
                    <div>
                      <h2 className="text-sm font-bold text-foreground">Assessment #{group.index}</h2>
                      <p className="text-xs text-muted-foreground">{group.department} Department</p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground font-semibold inline-block mb-1">
                        {group.campaignTitle}
                      </span>
                      <p className="text-[10px] text-muted-foreground font-mono">Submitted: {group.submittedAt}</p>
                    </div>
                  </div>

                  {/* AI Summary Notes Box */}
                  <div className="flex items-start gap-2.5 p-4 rounded-xl bg-muted/60 border border-border font-sans">
                    <Clipboard className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">AI Workspace Assessment Notes</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{group.summaryNotes}</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3 pt-2">
                    {group.items.map((r) => (
                      <RecommendationCard key={r.id} rec={r} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
