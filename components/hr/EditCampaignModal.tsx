'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Edit3, Calendar, Building2, Check, AlertCircle } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

interface EditCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (updatedData: {
    id: string
    title: string
    status: string
    startDate: string | null
    endDate: string | null
    targetDepartments: string[]
  }) => Promise<void>
  campaign: any | null
  departments: Array<{ id: string; name: string }>
}

export function EditCampaignModal({
  isOpen,
  onClose,
  onSave,
  campaign,
  departments,
}: EditCampaignModalProps) {
  const { language } = useApp()
  const isAr = language === 'ar'

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [targetDepts, setTargetDepts] = useState<string[]>(['all'])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (campaign) {
      setTitle(campaign.title || '')
      setStatus(campaign.status || 'ACTIVE')
      setStartDate(campaign.startDate ? campaign.startDate.split('T')[0] : '')
      setEndDate(campaign.endDate ? campaign.endDate.split('T')[0] : '')
      const currentDepts = campaign.config?.targetDepartments || ['all']
      setTargetDepts(currentDepts)
      setError(null)
    }
  }, [campaign])

  if (!isOpen || !campaign) return null

  const handleDeptToggle = (deptId: string) => {
    if (deptId === 'all') {
      setTargetDepts(['all'])
      return
    }

    let updated = targetDepts.filter((d) => d !== 'all')
    if (updated.includes(deptId)) {
      updated = updated.filter((d) => d !== deptId)
      if (updated.length === 0) updated = ['all']
    } else {
      updated.push(deptId)
    }
    setTargetDepts(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError(isAr ? 'يرجى إدخال عنوان الحملة' : 'Please enter a campaign title')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await onSave({
        id: campaign.id,
        title: title.trim(),
        status,
        startDate: startDate || null,
        endDate: endDate || null,
        targetDepartments: targetDepts,
      })
      onClose()
    } catch (err: any) {
      console.error('Error saving campaign:', err)
      setError(err.message || (isAr ? 'فشل حفظ التعديلات' : 'Failed to save changes'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-sora">
                {isAr ? 'تعديل بيانات حملة التقييم' : 'Edit Assessment Campaign'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAr ? 'تحديث العنوان والتواريخ والأقسام المستهدفة' : 'Update title, schedule, and targeted scope'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {isAr ? 'عنوان حملة التقييم' : 'Campaign Title'} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? 'مثال: تقييم السلامة والأرغونوميا Q3' : 'e.g., Q3 Ergonomic Assessment'}
              className="w-full bg-muted/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-brand font-medium"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {isAr ? 'حالة الحملة' : 'Campaign Status'}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-muted/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-brand cursor-pointer"
            >
              <option value="ACTIVE">{isAr ? '🟢 نشط / جاري (Active)' : '🟢 Active / Running'}</option>
              <option value="COMPLETED">{isAr ? '🔵 مكتمل / منتهي (Completed)' : '🔵 Completed / Finished'}</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                {isAr ? 'تاريخ البدء' : 'Start Date'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                {isAr ? 'تاريخ الانتهاء' : 'End Date'}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* Target Departments */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              {isAr ? 'الأقسام المستهدفة' : 'Target Departments'}
            </label>

            <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2 max-h-40 overflow-y-auto">
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={targetDepts.includes('all')}
                  onChange={() => handleDeptToggle('all')}
                  className="rounded text-brand focus:ring-brand accent-teal-600"
                />
                <span className="font-semibold">{isAr ? 'جميع الأقسام' : 'All Departments'}</span>
              </label>

              {departments.map((dept) => {
                const isChecked = targetDepts.includes('all') || targetDepts.includes(dept.id)
                return (
                  <label
                    key={dept.id}
                    className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none pl-2"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={targetDepts.includes('all')}
                      onChange={() => handleDeptToggle(dept.id)}
                      className="rounded text-brand focus:ring-brand accent-teal-600 disabled:opacity-50"
                    />
                    <span>{dept.name}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isAr ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
