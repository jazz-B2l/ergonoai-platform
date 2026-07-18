'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertCircle, MinusCircle, ChevronDown, ChevronUp, Info, Loader2, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

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

function CategorySection({ category, items }: { category: HazardCategoryName; items: any[] }) {
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
              Critical
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
                    <p className="text-sm text-foreground">{item.item}</p>
                    {item.isAiGenerated && (
                      <span className="flex items-center gap-1 text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded border border-brand/10 font-bold uppercase">
                        AI Detected
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {item.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">Last checked: {item.lastChecked}</p>
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
  const [filterCategory, setFilterCategory] = useState<HazardCategoryName | 'All'>('All')
  const [checklist, setChecklist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Campaigns list
  const [campaignsList, setCampaignsList] = useState<any[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)

  async function seedHazardsIfEmpty(organizationId: string) {
    // 1. Fetch categories
    const { data: existingCats } = await supabase
      .from('hazard_categories')
      .select('id, name')
      .eq('organization_id', organizationId)

    let finalCatMap = new Map<string, string>()

    if (!existingCats || existingCats.length === 0) {
      // Create categories
      const categoriesToInsert = CATEGORIES.map(cat => ({
        organization_id: organizationId,
        name: cat,
        description: categoryDescriptions[cat]
      }))

      const { data: insertedCats } = await supabase
        .from('hazard_categories')
        .insert(categoriesToInsert)
        .select()

      if (!insertedCats || insertedCats.length === 0) return
      finalCatMap = new Map(insertedCats.map(c => [c.name, c.id]))
    } else {
      finalCatMap = new Map(existingCats.map(c => [c.name, c.id]))
    }

    // 2. Check if hazards exist for these categories
    const categoryIds = Array.from(finalCatMap.values())
    const { data: existingHazards } = await supabase
      .from('hazards')
      .select('id')
      .in('category_id', categoryIds)
      .limit(1)

    if (existingHazards && existingHazards.length > 0) return

    // Seed hazards
    const hazardsToInsert = [
      { category_id: finalCatMap.get('Physical'), name: 'Inadequate office lighting or display screen glare', default_risk_level: 'MEDIUM' },
      { category_id: finalCatMap.get('Physical'), name: 'Uncomfortable ambient temperature or strong drafts', default_risk_level: 'LOW' },
      { category_id: finalCatMap.get('Physical'), name: 'Excessive machinery/background noise levels', default_risk_level: 'LOW' },
      
      { category_id: finalCatMap.get('Mechanical'), name: 'Workspace seating lacking lumbar or armrest adjustability', default_risk_level: 'HIGH' },
      { category_id: finalCatMap.get('Mechanical'), name: 'Fixed-height desks causing wrist flexion or neck lean', default_risk_level: 'MEDIUM' },
      
      { category_id: finalCatMap.get('Fire'), name: 'Obstructed emergency exits or evacuation walkways', default_risk_level: 'CRITICAL' },
      { category_id: finalCatMap.get('Fire'), name: 'Missing or expired hand fire extinguishers', default_risk_level: 'HIGH' },
      
      { category_id: finalCatMap.get('Negative/Passive'), name: 'Unmarked first-aid kit or depleted emergency supplies', default_risk_level: 'MEDIUM' },
      { category_id: finalCatMap.get('Negative/Passive'), name: 'Cables trailing across walkways causing slip/trip hazard', default_risk_level: 'HIGH' },
    ].filter(h => h.category_id !== undefined)

    await supabase.from('hazards').insert(hazardsToInsert)
  }

  async function loadChecklistData(organizationId: string, campaignId: string | null) {
    try {
      // Ensure base hazards are seeded
      await seedHazardsIfEmpty(organizationId)

      // 1. Fetch categories
      const { data: categories } = await supabase
        .from('hazard_categories')
        .select('id, name')
        .eq('organization_id', organizationId)

      const catIdToName = new Map((categories || []).map(c => [c.id, c.name]))

      // 2. Fetch standard hazards
      const { data: hazards } = await supabase
        .from('hazards')
        .select('*')
        .in('category_id', (categories || []).map(c => c.id))

      // 3. Fetch open observations (independent of campaign)
      const { data: occurrences } = await supabase
        .from('hazard_occurrences')
        .select('*')
        .eq('organization_id', organizationId)

      const activeOccurrencesMap = new Map<string, any>()
      if (occurrences) {
        occurrences.forEach(o => {
          if (o.status !== 'RESOLVED') {
            activeOccurrencesMap.set(o.hazard_id, o)
          }
        })
      }

      const standardChecklistItems = (hazards || []).map(h => {
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

      // 4. Fetch AI Findings specifically for the selected campaign
      let aiChecklistItems: any[] = []
      if (campaignId) {
        // Fetch assignments
        const { data: assignments } = await supabase
          .from('assessment_assignments')
          .select('id')
          .eq('campaign_id', campaignId)

        if (assignments && assignments.length > 0) {
          // Fetch completed responses
          const { data: responses } = await supabase
            .from('assessment_responses')
            .select('id')
            .in('assignment_id', assignments.map(a => a.id))

          if (responses && responses.length > 0) {
            // Fetch analyses
            const { data: analyses } = await supabase
              .from('assessment_ai_analysis')
              .select('id')
              .in('response_id', responses.map(r => r.id))

            if (analyses && analyses.length > 0) {
              // Fetch findings
              const { data: findings } = await supabase
                .from('assessment_ai_findings')
                .select('*')
                .in('analysis_id', analyses.map(a => a.id))

              if (findings) {
                aiChecklistItems = findings.map(f => {
                  let catName: HazardCategoryName = 'Physical'
                  const checkCat = f.category || ''
                  if (checkCat.includes('Mech') || checkCat.includes('Seat') || checkCat.includes('Chair')) catName = 'Mechanical'
                  else if (checkCat.includes('Chem')) catName = 'Chemical'
                  else if (checkCat.includes('Bio')) catName = 'Biological'
                  else if (checkCat.includes('Fire')) catName = 'Fire'
                  else if (checkCat.includes('Pass') || checkCat.includes('Break')) catName = 'Negative/Passive'

                  return {
                    id: f.id,
                    category: catName,
                    item: f.finding,
                    status: 'non-compliant',
                    notes: `AI Risk Index: ${f.score || 'N/A'}/100. Target body zone: ${f.body_part || 'General'}.`,
                    riskLevel: (f.severity || 'medium').toLowerCase(),
                    lastChecked: new Date(f.created_at).toLocaleDateString(),
                    isAiGenerated: true
                  }
                })
              }
            }
          }
        }
      }

      setChecklist([...standardChecklistItems, ...aiChecklistItems])
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

      // Fetch campaigns
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id, title')
        .eq('organization_id', organizationId)
      
      setCampaignsList(campaigns || [])
      
      const activeCampaignId = campaigns && campaigns.length > 0 ? campaigns[0].id : null
      setSelectedCampaignId(activeCampaignId)

      await loadChecklistData(organizationId, activeCampaignId)
    } catch (err) {
      console.error('Failed to run initial checklist load:', err)
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
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <div className="flex items-start justify-between font-sans flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Facility & Site Hazard Checklist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dynamic Safety Audit status compiled from active reported occurrences
          </p>
        </div>

        {/* Campaign Selector Dropdown */}
        {campaignsList.length > 0 && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Assessment Campaign</span>
            <select
              value={selectedCampaignId || ''}
              onChange={(e) => handleCampaignChange(e.target.value)}
              className="text-xs bg-muted border border-border rounded-lg px-3 py-2 text-foreground cursor-pointer outline-none focus:ring-1 focus:ring-brand font-sans font-medium"
            >
              {campaignsList.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap font-mono">
        {[
          { label: `${criticalCount} Critical`, cls: 'bg-danger/15 text-danger border-danger/20' },
          { label: `${nonCompliantCount} Non-Compliant`, cls: 'bg-danger/10 text-danger/80 border-danger/15' },
          { label: `${checklist.filter(i => i.status === 'needs-review').length} Needs Review`, cls: 'bg-warning/10 text-warning border-warning/20' },
          { label: `${compliantCount} Compliant`, cls: 'bg-success/10 text-success border-success/20' },
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
                ? 'bg-brand text-brand-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist sections */}
      <div className="space-y-3">
        {checklist.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10 font-sans">
            <p className="text-sm text-muted-foreground">Initializing safety audit checklist entries...</p>
          </div>
        ) : (
          (Object.entries(grouped) as [HazardCategoryName, any[]][]).map(([cat, items]) => (
            <CategorySection key={cat} category={cat} items={items} />
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20 font-sans">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-warning font-semibold">Professional sign-off required.</strong> High-risk categories — Chemical, Mechanical, and Fire — should be reviewed or countersigned by a qualified safety professional. This checklist supports documentation; it does not certify regulatory compliance.
        </p>
      </div>
    </div>
  )
}
