'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, MinusCircle, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { hazardChecklist, type HazardCategory, type HazardItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const CATEGORIES: HazardCategory[] = [
  'Physical',
  'Chemical',
  'Mechanical',
  'Biological',
  'Fire',
  'Negative/Passive',
]

const categoryDescriptions: Record<HazardCategory, string> = {
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

function CategorySection({ category, items }: { category: HazardCategory; items: HazardItem[] }) {
  const [expanded, setExpanded] = useState(true)

  const counts = {
    compliant: items.filter((i) => i.status === 'compliant').length,
    nonCompliant: items.filter((i) => i.status === 'non-compliant').length,
    review: items.filter((i) => i.status === 'needs-review').length,
  }
  const hasCritical = items.some((i) => i.riskLevel === 'critical')

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 flex items-center gap-3">
          <h3 className="text-sm font-semibold text-foreground">{category}</h3>
          {hasCritical && (
            <span className="text-xs bg-danger/15 text-danger px-2 py-0.5 rounded-md font-medium">
              Critical
            </span>
          )}
          <p className="text-xs text-muted-foreground hidden md:block">{categoryDescriptions[category]}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-1 text-success"><CheckCircle2 className="w-3 h-3" />{counts.compliant}</span>
            <span className="flex items-center gap-1 text-danger"><XCircle className="w-3 h-3" />{counts.nonCompliant}</span>
            <span className="flex items-center gap-1 text-warning"><AlertCircle className="w-3 h-3" />{counts.review}</span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border divide-y divide-border">
          {items.map((item) => {
            const { icon: Icon, color, bg, label } = statusConfig[item.status]
            return (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                <div className={cn('mt-0.5 p-1 rounded-lg shrink-0', bg)}>
                  <Icon className={cn('w-3.5 h-3.5', color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.item}</p>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      {item.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">Last checked: {item.lastChecked}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('text-xs px-2 py-0.5 rounded-md font-medium', riskConfig[item.riskLevel])}>
                    {item.riskLevel}
                  </span>
                  <span className={cn('text-xs font-medium', color)}>{label}</span>
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
  const [filterCategory, setFilterCategory] = useState<HazardCategory | 'All'>('All')

  const allItems = hazardChecklist
  const criticalCount = allItems.filter((i) => i.riskLevel === 'critical').length
  const nonCompliantCount = allItems.filter((i) => i.status === 'non-compliant').length
  const compliantCount = allItems.filter((i) => i.status === 'compliant').length

  const filtered = filterCategory === 'All' ? allItems : allItems.filter((i) => i.category === filterCategory)

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const items = filtered.filter((i) => i.category === cat)
      if (items.length > 0) acc[cat] = items
      return acc
    },
    {} as Record<HazardCategory, HazardItem[]>,
  )

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Facility & Site Hazard Checklist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completed by Safety Officer · Factory Floor B + Warehouse A + HQ · April 2026
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Export PDF
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: `${criticalCount} Critical`, cls: 'bg-danger/15 text-danger border-danger/20' },
          { label: `${nonCompliantCount} Non-Compliant`, cls: 'bg-danger/10 text-danger/80 border-danger/15' },
          { label: `${allItems.filter(i => i.status === 'needs-review').length} Needs Review`, cls: 'bg-warning/10 text-warning border-warning/20' },
          { label: `${compliantCount} Compliant`, cls: 'bg-success/10 text-success border-success/20' },
        ].map(({ label, cls }) => (
          <span key={label} className={cn('text-xs font-medium px-3 py-1.5 rounded-full border', cls)}>
            {label}
          </span>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['All', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat as HazardCategory | 'All')}
            className={cn(
              'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
              filterCategory === cat
                ? 'bg-brand text-brand-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist sections */}
      <div className="space-y-3">
        {(Object.entries(grouped) as [HazardCategory, HazardItem[]][]).map(([cat, items]) => (
          <CategorySection key={cat} category={cat} items={items} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-warning">Professional sign-off required.</strong> High-risk categories — Chemical, Mechanical, and Fire — should be reviewed or countersigned by a qualified safety professional. This checklist supports documentation; it does not certify regulatory compliance.
        </p>
      </div>
    </div>
  )
}
