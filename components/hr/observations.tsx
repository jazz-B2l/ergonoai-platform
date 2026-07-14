'use client'

import { useState } from 'react'
import { Eye, EyeOff, MapPin, Calendar, User, ChevronDown } from 'lucide-react'
import { hazardObservations } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const riskConfig = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-brand/10 text-brand border-brand/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-danger/15 text-danger border-danger/20',
}

const statusConfig = {
  open: 'bg-danger/10 text-danger',
  'in-progress': 'bg-warning/10 text-warning',
  resolved: 'bg-success/10 text-success',
}

export function HRObservations() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all')

  const filtered =
    filter === 'all' ? hazardObservations : hazardObservations.filter((o) => o.status === filter)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Hazard Observations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Employee-submitted hazard & near-miss reports · Routed to HR and Safety Officer
        </p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: 'All', count: hazardObservations.length, value: 'all' },
          { label: 'Open', count: hazardObservations.filter(o => o.status === 'open').length, value: 'open' },
          { label: 'In Progress', count: hazardObservations.filter(o => o.status === 'in-progress').length, value: 'in-progress' },
          { label: 'Resolved', count: hazardObservations.filter(o => o.status === 'resolved').length, value: 'resolved' },
        ].map(({ label, count, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value as typeof filter)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === value ? 'bg-brand text-brand-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full', filter === value ? 'bg-brand-foreground/20' : 'bg-muted-foreground/20')}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Observation list */}
      <div className="space-y-3">
        {filtered.map((obs) => (
          <div
            key={obs.id}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <button
              className="w-full flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors text-left"
              onClick={() => setExpanded(expanded === obs.id ? null : obs.id)}
            >
              {/* Risk badge */}
              <span className={cn('shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border capitalize', riskConfig[obs.riskLevel])}>
                {obs.riskLevel}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">{obs.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {obs.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {obs.date}
                  </span>
                  <span className="flex items-center gap-1">
                    {obs.anonymous ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Anonymous
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3" />
                        {obs.reportedBy}
                      </>
                    )}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                    {obs.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium capitalize', statusConfig[obs.status])}>
                  {obs.status.replace('-', ' ')}
                </span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform',
                    expanded === obs.id && 'rotate-180',
                  )}
                />
              </div>
            </button>

            {expanded === obs.id && (
              <div className="px-4 pb-4 border-t border-border pt-3">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {obs.description}
                </p>
                <div className="flex items-center gap-3">
                  <select className="text-xs bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground">
                    <option value={obs.status}>Status: {obs.status.replace('-', ' ')}</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-brand text-brand-foreground hover:opacity-90 transition-opacity">
                    Assign to Safety Officer
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    Add to Checklist
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Eye className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No observations with this filter</p>
        </div>
      )}
    </div>
  )
}
