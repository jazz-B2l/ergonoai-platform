'use client'

import { useState } from 'react'
import { 
  X, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Send, 
  FileText, 
  Building2, 
  Calendar, 
  Bell, 
  UserCheck, 
  Lock,
  PauseCircle,
  GripVertical
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { AssessmentSectionId, AssessmentSectionOption, CampaignConfig } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AssessmentCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onLaunch: (campaignData: {
    title: string
    startDate?: string
    endDate?: string
    config: CampaignConfig
  }) => Promise<void>
  departments?: Array<{ id: string; name: string }>
}

const DEFAULT_SECTIONS: AssessmentSectionOption[] = [
  {
    id: 'NMQ_summary',
    title: 'Nordic Musculoskeletal (NMQ) Screening',
    description: 'High-level screening of 9 anatomical body regions (neck, shoulders, back, wrists, knees).',
    category: 'musculoskeletal',
    enabled: true
  },
  {
    id: 'NMQ_detail',
    title: 'NMQ Body Regions & Pain Severity',
    description: 'Detailed pain scale, duration, and work disruption per affected body region.',
    category: 'musculoskeletal',
    enabled: true
  },
  {
    id: 'ISO7730',
    title: 'ISO 7730 Thermal & Microclimate Ergonomics',
    description: 'Indoor temperature, airflow draft, humidity, lighting, and ambient noise levels.',
    category: 'environment',
    enabled: true
  },
  {
    id: 'workstation_setup',
    title: 'Workstation Chair & Display Setup',
    description: 'Monitor distance, desk height, lumbar support, keyboard/mouse alignment.',
    category: 'ergonomics',
    enabled: true
  },
  {
    id: 'psychosocial_habits',
    title: 'Work Breaks & Physical Strain Habits',
    description: 'Sedentary duration, micro-break intervals, repetitive strain, and daily stress factors.',
    category: 'habits',
    enabled: false
  }
]

const TEMPLATES = [
  {
    id: 'full_ergonomic_audit',
    name: 'Full Ergonomic & ISO 7730 Audit',
    description: 'Complete assessment including all 5 sections for official ISO/OSHA compliance.',
    sections: ['NMQ_summary', 'NMQ_detail', 'ISO7730', 'workstation_setup', 'psychosocial_habits'] as AssessmentSectionId[]
  },
  {
    id: 'nmq_musculoskeletal_quick',
    name: 'NMQ Musculoskeletal Quick Check',
    description: 'Focused survey for physical body strain and anatomical pain regions.',
    sections: ['NMQ_summary', 'NMQ_detail'] as AssessmentSectionId[]
  },
  {
    id: 'iso7730_thermal_only',
    name: 'ISO 7730 Thermal Comfort Survey',
    description: 'Environmental assessment focusing on climate, airflow, and indoor comfort.',
    sections: ['ISO7730', 'workstation_setup'] as AssessmentSectionId[]
  },
  {
    id: 'custom_config',
    name: 'Custom Manager Configuration',
    description: 'Tailor custom sections, order, and rules according to team requirements.',
    sections: ['NMQ_summary', 'ISO7730'] as AssessmentSectionId[]
  }
]

