'use client'

import { FileText, Download, Clock, Shield, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const reports = [
  {
    id: 'r1',
    title: 'Wellbeing & Ergonomics Report',
    subtitle: 'Q1 2026 (Jan–Mar)',
    type: 'wellbeing',
    date: '2026-04-01',
    departments: 5,
    responseRate: '75%',
    status: 'ready',
    description:
      'Anonymized aggregated self-report scores for musculoskeletal comfort and environmental conditions, trend comparison vs Q4 2025, and ergonomic recommendations.',
  },
  {
    id: 'r2',
    title: 'OSH Compliance-Support Report',
    subtitle: 'Facility Checklist Audit — April 2026',
    type: 'osh',
    date: '2026-04-15',
    departments: 5,
    responseRate: 'N/A',
    status: 'ready',
    description:
      'Facility and site hazard checklist status organized by the 6 OSH hazard categories. Highlights open non-compliance items, high-risk flags, and recommended professional sign-off areas.',
  },
  {
    id: 'r3',
    title: 'Wellbeing & Ergonomics Report',
    subtitle: 'Q4 2025 (Oct–Dec)',
    type: 'wellbeing',
    date: '2026-01-05',
    departments: 5,
    responseRate: '68%',
    status: 'archived',
    description: 'Previous cycle report. Overall wellbeing score: 5.4/10. Comparison baseline for Q1 2026.',
  },
  {
    id: 'r4',
    title: 'OSH Compliance-Support Report',
    subtitle: 'Facility Checklist Audit — January 2026',
    type: 'osh',
    date: '2026-01-10',
    departments: 4,
    responseRate: 'N/A',
    status: 'archived',
    description: 'Previous OSH audit. 2 critical items resolved since this report.',
  },
]

export function HRReports() {
  const ready = reports.filter((r) => r.status === 'ready')
  const archived = reports.filter((r) => r.status === 'archived')

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Exportable PDF reports for HR, OSH Committee, and management review
        </p>
      </div>

      {/* Info banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Shield, label: 'OSH Compliance-Support', desc: 'Organized by hazard category. Supports committee documentation.' },
          { icon: TrendingUp, label: 'Wellbeing / Ergonomics', desc: 'Anonymized aggregate scores with cycle-over-cycle trend comparison.' },
          { icon: Clock, label: 'Quarterly Default Cadence', desc: 'Wellbeing reports auto-generate at end of each assessment cycle.' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ready reports */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Current Cycle</h2>
        {ready.map((report) => (
          <div key={report.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  report.type === 'wellbeing' ? 'bg-success/10' : 'bg-brand/10',
                )}>
                  <FileText className={cn('w-5 h-5', report.type === 'wellbeing' ? 'text-success' : 'text-brand')} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{report.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xl">{report.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Generated {report.date}</span>
                    <span>·</span>
                    <span>{report.departments} departments</span>
                    {report.responseRate !== 'N/A' && (
                      <>
                        <span>·</span>
                        <span>{report.responseRate} response rate</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 transition-opacity shrink-0">
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Archived */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Archived</h2>
        {archived.map((report) => (
          <div key={report.id} className="bg-card/50 rounded-xl border border-border p-5 opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{report.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{report.description}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors shrink-0">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
