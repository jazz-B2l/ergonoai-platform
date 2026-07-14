'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Users, BarChart3, Plus, X } from 'lucide-react'
import { departments, departmentScores } from '@/lib/mock-data'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

export function HRDepartments() {
  const [selected, setSelected] = useState<string | null>(null)

  const dept = departments.find((d) => d.id === selected) ?? null

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Departments & Sites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {departments.length} spaces · Aggregated data only (anonymization enforced)
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Space
        </button>
      </div>

      {/* Department cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map((d) => {
          const scoreColor =
            d.overallScore >= 7 ? 'text-success' : d.overallScore >= 5 ? 'text-warning' : 'text-danger'
          const barColor =
            d.overallScore >= 7 ? 'bg-success' : d.overallScore >= 5 ? 'bg-warning' : 'bg-danger'
          const aboveThreshold =
            d.headcount >= d.anonymizationThreshold && d.responseRate >= d.responseThreshold
          return (
            <button
              key={d.id}
              onClick={() => setSelected(selected === d.id ? null : d.id)}
              className={cn(
                'text-left p-5 rounded-xl border bg-card transition-all duration-150',
                selected === d.id
                  ? 'border-brand/50 bg-brand/5'
                  : 'border-border hover:border-border/80 hover:bg-muted/30',
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{d.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.site}</p>
                </div>
                <span className={cn('text-xl font-bold tabular-nums', scoreColor)}>
                  {d.overallScore.toFixed(1)}
                </span>
              </div>

              {/* Bar */}
              <div className="h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
                <div
                  className={cn('h-full rounded-full', barColor)}
                  style={{ width: `${(d.overallScore / 10) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{d.headcount} employees</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{d.responseRate}% response</span>
                </div>
                <div className="flex items-center gap-1">
                  {d.trend >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-danger" />
                  )}
                  <span className={d.trend >= 0 ? 'text-success' : 'text-danger'}>
                    {d.trend >= 0 ? '+' : ''}{d.trend.toFixed(1)}
                  </span>
                </div>
              </div>

              {!aboveThreshold && (
                <p className="mt-3 text-xs text-warning bg-warning/10 rounded-lg px-2.5 py-1.5">
                  Below anonymization threshold — rolled up to company aggregate
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {dept && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">{dept.name} — Detailed View</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last assessment: {dept.lastAssessment} · Cadence: {dept.cadence}
              </p>
            </div>
            <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Radar */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Category Scores</h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={departmentScores}>
                  <PolarGrid stroke="oklch(1 0 0 / 8%)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: 'oklch(0.55 0.01 240)', fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="oklch(0.72 0.16 190)" fill="oklch(0.72 0.16 190)" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Benchmark" dataKey="benchmark" stroke="oklch(0.55 0.01 240)" fill="transparent" strokeWidth={1} strokeDasharray="3 3" />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart + settings */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={departmentScores} layout="vertical" margin={{ left: 60, right: 20 }}>
                    <XAxis type="number" domain={[0, 10]} tick={{ fill: 'oklch(0.55 0.01 240)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="category" tick={{ fill: 'oklch(0.96 0.005 240)', fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip contentStyle={{ background: 'oklch(0.18 0.01 240)', border: '1px solid oklch(1 0 0 / 10%)', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {departmentScores.map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={
                            entry.score >= 7
                              ? 'oklch(0.70 0.18 155)'
                              : entry.score >= 5
                              ? 'oklch(0.78 0.18 75)'
                              : 'oklch(0.64 0.22 25)'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Space settings */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Space Settings</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Anonymization threshold', value: `Min. ${dept.anonymizationThreshold} employees` },
                    { label: 'Response threshold', value: `Min. ${dept.responseThreshold}%` },
                    { label: 'Assessment cadence', value: dept.cadence.charAt(0).toUpperCase() + dept.cadence.slice(1) },
                    { label: 'Current response rate', value: `${dept.responseRate}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