export function AssessmentCampaignModal({
  isOpen,
  onClose,
  onLaunch,
  departments = []
}: AssessmentCampaignModalProps) {
  const { language } = useApp()
  const isAr = language === 'ar'
  const t = translations[language].common

  const [activeTab, setActiveTab] = useState<'info' | 'sections' | 'rules' | 'review'>('info')
  const [title, setTitle] = useState('Q3 2026 Ergonomic & Safety Survey')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('full_ergonomic_audit')
  const [sections, setSections] = useState<AssessmentSectionOption[]>(DEFAULT_SECTIONS)
  
  // Rules Configuration State
  const [allowPause, setAllowPause] = useState(true)
  const [pauseDurationDays, setPauseDurationDays] = useState(7)
  const anonymousMode = true // Mandatory 100% anonymous submissions
  const [reminderFrequency, setReminderFrequency] = useState<'daily' | 'weekly' | 'none'>('weekly')
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['all'])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const tmpl = TEMPLATES.find(t => t.id === templateId)
    if (tmpl) {
      setSections(prev =>
        prev.map(sec => ({
          ...sec,
          enabled: tmpl.sections.includes(sec.id)
        }))
      )
    }
  }

  const toggleSection = (id: AssessmentSectionId) => {
    setSelectedTemplate('custom_config')
    setSections(prev =>
      prev.map(sec => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
    )
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    setSelectedTemplate('custom_config')
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    const updated = [...sections]
    const [movedItem] = updated.splice(index, 1)
    updated.splice(newIndex, 0, movedItem)
    setSections(updated)
  }

  const toggleDept = (deptId: string) => {
    if (deptId === 'all') {
      setSelectedDepts(['all'])
      return
    }
    const filtered = selectedDepts.filter(d => d !== 'all')
    if (filtered.includes(deptId)) {
      const next = filtered.filter(d => d !== deptId)
      setSelectedDepts(next.length === 0 ? ['all'] : next)
    } else {
      setSelectedDepts([...filtered, deptId])
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) return
    setIsSubmitting(true)
    try {
      const activeSecIds = sections.filter(s => s.enabled).map(s => s.id)
      const allSecOrders = sections.map(s => s.id)

      await onLaunch({
        title: title.trim(),
        startDate,
        endDate: endDate || undefined,
        config: {
          templateId: selectedTemplate,
          allowPause,
          pauseDurationDays,
          anonymousMode,
          reminderFrequency,
          targetDepartments: selectedDepts,
          sectionsOrder: allSecOrders,
          activeSections: activeSecIds
        }
      })
      onClose()
    } catch (err) {
      console.error('Failed to launch campaign:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora text-lg font-bold text-foreground">
                {isAr ? 'إعداد وإطلاق حملة تقييم بيئة العمل' : 'Launch New Assessment Campaign'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAr
                  ? 'تخصيص الأقسام، ترتيب الاستبيان، وقواعد حفظ الإجابات وتذكير الموظفين'
                  : 'Configure survey sections, section order, pause & resume rules, and anonymity settings.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-border bg-card px-6 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'info', label: isAr ? 'معلومات التقييم' : '1. Basic Info & Scope', icon: FileText },
            { id: 'sections', label: isAr ? 'الأقسام والترتيب' : '2. Template & Sections', icon: Layers },
            { id: 'rules', label: isAr ? 'قواعد الاستبيان' : '3. Behavior & Rules', icon: Clock },
            { id: 'review', label: isAr ? 'مراجعة وإطلاق' : '4. Review & Launch', icon: Send },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'border-brand text-brand bg-brand/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: BASIC INFO & SCOPE */}
          {activeTab === 'info' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {isAr ? 'عنوان حملة التقييم' : 'Assessment Campaign Title'} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: تقييم بيئة العمل للربع الثالث 2026' : 'e.g. Q3 2026 Ergonomic Assessment Cycle'}
                  className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    {isAr ? 'تاريخ البدء' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    {isAr ? 'الموعد النهائي (اختياري)' : 'Deadline (Optional)'}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 transition-all"
                  />
                </div>
              </div>

              {/* Department Target Scope */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand" />
                  {isAr ? 'الأقسام المستهدفة' : 'Target Departments'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleDept('all')}
                    className={cn(
                      'px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer',
                      selectedDepts.includes('all')
                        ? 'bg-brand/15 border-brand text-brand font-bold'
                        : 'bg-input border-border text-muted-foreground hover:border-brand/40'
                    )}
                  >
                    <span>{isAr ? 'جميع الأقسام' : 'All Departments'}</span>
                    {selectedDepts.includes('all') && <CheckCircle2 className="w-3.5 h-3.5 text-brand" />}
                  </button>
                  {departments.map(dept => {
                    const isSelected = selectedDepts.includes(dept.id)
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => toggleDept(dept.id)}
                        className={cn(
                          'px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer',
                          isSelected
                            ? 'bg-brand/15 border-brand text-brand font-bold'
                            : 'bg-input border-border text-muted-foreground hover:border-brand/40'
                        )}
                      >
                        <span className="truncate">{dept.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATE & SECTION SELECTION + ORDERING */}
          {activeTab === 'sections' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Base Template Selector */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  {isAr ? 'اختر النموذج الأساسي' : 'Select Preset Assessment Template'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATES.map(tmpl => (
                    <div
                      key={tmpl.id}
                      onClick={() => handleTemplateSelect(tmpl.id)}
                      className={cn(
                        'p-4 rounded-xl border text-left cursor-pointer transition-all relative',
                        selectedTemplate === tmpl.id
                          ? 'bg-brand/10 border-brand ring-1 ring-brand'
                          : 'bg-input border-border hover:border-brand/50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-xs text-foreground">{tmpl.name}</h4>
                        {selectedTemplate === tmpl.id && <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{tmpl.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Toggle & Ordering List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-foreground">
                    {isAr ? 'تخصيص الأقسام وترتيب العرض' : 'Configure & Order Survey Sections'}
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    {sections.filter(s => s.enabled).length} / {sections.length} {isAr ? 'مفعل' : 'Active'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className={cn(
                        'p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all',
                        sec.enabled ? 'bg-card border-border shadow-sm' : 'bg-muted/30 border-border/50 opacity-60'
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={sec.enabled}
                          onChange={() => toggleSection(sec.id)}
                          className="w-4 h-4 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground truncate">{sec.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-muted text-muted-foreground border border-border uppercase">
                              {sec.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">{sec.description}</p>
                        </div>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, 'up')}
                          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sections.length - 1}
                          onClick={() => moveSection(idx, 'down')}
                          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BEHAVIOR & RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Allow Pause & Resume Config */}
              <div className="p-4 rounded-xl border border-border bg-input/50 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <PauseCircle className="w-5 h-5 text-brand mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {isAr ? 'السماح بإيقاف الاستبيان مؤقتاً ومتابعة الإجابة لاحقاً' : 'Allow Employees to Pause & Resume'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {isAr
                          ? 'يمكن للموظف حفظ المسودة والعودة لإكمال التقييم في وقت آخر دون فقدان الإجابات.'
                          : 'Employees can save progress and complete the evaluation later without losing draft answers.'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowPause}
                    onChange={(e) => setAllowPause(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer mt-1"
                  />
                </div>

                {allowPause && (
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">
                      {isAr ? 'مدة صلاحية حفظ المسودة (بالأيام):' : 'Draft retention duration (days):'}
                    </span>
                    <select
                      value={pauseDurationDays}
                      onChange={(e) => setPauseDurationDays(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    >
                      <option value={1}>1 Day (24 Hours)</option>
                      <option value={3}>3 Days</option>
                      <option value={7}>7 Days (1 Week)</option>
                      <option value={14}>14 Days (2 Weeks)</option>
                      <option value={30}>30 Days</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Automated Reminders */}
              <div className="p-4 rounded-xl border border-border bg-input/50 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {isAr ? 'تكرار التذكير التلقائي' : 'Automated Reminder Frequency'}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {isAr
                        ? 'إرسال تنبيهات تلقائية للموظفين الذين لم يكملوا التقييم بعد.'
                        : 'Automatically remind employees with pending assessments.'}
                    </p>
                  </div>
                </div>
                <select
                  value={reminderFrequency}
                  onChange={(e) => setReminderFrequency(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="weekly">{isAr ? 'أسبوعياً' : 'Weekly'}</option>
                  <option value="daily">{isAr ? 'يومياً' : 'Daily'}</option>
                  <option value="none">{isAr ? 'بدون تذكير' : 'Disabled'}</option>
                </select>
              </div>

            </div>
          )}

          {/* TAB 4: REVIEW & LAUNCH */}
          {activeTab === 'review' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-brand/10 border border-brand/20 space-y-3">
                <h4 className="font-sora text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                  {isAr ? 'ملخص إعدادات حملة التقييم' : 'Campaign Configuration Summary'}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">{isAr ? 'عنوان الحملة:' : 'Campaign Title:'}</span>
                    <p className="font-semibold text-foreground">{title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isAr ? 'النموذج المختار:' : 'Selected Template:'}</span>
                    <p className="font-semibold text-foreground uppercase">{selectedTemplate.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isAr ? 'الأقسام المفعلة:' : 'Active Sections:'}</span>
                    <p className="font-semibold text-foreground">{sections.filter(s => s.enabled).length} Sections</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isAr ? 'إيقاف ومتابعة لاحقاً:' : 'Pause & Resume:'}</span>
                    <p className="font-semibold text-foreground">{allowPause ? `Enabled (${pauseDurationDays} Days)` : 'Disabled'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isAr ? 'خصوصية الإجابات:' : 'Privacy Protection:'}</span>
                    <p className="font-semibold text-foreground">100% Anonymous (Enforced)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isAr ? 'التذكيرات التلقائية:' : 'Reminders:'}</span>
                    <p className="font-semibold text-foreground uppercase">{reminderFrequency}</p>
                  </div>
                </div>
              </div>

              {/* Active Section Preview Order */}
              <div>
                <h5 className="text-xs font-semibold text-foreground mb-2">
                  {isAr ? 'ترتيب عرض الاستبيان للموظف' : 'Active Section Execution Flow'}
                </h5>
                <div className="space-y-2">
                  {sections.filter(s => s.enabled).map((sec, idx) => (
                    <div key={sec.id} className="p-2.5 rounded-lg border border-border bg-card flex items-center gap-3 text-xs font-medium text-foreground">
                      <span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{sec.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <div className="flex items-center gap-3">
            {activeTab !== 'info' && (
              <button
                type="button"
                onClick={() => {
                  const tabs: Array<'info' | 'sections' | 'rules' | 'review'> = ['info', 'sections', 'rules', 'review']
                  const idx = tabs.indexOf(activeTab)
                  if (idx > 0) setActiveTab(tabs[idx - 1])
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {isAr ? 'السابق' : 'Previous'}
              </button>
            )}

            {activeTab !== 'review' ? (
              <button
                type="button"
                onClick={() => {
                  const tabs: Array<'info' | 'sections' | 'rules' | 'review'> = ['info', 'sections', 'rules', 'review']
                  const idx = tabs.indexOf(activeTab)
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1])
                }}
                className="px-5 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-all cursor-pointer shadow-md shadow-brand/20"
              >
                {isAr ? 'التالي' : 'Next Step'}
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting || !title.trim()}
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all cursor-pointer shadow-lg shadow-brand/25 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? (isAr ? 'جاري الإطلاق...' : 'Launching...') : (isAr ? 'إطلاق الحملة الآن' : 'Launch Campaign')}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
