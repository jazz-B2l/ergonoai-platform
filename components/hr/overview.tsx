import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Activity,
  Lightbulb,
  ChevronRight,
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
  departments,
  companyWellbeingTrend,
  hazardObservations,
  aiRecommendations,
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
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

  const avgScore =
    departments.reduce((s, d) => s + d.overallScore, 0) / departments.length
  const criticalCount = hazardObservations.filter((o) => o.riskLevel === 'critical').length
  const openObservations = hazardObservations.filter((o) => o.status !== 'resolved').length
  const totalEmployees = departments.reduce((s, d) => s + d.headcount, 0)
  const avgResponseRate =
    departments.reduce((s, d) => s + d.responseRate, 0) / departments.length

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Company Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Last assessment cycle: April 2026 · 5 departments · {totalEmployees} employees
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
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
              >
                End Campaign
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors"
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
            sub: <span className="flex items-center gap-1 text-success text-xs"><TrendingUp className="w-3 h-3" />+0.4 vs last quarter</span>,
            icon: Activity,
            accent: 'brand',
          },
          {
            label: 'Avg. Response Rate',
            value: <div className="text-3xl font-bold text-foreground">{avgResponseRate.toFixed(0)}<span className="text-base font-normal text-muted-foreground">%</span></div>,
            sub: <span className="text-xs text-muted-foreground">{departments.filter(d => d.responseRate >= 60).length}/{departments.length} depts above threshold</span>,
            icon: Users,
            accent: 'success',
          },
          {
            label: 'Critical Hazards',
            value: <div className="text-3xl font-bold text-danger">{criticalCount}</div>,
            sub: <span className="text-xs text-muted-foreground">{openObservations} observations open</span>,
            icon: AlertTriangle,
            accent: 'danger',
          },
          {
            label: 'AI Recommendations',
            value: <div className="text-3xl font-bold text-warning">{aiRecommendations.length}</div>,
            sub: <span className="text-xs text-muted-foreground">{aiRecommendations.filter(r => r.priority === 'high').length} high priority</span>,
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
              <p className="text-xs text-muted-foreground">Company-wide · Last 7 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={companyWellbeingTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="month" tick={{ fill: 'oklch(0.55 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: 'oklch(0.55 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'oklch(0.18 0.01 240)', border: '1px solid oklch(1 0 0 / 10%)', borderRadius: 8, fontSize: 12, color: 'oklch(0.96 0.005 240)' }}
                cursor={{ stroke: 'oklch(1 0 0 / 10%)' }}
              />
              <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="musculoskeletal" name="Musculoskeletal" stroke="oklch(0.72 0.16 190)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="environment" name="Environment" stroke="oklch(0.70 0.18 155)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="overall" name="Overall" stroke="oklch(0.78 0.18 75)" strokeWidth={2} dot={{ fill: 'oklch(0.78 0.18 75)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department scores */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Departments</h2>
            <Link href="/hr/departments" className="text-xs text-brand hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {departments.map((dept) => {
              const color =
                dept.overallScore >= 7
                  ? 'text-success'
                  : dept.overallScore >= 5
                  ? 'text-warning'
                  : 'text-danger'
              const barColor =
                dept.overallScore >= 7
                  ? 'bg-success'
                  : dept.overallScore >= 5
                  ? 'bg-warning'
                  : 'bg-danger'
              return (
                <li key={dept.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-medium text-foreground">{dept.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{dept.site}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {dept.trend >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-danger" />
                      )}
                      <span className={cn('text-xs font-semibold tabular-nums', color)}>
                        {dept.overallScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', barColor)}
                      style={{ width: `${(dept.overallScore / 10) * 100}%` }}
                    />
                  </div>
                </li>
              )
            })}
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
        <div className="space-y-2">
          {hazardObservations.slice(0, 3).map((obs) => (
            <div key={obs.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
              <span className={cn(
                'shrink-0 mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md',
                obs.riskLevel === 'critical' && 'bg-danger/15 text-danger',
                obs.riskLevel === 'high' && 'bg-warning/15 text-warning',
                obs.riskLevel === 'medium' && 'bg-brand/15 text-brand',
                obs.riskLevel === 'low' && 'bg-success/15 text-success',
              )}>
                {obs.riskLevel}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{obs.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{obs.location} · {obs.date}</p>
              </div>
              <span className={cn(
                'shrink-0 text-xs px-2 py-0.5 rounded-full',
                obs.status === 'open' && 'bg-danger/10 text-danger',
                obs.status === 'in-progress' && 'bg-warning/10 text-warning',
                obs.status === 'resolved' && 'bg-success/10 text-success',
              )}>
                {obs.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Campaign Launcher Modal */}
      {modalOpen && (
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
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
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
                className="px-4 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors"
              >
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
