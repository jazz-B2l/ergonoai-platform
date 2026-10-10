'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  Building2,
  Sparkles,
  Lightbulb,
  Eye,
  FileBarChart,
  Layers,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

type HazardCategoryName = 'Physical' | 'Chemical' | 'Mechanical' | 'Biological' | 'Fire' | 'Negative/Passive'

const CATEGORIES: HazardCategoryName[] = [
  'Physical',
  'Chemical',
  'Mechanical',
  'Biological',
  'Fire',
  'Negative/Passive',
]

const categoryDescriptions: Record<HazardCategoryName, string> = {
  Physical: 'Heat/cold, noise, vibration, lighting, radiation, air pressure',
  Chemical: 'Storage, GHS/SDS labeling, ventilation, exposure routes',
  Mechanical: 'Machine guarding, maintenance schedules, PPE availability',
  Biological: 'Pathogen exposure, hygiene facilities',
  Fire: 'Ignition sources, extinguisher type/coverage, evacuation',
  'Negative/Passive': 'Missing rescue equipment, first-aid, housekeeping gaps',
}

const statusConfig = {
  compliant: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Compliant' },
  'non-compliant': { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', label: 'Non-Compliant' },
  'needs-review': { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Needs Review' },
  'not-applicable': { icon: MinusCircle, color: 'text-muted-foreground', bg: 'bg-muted/50', label: 'N/A' },
}

const riskConfig = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-orange-500/10 text-orange-400',
  critical: 'bg-danger/15 text-danger',
}

function CategorySection({ category, items, isAr }: { category: HazardCategoryName; items: any[]; isAr: boolean }) {
  const [expanded, setExpanded] = useState(true)

  const counts = {
    compliant: items.filter((i) => i.status === 'compliant').length,
    nonCompliant: items.filter((i) => i.status === 'non-compliant').length,
    review: items.filter((i) => i.status === 'needs-review').length,
  }
  const hasCritical = items.some((i) => i.riskLevel === 'critical')

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden font-sans">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
      >
        <div className="flex-1 flex items-center gap-3 text-left">
          <h3 className="text-sm font-semibold text-foreground">{category}</h3>
          {hasCritical && (
            <span className="text-[10px] bg-danger/15 text-danger px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {isAr ? 'حرج' : 'Critical'}
            </span>
          )}
          <p className="text-xs text-muted-foreground hidden md:block">{categoryDescriptions[category]}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="flex items-center gap-1 text-success"><CheckCircle2 className="w-3.5 h-3.5" />{counts.compliant}</span>
            <span className="flex items-center gap-1 text-danger"><XCircle className="w-3.5 h-3.5" />{counts.nonCompliant}</span>
            <span className="flex items-center gap-1 text-warning"><AlertCircle className="w-3.5 h-3.5" />{counts.review}</span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border divide-y divide-border">
          {items.map((item) => {
            const { icon: Icon, color, bg, label } = statusConfig[item.status as 'compliant' | 'non-compliant' | 'needs-review' | 'not-applicable'] || statusConfig.compliant
            return (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                <div className={cn('mt-0.5 p-1 rounded-lg shrink-0', bg)}>
                  <Icon className={cn('w-3.5 h-3.5', color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{item.item}</p>
                    {item.isAiGenerated && (
                      <span className="flex items-center gap-1 text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded border border-brand/20 font-bold uppercase">
                        <Sparkles className="w-2.5 h-2.5" />
                        {isAr ? 'مكتشف بالذكاء الاصطناعي' : 'AI Detected'}
                      </span>
                    )}
                    {item.departmentName && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border">
                        {item.departmentName}
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {item.notes}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-0.5">{isAr ? 'آخر فحص:' : 'Last checked:'} {item.lastChecked}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono">
                  <span className={cn('text-xs px-2 py-0.5 rounded-md font-semibold capitalize', riskConfig[item.riskLevel as 'low' | 'medium' | 'high' | 'critical'])}>
                    {item.riskLevel}
                  </span>
                  <span className={cn('text-xs font-semibold', color)}>{label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function HRHazardChecklist() {
  const { activeAssessment, language } = useApp()
  const isAr = language === 'ar'
  const t = translations[language].dashboard

  const [filterCategory, setFilterCategory] = useState<HazardCategoryName | 'All'>('All')
  const [checklist, setChecklist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Campaigns list
  const [campaignsList, setCampaignsList] = useState<any[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)

  async function ensureCategoriesExist(organizationId: string) {
    const { data: existingCats } = await supabase
      .from('hazard_categories')
      .select('id, name')
      .eq('organization_id', organizationId)

    if (!existingCats || existingCats.length === 0) {
      const categoriesToInsert = CATEGORIES.map(cat => ({
        organization_id: organizationId,
        name: cat,
        description: categoryDescriptions[cat]
      }))

      await supabase
        .from('hazard_categories')
        .insert(categoriesToInsert)
    }
  }

  async function loadChecklistData(organizationId: string, campaignId: string | null) {
    try {
      await ensureCategoriesExist(organizationId)

      // 1. Fetch categories
      const { data: categories } = await supabase
        .from('hazard_categories')
        .select('id, name')
        .eq('organization_id', organizationId)

      const catIdToName = new Map((categories || []).map((c: any) => [c.id, c.name]))

      // 2. Fetch standard hazards
      const { data: hazards } = await supabase
        .from('hazards')
        .select('*')
        .in('category_id', (categories || []).map((c: any) => c.id))

      // 3. Fetch open occurrences
      const { data: occurrences } = await supabase
        .from('hazard_occurrences')
        .select('*')
        .eq('organization_id', organizationId)

      const activeOccurrencesMap = new Map<string, any>()
      if (occurrences) {
        occurrences.forEach((o: any) => {
          if (o.status !== 'RESOLVED') {
            activeOccurrencesMap.set(o.hazard_id, o)
          }
        })
      }

      const standardChecklistItems = (hazards || []).map((h: any) => {
        const activeOcc = activeOccurrencesMap.get(h.id)
        const catName = catIdToName.get(h.category_id) || 'Physical'
        
        let status = 'compliant'
        let notes = ''
        let riskLevel = (h.default_risk_level || 'low').toLowerCase()
        let lastChecked = new Date(h.updated_at || h.created_at).toLocaleDateString()

        if (activeOcc) {
          status = activeOcc.status === 'OPEN' ? 'non-compliant' : 'needs-review'
          notes = activeOcc.description || ''
          riskLevel = (activeOcc.severity || h.default_risk_level || 'medium').toLowerCase()
          lastChecked = new Date(activeOcc.updated_at || activeOcc.created_at).toLocaleDateString()
        }

        return {
          id: h.id,
          category: catName as HazardCategoryName,
          item: h.name,
          status,
          notes,
          riskLevel,
          lastChecked,
          isAiGenerated: false
        }
      })

      // 4. Fetch Campaign Hazards & AI Findings
      let campaignChecklistItems: any[] = []
      if (campaignId && campaignId !== 'all') {
        const { data: assignments } = await supabase
          .from('assessment_assignments')
          .select('id, member_id')
          .eq('campaign_id', campaignId)

        if (assignments && assignments.length > 0) {
          const assignmentIds = assignments.map((a: any) => a.id)

          // Fetch member departments lookup
          const { data: membersList } = await supabase
            .from('organization_members')
            .select('id, department_id, departments(name)')
            .eq('organization_id', organizationId)
          
          const memberDeptNameMap = new Map<string, string>()
          ;(membersList || []).forEach((m: any) => {
            const dName = (Array.isArray(m.departments) ? m.departments[0]?.name : (m.departments as any)?.name) || 'Department'
            memberDeptNameMap.set(m.id, dName)
          })

          const assignmentMemberMap = new Map(assignments.map((a: any) => [a.id, a.member_id]))

          const { data: responses } = await supabase
            .from('assessment_responses')
            .select('id, assignment_id, ai_risk_score, completion_percentage, submitted_at')
            .in('assignment_id', assignmentIds)

          if (responses && responses.length > 0) {
            const responseIds = responses.map((r: any) => r.id)

            // Try fetching existing AI analyses
            const { data: analyses } = await supabase
              .from('assessment_ai_analysis')
              .select('id, response_id')
              .in('response_id', responseIds)

            if (analyses && analyses.length > 0) {
              const { data: findings } = await supabase
                .from('assessment_ai_findings')
                .select('*')
                .in('analysis_id', analyses.map((a: any) => a.id))

              if (findings && findings.length > 0) {
                const analysisToResponse = new Map(analyses.map((a: any) => [a.id, a.response_id]))
                const responseToAssign = new Map(responses.map((r: any) => [r.id, r.assignment_id]))

                findings.forEach((f: any) => {
                  const respId = analysisToResponse.get(f.analysis_id)
                  const assignId = respId ? responseToAssign.get(respId) : undefined
                  const memberId = assignId ? assignmentMemberMap.get(assignId) : undefined
                  const deptName = memberId ? memberDeptNameMap.get(String(memberId)) : undefined

                  let catName: HazardCategoryName = 'Physical'
                  const checkCat = (f.category || '').toLowerCase()
                  if (checkCat.includes('mech') || checkCat.includes('seat') || checkCat.includes('chair') || checkCat.includes('posture')) catName = 'Mechanical'
                  else if (checkCat.includes('chem')) catName = 'Chemical'
                  else if (checkCat.includes('bio')) catName = 'Biological'
                  else if (checkCat.includes('fire')) catName = 'Fire'
                  else if (checkCat.includes('pass') || checkCat.includes('break') || checkCat.includes('negative')) catName = 'Negative/Passive'

                  campaignChecklistItems.push({
                    id: f.id,
                    category: catName,
                    item: f.finding,
                    status: 'non-compliant',
                    notes: `AI Risk Index: ${f.score || 'N/A'}/100. Target body zone: ${f.body_part || 'General Ergonomics'}.`,
                    riskLevel: (f.severity || 'medium').toLowerCase(),
                    lastChecked: new Date(f.created_at).toLocaleDateString(),
                    isAiGenerated: true,
                    departmentName: deptName
                  })
                })
              }
            }

            // Also inspect response answers directly if findings are sparse
            if (campaignChecklistItems.length === 0) {
              const { data: answers } = await supabase
                .from('response_answers')
                .select('id, response_id, answer_text, numeric_answer, assessment_questions(question_text, category, body_region)')
                .in('response_id', responseIds)

              if (answers && answers.length > 0) {
                answers.forEach((ans: any) => {
                  const qText = ans.assessment_questions?.question_text || ''
                  const bRegion = ans.assessment_questions?.body_region || ''
                  const num = ans.numeric_answer ?? parseFloat(ans.answer_text)
                  const isHigh = !isNaN(num) ? num >= 4 : (ans.answer_text === 'yes' || ans.answer_text === 'true')

                  if (isHigh && (bRegion || qText)) {
                    let catName: HazardCategoryName = 'Physical'
                    if (qText.toLowerCase().includes('chair') || qText.toLowerCase().includes('desk')) catName = 'Mechanical'
                    if (qText.toLowerCase().includes('break') || qText.toLowerCase().includes('hours')) catName = 'Negative/Passive'

                    const resp = responses.find((r: any) => r.id === ans.response_id)
                    const memberId = resp ? assignmentMemberMap.get(resp.assignment_id) : undefined
                    const deptName = memberId ? memberDeptNameMap.get(String(memberId)) : undefined

                    campaignChecklistItems.push({
                      id: `ans_${ans.id}`,
                      category: catName,
                      item: `Reported Discomfort: ${bRegion || qText.substring(0, 45)}`,
                      status: 'non-compliant',
                      notes: `Employee reported score: ${num || 'High'} in assessment survey.`,
                      riskLevel: (num >= 7 ? 'critical' : num >= 5 ? 'high' : 'medium'),
                      lastChecked: new Date().toLocaleDateString(),
                      isAiGenerated: true,
                      departmentName: deptName
                    })
                  }
                })
              }
            }
          }
        }
      }

      // Deduplicate by item title to avoid repetitive lines
      const seen = new Set<string>()
      const uniqueCampaignItems = campaignChecklistItems.filter(item => {
        const key = `${item.category}_${item.item}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      setChecklist([...standardChecklistItems, ...uniqueCampaignItems])
    } catch (err) {
      console.error('Failed to compile checklist data:', err)
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
        .maybeSingle()

      if (!member) return
      const organizationId = member.organization_id
      setOrgId(organizationId)

      // Fetch campaigns sorted by creation date descending
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id, title, status, created_at')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
      
      const allCampaigns: any[] = campaigns || []
      setCampaignsList(allCampaigns)
      
      // Determine default campaign:
      // 1. activeAssessment.id if available
      // 2. first ACTIVE campaign
      // 3. most recent campaign
      let initialCampaignId: string | null = null
      if (activeAssessment?.id && allCampaigns.some((c: any) => c.id === activeAssessment.id)) {
        initialCampaignId = activeAssessment.id
      } else {
        const activeCamp = allCampaigns.find((c: any) => c.status === 'ACTIVE')
        initialCampaignId = activeCamp ? activeCamp.id : (allCampaigns.length > 0 ? allCampaigns[0].id : null)
      }

      setSelectedCampaignId(initialCampaignId)
      await loadChecklistData(organizationId, initialCampaignId)
    } catch (err) {
      console.error('Failed to run initial checklist load:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitial()
  }, [])

  // Sync when activeAssessment changes
  useEffect(() => {
    if (activeAssessment?.id && orgId && activeAssessment.id !== selectedCampaignId) {
      setSelectedCampaignId(activeAssessment.id)
      loadChecklistData(orgId, activeAssessment.id)
    }
  }, [activeAssessment?.id])

  async function handleCampaignChange(campaignId: string) {
    if (!orgId) return
    setLoading(true)
    setSelectedCampaignId(campaignId)
    await loadChecklistData(orgId, campaignId)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  const selectedCampaign = campaignsList.find(c => c.id === selectedCampaignId)

  const criticalCount = checklist.filter((i) => i.riskLevel === 'critical').length
  const nonCompliantCount = checklist.filter((i) => i.status === 'non-compliant').length
  const compliantCount = checklist.filter((i) => i.status === 'compliant').length

  const filtered = filterCategory === 'All' ? checklist : checklist.filter((i) => i.category === filterCategory)

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const items = filtered.filter((i) => i.category === cat)
      if (items.length > 0) acc[cat] = items
      return acc
    },
    {} as Record<HazardCategoryName, any[]>,
  )

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header with Campaign Selector */}
      <div className="flex items-start justify-between font-sans flex-wrap gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground font-sora">
              {isAr ? 'قائمة التحقق من المخاطر وسلامة المواقع' : 'Facility & Site Hazard Checklist'}
            </h1>
            {selectedCampaign && (
              <span className={cn(
                'text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border',
                selectedCampaign.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-muted text-muted-foreground border-border'
              )}>
                {selectedCampaign.status === 'ACTIVE' ? (isAr ? 'حملة نشطة' : 'Active Campaign') : (isAr ? 'حملة مكتملة' : 'Completed')}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isAr
              ? 'متابعة وتدقيق حالة المخاطر الأرغونومية والمادية المكتشفة من نتائج حملات التقييم والبلاغات الميدانية'
              : 'Dynamic safety & ergonomic audit status compiled from assessment surveys and site observations'}
          </p>
        </div>

        {/* Campaign Selector Dropdown & Quick Links */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {campaignsList.length > 0 && (
            <div className="flex items-center gap-2 bg-muted/60 border border-border px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                {isAr ? 'الحملة:' : 'Campaign:'}
              </span>
              <select
                value={selectedCampaignId || ''}
                onChange={(e) => handleCampaignChange(e.target.value)}
                className="text-xs bg-transparent border-0 text-foreground font-bold cursor-pointer outline-none focus:ring-0"
              >
                {campaignsList.map(c => (
                  <option key={c.id} value={c.id} className="bg-card text-foreground">
                    {c.title} {c.status === 'ACTIVE' ? '🟢 (Active)' : '🔵 (Completed)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link
            href="/org/recommendations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand/10 hover:bg-brand/20 text-brand text-xs font-semibold transition-all border border-brand/20"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {isAr ? 'التوصيات المقترحة' : 'AI Recommendations'}
          </Link>

          <Link
            href="/org/observations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground text-xs font-semibold transition-all border border-border"
          >
            <Eye className="w-3.5 h-3.5" />
            {isAr ? 'الملاحظات' : 'Observations'}
          </Link>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap font-mono">
        {[
          { label: `${criticalCount} ${isAr ? 'حرج' : 'Critical'}`, cls: 'bg-danger/15 text-danger border-danger/20' },
          { label: `${nonCompliantCount} ${isAr ? 'غير متوافق' : 'Non-Compliant'}`, cls: 'bg-danger/10 text-danger/80 border-danger/15' },
          { label: `${checklist.filter(i => i.status === 'needs-review').length} ${isAr ? 'بحاجة لمراجعة' : 'Needs Review'}`, cls: 'bg-warning/10 text-warning border-warning/20' },
          { label: `${compliantCount} ${isAr ? 'متوافق' : 'Compliant'}`, cls: 'bg-success/10 text-success border-success/20' },
        ].map(({ label, cls }) => (
          <span key={label} className={cn('text-xs font-semibold px-3 py-1.5 rounded-full border', cls)}>
            {label}
          </span>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap font-sans">
        {(['All', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer',
              filterCategory === cat
                ? 'bg-brand text-brand-foreground shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted',
            )}
          >
            {cat === 'All' ? (isAr ? 'الكل' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Checklist sections */}
      <div className="space-y-3">
        {checklist.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10 font-sans">
            <Layers className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">
              {isAr ? 'لم يتم العثور على مخاطر مسجلة لهذه الحملة' : 'No hazards detected or reported yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isAr
                ? 'ستظهر هنا المخاطر ونقاط الإجهاد تلقائياً بمجرد إكمال الموظفين لاستبيانات التقييم.'
                : 'Complete an ergonomic assessment campaign or submit a hazard observation to populate this checklist.'}
            </p>
          </div>
        ) : (
          (Object.entries(grouped) as [HazardCategoryName, any[]][]).map(([cat, items]) => (
            <CategorySection key={cat} category={cat} items={items} isAr={isAr} />
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20 font-sans">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-warning font-semibold">{isAr ? 'تنبيه مهني:' : 'Professional sign-off required.'}</strong>{' '}
          {isAr
            ? 'المخاطر ذات التصنيف العالي والميكانيكية يجب مراجعتها وتأكيدها من قِبل مسؤول سلامة مؤهل. تدعم هذه القائمة التوثيق والتحسين المستمر.'
            : 'High-risk categories — Chemical, Mechanical, and Fire — should be reviewed or countersigned by a qualified safety professional. This checklist supports documentation; it does not certify regulatory compliance.'}
        </p>
      </div>
    </div>
  )
}
