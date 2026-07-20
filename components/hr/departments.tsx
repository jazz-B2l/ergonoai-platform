'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Users, BarChart3, Plus, X, Loader2, Award, FileText, Check, Edit, Trash2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function HRDepartments() {
  const [deptsList, setDeptsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Edit State
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [chefDept, setChefDept] = useState('')
  const [employeeCount, setEmployeeCount] = useState(0)

  // Active Detail Panel
  const [selected, setSelected] = useState<string | null>(null)
  const selectedDept = deptsList.find((d) => d.id === selected) ?? null

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get organization ID
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!member) {
        setError('No organization associated with this account.')
        setLoading(false)
        return
      }

      setOrgId(member.organization_id)

      // Fetch departments
      const { data: depts, error: deptsError } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', member.organization_id)
        .order('created_at', { ascending: false })

      if (deptsError) throw deptsError

      // Fetch organization members with their assignments
      const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          id,
          department_id,
          assignments:assessment_assignments (
            id,
            status
          )
        `)
        .eq('organization_id', member.organization_id)
        .eq('is_active', true)

      if (membersError) throw membersError

      // Compute statistics per department
      const statsMap: Record<string, { completed: number; answering: number; notStarted: number }> = {}

      if (depts) {
        depts.forEach((d: any) => {
          statsMap[d.id] = { completed: 0, answering: 0, notStarted: 0 }
        })
      }

      if (members) {
        members.forEach((m: any) => {
          const deptId = m.department_id
          if (!deptId || !statsMap[deptId]) return

          const assignmentsList = m.assignments || []
          const activeAssignment = assignmentsList[0]
          const status = activeAssignment ? activeAssignment.status : 'PENDING'

          if (status === 'COMPLETED') {
            statsMap[deptId].completed++
          } else if (status === 'IN_PROGRESS') {
            statsMap[deptId].answering++
          } else {
            statsMap[deptId].notStarted++
          }
        })
      }

      // Map departments with statistics
      const deptsWithStats = (depts || []).map((d: any) => ({
        ...d,
        stats: statsMap[d.id] || { completed: 0, answering: 0, notStarted: 0 }
      }))

      setDeptsList(deptsWithStats)
    } catch (err: any) {
      console.error('Error fetching departments:', err)
      setError('Failed to load spaces.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleOpenCreate() {
    setEditingDeptId(null)
    setName('')
    setDescription('')
    setChefDept('')
    setEmployeeCount(0)
    setModalOpen(true)
  }

  function handleOpenEdit(d: any) {
    setEditingDeptId(d.id)
    setName(d.name)
    setDescription(d.description || '')
    setChefDept(d.chef_department || '')
    setEmployeeCount(d.employee_count || 0)
    setModalOpen(true)
  }

  async function handleDeleteSpace(id: string) {
    if (!confirm('Are you sure you want to delete this department? This will delete all associated data.')) return
    setError(null)
    setSuccess(null)

    try {
      const { error: deleteError } = await supabase
        .from('departments')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setSuccess('Department space deleted successfully.')
      if (selected === id) {
        setSelected(null)
      }
      await loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error deleting department:', err)
      setError('Failed to delete department.')
    }
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    if (!orgId || !name.trim()) return
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (editingDeptId) {
        // Edit Mode
        const { error: updateError } = await supabase
          .from('departments')
          .update({
            name: name.trim(),
            description: description.trim() || null,
            chef_department: chefDept.trim() || null,
            employee_count: employeeCount
          })
          .eq('id', editingDeptId)

        if (updateError) throw updateError
        setSuccess('Workspace department updated successfully!')
      } else {
        // Create Mode
        const { error: insertError } = await supabase
          .from('departments')
          .insert({
            organization_id: orgId,
            name: name.trim(),
            description: description.trim() || null,
            chef_department: chefDept.trim() || null,
            employee_count: employeeCount
          })

        if (insertError) throw insertError
        setSuccess('Workspace department created successfully!')
      }

      setName('')
      setDescription('')
      setChefDept('')
      setEmployeeCount(0)
      setEditingDeptId(null)
      setModalOpen(false)

      // Reload
      await loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error saving department:', err)
      const errorMsg = err.message || err.details || JSON.stringify(err)
      setError(`Failed to save workspace department: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
          <button 
            type="button" 
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <h3 className="text-lg font-bold text-foreground font-sora mb-2">
            {editingDeptId ? 'Edit Department Space' : 'Create New Department Space'}
          </h3>
          <p className="text-xs text-muted-foreground mb-6">
            {editingDeptId ? 'Modify settings for this workspace department.' : 'Add a department or workspace within your organization to catalog assessments.'}
          </p>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div>
              <label htmlFor="deptName" className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Department Name *</label>
              <input
                id="deptName"
                type="text"
                required
                placeholder="e.g. Logistics & Warehouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="chefDept" className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Chef de Département / Manager</label>
              <input
                id="chefDept"
                type="text"
                placeholder="e.g. Sidali Merabti"
                value={chefDept}
                onChange={(e) => setChefDept(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="empCount" className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Number of Employees</label>
              <input
                id="empCount"
                type="number"
                min="0"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 0)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="deptDesc" className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Description</label>
              <textarea
                id="deptDesc"
                rows={3}
                placeholder="Brief summary of operations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-border hover:bg-muted text-foreground text-sm font-semibold transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground text-sm font-semibold transition-all shadow cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingDeptId ? 'Save Changes' : 'Create Space'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-background text-foreground pb-20">
      
      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-600 font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> {success}
        </div>
      )}

      {deptsList.length === 0 ? (
        // Centered Empty State
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shadow-sm">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight font-sora text-foreground">No departments configured</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create your organization&apos;s first workspace space (e.g. Office HQ, Assembly Floor) to start tracking observations and surveys.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground text-sm font-semibold transition-all shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Department
          </button>
        </div>
      ) : (
        // Standard Dashboard view
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-sora">Departments & Spaces</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {deptsList.length} workspace spaces configured for health and hazard tracking.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-all shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Space
            </button>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deptsList.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelected(selected === d.id ? null : d.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(selected === d.id ? null : d.id)
                  }
                }}
                role="button"
                tabIndex={0}
                className={cn(
                  'text-left p-6 rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand',
                  selected === d.id
                    ? 'border-brand ring-1 ring-brand bg-brand/5'
                    : 'border-border hover:border-brand/40',
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground font-sora truncate">{d.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[220px]">{d.description || 'No description provided'}</p>
                  </div>
                  
                  {/* Edit/Delete mini actions */}
                  <div className="flex gap-1 ml-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEdit(d)
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 transition-all cursor-pointer"
                      title="Edit Department"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSpace(d.id)
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                      title="Delete Department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {(() => {
                  const stats = d.stats || { completed: 0, answering: 0, notStarted: 0 }
                  const registeredCount = stats.completed + stats.answering + stats.notStarted
                  const completionRate = registeredCount > 0 ? Math.round((stats.completed / registeredCount) * 100) : 0

                  return (
                    <div className="pt-4 border-t border-border flex flex-col space-y-3 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/70">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          {registeredCount} registered
                        </span>
                        <span>Chef: <strong className="text-foreground">{d.chef_department || 'Unassigned'}</strong></span>
                      </div>

                      {/* Progress Bar & Details */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <span>Survey Completion</span>
                          <span className="text-brand font-extrabold normal-case text-xs">{completionRate}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                          {registeredCount > 0 ? (
                            <>
                              <div 
                                className="bg-emerald-500 h-full transition-all duration-500" 
                                style={{ width: `${(stats.completed / registeredCount) * 100}%` }}
                                title={`${stats.completed} Completed`}
                              />
                              <div 
                                className="bg-amber-500 h-full transition-all duration-500" 
                                style={{ width: `${(stats.answering / registeredCount) * 100}%` }}
                                title={`${stats.answering} Answering`}
                              />
                              <div 
                                className="bg-border h-full transition-all duration-500" 
                                style={{ width: `${(stats.notStarted / registeredCount) * 100}%` }}
                                title={`${stats.notStarted} Not Started`}
                              />
                            </>
                          ) : (
                            <div className="bg-muted w-full h-full" />
                          )}
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                          <span className="text-emerald-500">{stats.completed} done</span>
                          <span className="text-amber-500">{stats.answering} answering</span>
                          <span>{stats.notStarted} left</span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedDept && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground font-sora">{selectedDept.name} — Workspace Overview</h2>
                  {(() => {
                    const stats = selectedDept.stats || { completed: 0, answering: 0, notStarted: 0 }
                    const registeredCount = stats.completed + stats.answering + stats.notStarted
                    return (
                      <p className="text-xs text-muted-foreground mt-1">
                        Managed by {selectedDept.chef_department || 'No Chef assigned'} · Registered headcount: {registeredCount}
                      </p>
                    )
                  })()}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedDept)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20 text-brand text-xs font-semibold hover:bg-brand/20 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSpace(selectedDept.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-semibold hover:bg-danger/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <div className="h-6 w-px bg-border mx-1" />
                  <button 
                    onClick={() => setSelected(null)} 
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Space Details</h3>
                    <div className="bg-muted/40 rounded-xl p-4 border border-border space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Description</span>
                        <p className="text-sm text-foreground mt-0.5">{selectedDept.description || 'No description'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Chef de Département</span>
                        <p className="text-sm text-foreground mt-0.5 font-medium">{selectedDept.chef_department || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Operational Statistics</h3>
                    {(() => {
                      const stats = selectedDept.stats || { completed: 0, answering: 0, notStarted: 0 }
                      const totalStaff = selectedDept.employee_count || (stats.completed + stats.answering + stats.notStarted)
                      const completionRate = totalStaff > 0 ? Math.round((stats.completed / totalStaff) * 100) : 0

                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-muted/40 rounded-xl p-4 border border-border text-center">
                              <Users className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
                              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Total Headcount</span>
                              <span className="text-base font-bold text-foreground block mt-0.5">{totalStaff}</span>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                              <Check className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                              <span className="text-[9px] uppercase font-bold text-emerald-500 block">Completed</span>
                              <span className="text-base font-bold text-emerald-500 block mt-0.5">{stats.completed}</span>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                              <Loader2 className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-1.5" />
                              <span className="text-[9px] uppercase font-bold text-amber-500 block">In Progress</span>
                              <span className="text-base font-bold text-amber-500 block mt-0.5">{stats.answering}</span>
                            </div>
                            <div className="bg-muted/40 border border-border rounded-xl p-4 text-center">
                              <Users className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
                              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Not Started</span>
                              <span className="text-base font-bold text-foreground block mt-0.5">{stats.notStarted}</span>
                            </div>
                          </div>

                          {/* Detail Progress Bar */}
                          <div className="bg-muted/40 rounded-xl p-5 border border-border space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold text-foreground">
                              <span>Global Campaign Response Progress</span>
                              <span className="text-brand text-sm font-extrabold">{completionRate}% Completion Rate</span>
                            </div>
                            <div className="h-3.5 bg-muted rounded-full overflow-hidden flex shadow-inner">
                              {totalStaff > 0 ? (
                                <>
                                  <div 
                                    className="bg-emerald-500 h-full transition-all duration-500" 
                                    style={{ width: `${(stats.completed / totalStaff) * 100}%` }}
                                    title={`${stats.completed} Completed`}
                                  />
                                  <div 
                                    className="bg-amber-500 h-full transition-all duration-500" 
                                    style={{ width: `${(stats.answering / totalStaff) * 100}%` }}
                                    title={`${stats.answering} Answering`}
                                  />
                                  <div 
                                    className="bg-border h-full transition-all duration-500" 
                                    style={{ width: `${(stats.notStarted / totalStaff) * 100}%` }}
                                    title={`${stats.notStarted} Not Started`}
                                  />
                                </>
                              ) : (
                                <div className="bg-muted w-full h-full" />
                              )}
                            </div>
                            <div className="flex justify-between text-[11px] text-muted-foreground font-medium pt-1">
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" /> {stats.completed} completed</span>
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" /> {stats.answering} answering</span>
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-border block" /> {stats.notStarted} left</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {modalOpen && renderModal()}
    </div>
  )
}
