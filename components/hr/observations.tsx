'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, MapPin, Calendar, User, ChevronDown, Loader2, Plus, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const riskConfig = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-brand/10 text-brand border-brand/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-danger/15 text-danger border-danger/20',
}

const statusConfig = {
  open: 'bg-danger/10 text-danger',
  investigating: 'bg-warning/10 text-warning',
  resolved: 'bg-success/10 text-success',
}

export function HRObservations() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all')
  const [observations, setObservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reporting, setReporting] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)

  async function fetchObservations() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get membership organization
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (!member) return
      const currentOrgId = member.organization_id
      setOrgId(currentOrgId)

      // 1. Fetch organization members to map names
      const { data: membersList } = await supabase
        .from('organization_members')
        .select('id, profiles!organization_members_profile_id_fkey(first_name, last_name)')
      
      const memberNameMap = new Map(
        (membersList || []).map(m => {
          const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles as any
          return [
            m.id,
            profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Staff Member'
          ]
        })
      )

      // 2. Fetch hazards & categories for this organization only
      const { data: categories } = await supabase
        .from('hazard_categories')
        .select('id')
        .eq('organization_id', currentOrgId)

      const categoryIds = (categories || []).map(c => c.id)

      const { data: hazards } = await supabase
        .from('hazards')
        .select('id, name, hazard_categories(name)')
        .in('category_id', categoryIds)

      const hazardNameMap = new Map((hazards || []).map(h => [h.id, h.name]))
      const hazardCatMap = new Map((hazards || []).map(h => {
        const cat = Array.isArray(h.hazard_categories) ? h.hazard_categories[0] : h.hazard_categories as any
        return [h.id, cat?.name || 'Safety']
      }))

      // 3. Fetch sites
      const { data: sites } = await supabase
        .from('sites')
        .select('id, name')
        .eq('organization_id', currentOrgId)

      const siteMap = new Map((sites || []).map(s => [s.id, s.name]))

      // 4. Fetch observations
      const { data: occurrences } = await supabase
        .from('hazard_occurrences')
        .select('*')
        .eq('organization_id', currentOrgId)
        .order('created_at', { ascending: false })

      if (occurrences) {
        const mapped = occurrences.map(o => ({
          id: o.id,
          title: hazardNameMap.get(o.hazard_id) || 'Unlisted Workstation Hazard',
          description: o.description || 'No description provided.',
          riskLevel: (o.severity || 'medium').toLowerCase(),
          status: (o.status || 'open').toLowerCase(),
          location: siteMap.get(o.site_id) || 'Main Office Floor',
          date: new Date(o.created_at).toLocaleDateString(),
          reportedBy: memberNameMap.get(o.reported_by) || 'Reported by Employee',
          anonymous: !o.reported_by || o.detected_by === 'AI',
          category: hazardCatMap.get(o.hazard_id) || 'General'
        }))
        setObservations(mapped)
      }
    } catch (err) {
      console.error('Failed to fetch observations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchObservations()
  }, [])

  async function updateStatus(obsId: string, newStatus: string) {
    try {
      const dbStatus = newStatus.toUpperCase()
      const { error } = await supabase
        .from('hazard_occurrences')
        .update({ status: dbStatus })
        .eq('id', obsId)

      if (error) throw error

      setObservations(prev =>
        prev.map(o => o.id === obsId ? { ...o, status: newStatus.toLowerCase() } : o)
      )
    } catch (err: any) {
      console.error('Failed to update occurrence status:', err.message || err)
    }
  }

  async function handleReportTestHazard() {
    if (!orgId) return
    setReporting(true)
    try {
      // 1. Fetch departments
      const { data: depts } = await supabase
        .from('departments')
        .select('id')
        .eq('organization_id', orgId)
        .limit(1)

      const deptId = depts && depts.length > 0 ? depts[0].id : null

      // 2. Fetch categories for this organization
      const { data: categories } = await supabase
        .from('hazard_categories')
        .select('id')
        .eq('organization_id', orgId)

      if (!categories || categories.length === 0) {
        alert('Please visit the "Hazard Checklist" page first to seed the standard safety categories and hazards!')
        setReporting(false)
        return
      }

      const categoryIds = categories.map(c => c.id)

      // 3. Fetch first seeded hazard for this organization
      const { data: hazards } = await supabase
        .from('hazards')
        .select('id')
        .in('category_id', categoryIds)
        .limit(1)

      if (!hazards || hazards.length === 0) {
        alert('Please visit the "Hazard Checklist" page first to seed the standard safety categories and hazards!')
        setReporting(false)
        return
      }

      const hazardId = hazards[0].id

      // 4. Insert mock hazard occurrence
      const { error } = await supabase
        .from('hazard_occurrences')
        .insert({
          organization_id: orgId,
          hazard_id: hazardId,
          department_id: deptId,
          detected_by: 'EMPLOYEE',
          status: 'OPEN',
          severity: 'HIGH',
          description: 'Heavy power cords and network cables are trailing directly across the main walkway, presenting an active slipping and tripping hazard for staff.'
        })

      if (error) throw error
      await fetchObservations()
    } catch (err) {
      console.error(err)
      alert('Failed to insert test hazard.')
    } finally {
      setReporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  const filtered = filter === 'all' ? observations : observations.filter((o) => o.status === filter)

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      <div className="flex items-center justify-between font-sans flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Hazard Observations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Employee-submitted near-miss reports & AI detected workplace anomalies
          </p>
        </div>
        <button
          onClick={handleReportTestHazard}
          disabled={reporting || !orgId}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {reporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Reporting...
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Report Test Hazard
            </>
          )}
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap font-sans">
        {[
          { label: 'All', count: observations.length, value: 'all' },
          { label: 'Open', count: observations.filter(o => o.status === 'open').length, value: 'open' },
          { label: 'In Progress', count: observations.filter(o => o.status === 'investigating').length, value: 'investigating' },
          { label: 'Resolved', count: observations.filter(o => o.status === 'resolved').length, value: 'resolved' },
        ].map(({ label, count, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value as typeof filter)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm',
              filter === value ? 'bg-brand text-brand-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-mono', filter === value ? 'bg-brand-foreground/20' : 'bg-muted-foreground/20')}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Observation list */}
      <div className="space-y-3 font-sans">
        {filtered.map((obs) => (
          <div
            key={obs.id}
            className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
          >
            <button
              className="w-full flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors text-left cursor-pointer"
              onClick={() => setExpanded(expanded === obs.id ? null : obs.id)}
            >
              {/* Risk badge */}
              <span className={cn('shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border capitalize font-mono', riskConfig[obs.riskLevel as 'low' | 'medium' | 'high' | 'critical'])}>
                {obs.riskLevel}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">{obs.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {obs.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {obs.date}
                  </span>
                  <span className="flex items-center gap-1">
                    {obs.anonymous ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Anonymous
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5" />
                        {obs.reportedBy}
                      </>
                    )}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-muted font-bold text-muted-foreground uppercase">
                    {obs.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={cn('text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider', statusConfig[obs.status as 'open' | 'investigating' | 'resolved'])}>
                  {obs.status === 'investigating' ? 'In Progress' : obs.status}
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
                  <select 
                    value={obs.status}
                    onChange={(e) => updateStatus(obs.id, e.target.value)}
                    className="text-xs bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground cursor-pointer outline-none focus:ring-1 focus:ring-brand font-semibold"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer font-medium">
                    Assign to Safety Officer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground font-sans border border-dashed border-border rounded-2xl bg-card/10 p-10 max-w-2xl mx-auto space-y-4">
          <Eye className="w-12 h-12 mx-auto text-muted-foreground/40 animate-pulse" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">No Reported Observations Found</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
              This page acts as a central repository for real-time safety reports. When employees encounter workplace anomalies, trip hazards, or near-misses, their submissions route here for HR and Safety Officer intervention.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleReportTestHazard}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand/10 border border-brand/20 text-brand text-xs font-semibold hover:bg-brand/15 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Sample Incident Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
