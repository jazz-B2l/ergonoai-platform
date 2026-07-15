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
      setDeptsList(depts || [])
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
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
          <button 
            type="button" 
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <h3 className="text-lg font-bold text-slate-900 font-sora mb-2">
            {editingDeptId ? 'Edit Department Space' : 'Create New Department Space'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {editingDeptId ? 'Modify settings for this workspace department.' : 'Add a department or workspace within your organization to catalog assessments.'}
          </p>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div>
              <label htmlFor="deptName" className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Department Name *</label>
              <input
                id="deptName"
                type="text"
                required
                placeholder="e.g. Logistics & Warehouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="chefDept" className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Chef de Département / Manager</label>
              <input
                id="chefDept"
                type="text"
                placeholder="e.g. Sidali Merabti"
                value={chefDept}
                onChange={(e) => setChefDept(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="empCount" className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Number of Employees</label>
              <input
                id="empCount"
                type="number"
                min="0"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="deptDesc" className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Description</label>
              <textarea
                id="deptDesc"
                rows={3}
                placeholder="Brief summary of operations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all shadow cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2"
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
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-slate-50 text-slate-900 pb-20">
      
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
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-sm">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight font-sora text-slate-900">No departments configured</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Create your organization's first workspace space (e.g. Office HQ, Assembly Floor) to start tracking observations and surveys.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all shadow cursor-pointer shadow-teal-600/10"
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sora">Departments & Spaces</h1>
              <p className="text-sm text-slate-500 mt-1">
                {deptsList.length} workspace spaces configured for health and hazard tracking.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-all shadow cursor-pointer"
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
                  'text-left p-6 rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500',
                  selected === d.id
                    ? 'border-teal-600 ring-1 ring-teal-600 bg-teal-50/10'
                    : 'border-slate-200 hover:border-slate-300',
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 font-sora truncate">{d.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-[220px]">{d.description || 'No description provided'}</p>
                  </div>
                  
                  {/* Edit/Delete mini actions */}
                  <div className="flex gap-1 ml-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEdit(d)
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all cursor-pointer"
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete Department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{d.employee_count} employees registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Chef: <strong className="text-slate-800">{d.chef_department || 'Unassigned'}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedDept && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-sora">{selectedDept.name} — Workspace Overview</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Managed by {selectedDept.chef_department || 'No Chef assigned'} · Registered headcount: {selectedDept.employee_count}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedDept)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSpace(selectedDept.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <div className="h-6 w-px bg-slate-200 mx-1" />
                  <button 
                    onClick={() => setSelected(null)} 
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">Space Details</h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Description</span>
                        <p className="text-sm text-slate-700 mt-0.5">{selectedDept.description || 'No description'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Chef de Département</span>
                        <p className="text-sm text-slate-700 mt-0.5 font-medium">{selectedDept.chef_department || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">Operational Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-center">
                        <Users className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Staff</span>
                        <span className="text-lg font-bold text-slate-900 block mt-1">{selectedDept.employee_count}</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-center">
                        <FileText className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessments</span>
                        <span className="text-lg font-bold text-slate-900 block mt-1">Pending</span>
                      </div>
                    </div>
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
