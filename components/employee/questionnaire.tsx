'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  StickyNote,
  X,
  Check,
  Loader2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import type { Question } from '@/lib/types'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'

// ─── Body region badge ────────────────────────────────────────────────────────

function RegionBadge({ region }: { region: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/20">
      {region}
    </span>
  )
}

// ─── Answer widgets ───────────────────────────────────────────────────────────

function YesNoWidget({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { language } = useApp()
  const opts = language === 'ar' ? ['نعم', 'لا'] : ['Yes', 'No']
  const values = ['Yes', 'No']
  return (
    <div className="flex gap-2 mt-2">
      {opts.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(values[i])}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all',
            value === values[i]
              ? 'bg-brand text-brand-foreground border-brand shadow-sm'
              : 'bg-muted border-border text-muted-foreground hover:border-brand/50 hover:text-foreground'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function RadioWidget({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm border transition-all text-left',
            value === opt.value
              ? 'bg-brand/10 border-brand text-foreground'
              : 'bg-muted border-border text-muted-foreground hover:border-brand/40 hover:text-foreground'
          )}
        >
          <div className={cn(
            'w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
            value === opt.value ? 'border-brand bg-brand' : 'border-muted-foreground/40'
          )}>
            {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function ScaleWidget({ value, onChange, min = 1, max = 10, lowLabel, highLabel }: {
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  lowLabel?: string
  highLabel?: string
}) {
  const currentVal = value ? parseInt(value, 10) : 5

  useEffect(() => {
    if (!value) {
      onChange('5')
    }
  }, [value, onChange])

  const getColor = (val: number) => {
    if (val <= 4) return 'text-destructive bg-destructive/10 border-destructive/20'
    if (val <= 7) return 'text-warning bg-warning/10 border-warning/20'
    return 'text-success bg-success/10 border-success/20'
  }

  const getSliderColor = (val: number) => {
    if (val <= 4) return '#ef4444' // red
    if (val <= 7) return '#f59e0b' // amber
    return '#22c55e' // green
  }

  return (
    <div className="mt-3 flex flex-col gap-4">
      {/* Value Indicator Bubble */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">Select rating (1-10):</span>
        <div className={`px-3 py-1 rounded-full border text-sm font-bold transition-all shadow-sm ${getColor(currentVal)}`}>
          {value || '5'}
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative flex items-center px-3 py-3.5 bg-muted/20 border border-border rounded-xl">
        <input
          type="range"
          min={min}
          max={max}
          value={currentVal}
          onChange={e => onChange(e.target.value)}
          className="w-full h-2 rounded-lg cursor-pointer appearance-none bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #22c55e 100%)`,
            accentColor: getSliderColor(currentVal)
          }}
        />
      </div>

      {/* Low & High Labels */}
      {(lowLabel || highLabel) && (
        <div className="flex justify-between px-1">
          <span className="text-xs text-muted-foreground font-medium">{lowLabel}</span>
          <span className="text-xs text-muted-foreground font-medium">{highLabel}</span>
        </div>
      )}
    </div>
  )
}

function TextWidget({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={3}
      placeholder="Type your answer here..."
      className="mt-2 w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors resize-none"
    />
  )
}

// ─── Note panel for a single question ────────────────────────────────────────

function NotePanel({
  questionId,
  onClose,
}: {
  questionId: string
  onClose: () => void
}) {
  const { questionNotes, setQuestionNotes } = useApp()
  const [localNote, setLocalNote] = useState(questionNotes[questionId] ?? '')

  useEffect(() => {
    setLocalNote(questionNotes[questionId] ?? '')
  }, [questionId, questionNotes])

  function save() {
    setQuestionNotes({ ...questionNotes, [questionId]: localNote })
    onClose()
  }

  return (
    <div className="mt-2 bg-amber-50 border border-amber-300/60 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5" />
          Note for this question
        </span>
        <button onClick={onClose} className="text-amber-500 hover:text-amber-700 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <textarea
        value={localNote}
        onChange={e => setLocalNote(e.target.value)}
        rows={2}
        placeholder="Add a private note..."
        className="w-full px-2.5 py-2 rounded-md bg-white border border-amber-300/60 text-xs text-foreground placeholder:text-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors resize-none"
      />
      <div className="flex justify-end gap-2 mt-1.5">
        <button
          onClick={onClose}
          className="px-2.5 py-1 rounded-md text-xs text-amber-600 hover:text-amber-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={save}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-400/40 text-xs font-medium text-amber-700 hover:bg-amber-500/25 transition-colors"
        >
          <Check className="w-3 h-3" />
          Save
        </button>
      </div>
    </div>
  )
}

// ─── Single question card ─────────────────────────────────────────────────────

function QuestionCard({ question, index }: { question: Question; index: number }) {
  const { questionAnswers, setQuestionAnswers, questionNotes } = useApp()
  const [noteOpen, setNoteOpen] = useState(false)

  const answer = questionAnswers[question.id] ?? ''
  const note = questionNotes[question.id] ?? ''
  const hasNote = note.trim().length > 0

  function setAnswer(val: string) {
    setQuestionAnswers({ ...questionAnswers, [question.id]: val })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      {/* Question header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Q{index + 1}
          </span>
          {question.bodyRegion && <RegionBadge region={question.bodyRegion} />}
        </div>
        {/* Note indicator when note exists and panel is closed */}
        {hasNote && !noteOpen && (
          <button
            onClick={() => setNoteOpen(true)}
            className="shrink-0 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-300/50 px-2 py-0.5 rounded-full hover:bg-amber-100 transition-colors"
          >
            <StickyNote className="w-3 h-3" />
            Note
          </button>
        )}
      </div>

      {/* Question text */}
      <p className="text-sm font-medium text-foreground leading-snug text-balance mb-3">
        {question.text}
      </p>

      {/* Answer widget */}
      {question.answerType === 'yesno' && (
        <YesNoWidget value={answer} onChange={setAnswer} />
      )}
      {question.answerType === 'radio' && question.options && (
        <RadioWidget value={answer} onChange={setAnswer} options={question.options} />
      )}
      {question.answerType === 'scale' && (
        <ScaleWidget
          value={answer}
          onChange={setAnswer}
          min={question.scaleMin}
          max={question.scaleMax}
          lowLabel={question.scaleLowLabel}
          highLabel={question.scaleHighLabel}
        />
      )}
      {question.answerType === 'text' && (
        <TextWidget value={answer} onChange={setAnswer} />
      )}

      {/* Saved note preview (collapsed) */}
      {hasNote && !noteOpen && (
        <div className="mt-3 flex items-start gap-1.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
          <StickyNote className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed line-clamp-1">{note}</p>
        </div>
      )}

      {/* Note panel */}
      {noteOpen && (
        <NotePanel questionId={question.id} onClose={() => setNoteOpen(false)} />
      )}

      {/* Add note button (when no note yet and panel closed) */}
      {!hasNote && !noteOpen && (
        <button
          onClick={() => setNoteOpen(true)}
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 transition-colors"
        >
          <StickyNote className="w-3.5 h-3.5" />
          Add note
        </button>
      )}
    </div>
  )
}

// ─── Question & Option Translators ──────────────────────────────────────────

function translateQuestionText(code: string, text: string, category: string, lang: 'en' | 'ar'): string {
  if (lang !== 'ar') return text;

  const bodyRegionMapAr: Record<string, string> = {
    neck: 'العنق',
    shoulders: 'الكتفين',
    upper_back: 'أعلى الظهر',
    'upper back': 'أعلى الظهر',
    elbows: 'المرفقين',
    wrists_hands: 'المعصمين / اليدين',
    'wrists / hands': 'المعصمين / اليدين',
    lower_back: 'أسفل الظهر',
    'lower back': 'أسفل الظهر',
    hips_thighs: 'الوركين / الفخذين',
    'hips / thighs': 'الوركين / الفخذين',
    knees: 'الركبتين',
    ankles_feet: 'الكاحلين / القدمين',
    'ankles / feet': 'الكاحلين / القدمين',
  };

  const region = bodyRegionMapAr[category.toLowerCase()] || category;

  if (code.startsWith('nmq_sum_')) {
    return `خلال الـ 12 شهراً الماضية، هل عانيت من أوجاع، آلام، أو انزعاج في ${region}؟`;
  }

  if (code.startsWith('nmq_det_1_')) return `هل سبق لك أن عانيت من أوجاع، آلام، أو انزعاج في ${region}؟`;
  if (code.startsWith('nmq_det_2_')) return `هل سبق لك أن أصبت في ${region} نتيجة حادث؟`;
  if (code.startsWith('nmq_det_3_')) return `هل اضطررت يوماً إلى تغيير وظيفتك أو مهام عملك بسبب مشاكل في ${region}؟`;
  if (code.startsWith('nmq_det_4_')) return `خلال الـ 12 شهراً الماضية، هل عانيت من مشاكل في ${region}؟`;
  if (code.startsWith('nmq_det_5_')) return `ما هي المدة الإجمالية التي عانيت فيها من مشاكل في ${region} خلال الـ 12 شهراً الماضية؟`;
  if (code.startsWith('nmq_det_6a_')) return `بسبب مشاكل في ${region} خلال الـ 12 شهراً الماضية، هل اضطررت إلى تقليل نشاط عملك أو أنشطتك المنزلية المعتادة؟`;
  if (code.startsWith('nmq_det_6b_')) return `بسبب مشاكل في ${region} خلال الـ 12 شهراً الماضية، هل اضطررت إلى تقليل أنشطتك الترفيهية؟`;
  if (code.startsWith('nmq_det_7_')) return `خلال الـ 12 شهراً الماضية، ما هي المدة التي منعتك فيها المشاكل في ${region} من أداء أنشطتك المعتادة (العمل أو المنزل)؟`;
  if (code.startsWith('nmq_det_8_')) return `خلال الـ 12 شهراً الماضية، هل استشرت طبيباً، معالجاً طبيعياً، أو أخصائي رعاية صحية آخر بسبب مشاكل في ${region}؟`;
  if (code.startsWith('nmq_det_9_')) return `هل عانيت من مشكلة في ${region} في أي وقت خلال الـ 7 أيام الماضية؟`;

  const isoMap: Record<string, string> = {
    iso_1: 'كيف تقيم الراحة الحرارية العامة في مكان عملك؟',
    iso_2: 'هل تشعر عادة بالراحة الحرارية أثناء العمل؟',
    iso_3: 'كم مرة تشعر بالحر الشديد أثناء عملك؟',
    iso_4: 'كم مرة تشعر بالبرد الشديد أثناء عملك؟',
    iso_5: 'هل تظل درجة الحرارة مريحة طوال فترة عملك؟',
    iso_6: 'هل تتغير درجة حرارة مكان العمل بشكل متكرر خلال اليوم؟',
    iso_7: 'كيف تشعر حالياً؟ (الإحساس الحراري)',
    iso_8: 'هل درجة حرارة الهواء مريحة لعملك؟',
    iso_9: 'هل مكان العمل عادة حار جداً؟',
    iso_10: 'هل مكان العمل عادة بارد جداً؟',
    iso_11: 'هل تغيرات درجة الحرارة تشتت انتباهك أثناء العمل؟',
    iso_12: 'هل تشعر بتيارات هوائية غير مرغوب فيها أثناء العمل؟',
    iso_13: 'هل الهواء المنبعث من المراوح أو مكيفات الهواء يسبب لك الإزعاج؟',
    iso_14: 'هل تشعر بالبرد بسبب حركة الهواء؟',
    iso_15: 'هل يصطدم تدفق الهواء بوجهك أو رقبتك بشكل متكرر؟',
    iso_16: 'هل يزعج تدفق الهواء تركيزك؟',
    iso_17: 'هل الهواء جاف جداً؟',
    iso_18: 'هل الهواء رطب جداً؟',
    iso_19: 'هل الرطوبة تسبب لك عدم الراحة؟',
    iso_20: 'هل تشعر بحرارة مفرطة من النوافذ؟',
    iso_21: 'هل تشعر بحرارة مفرطة من الآلات أو المعدات؟',
    iso_22: 'هل النوافذ أو الجدران الباردة تسبب لك عدم الراحة؟',
    iso_23: 'هل الأسقف أو الجدران الساخنة تسبب لك عدم الراحة؟',
    iso_24: 'هل قدماك أبرد من الجزء العلوي من جسمك؟',
    iso_25: 'هل رأسك أدفأ من قدميك؟',
    iso_26: 'هل تلاحظ فروقاً كبيرة في درجات الحرارة بين مستوى الأرض والرأس؟',
    iso_27: 'هل الأرضية باردة جداً؟',
    iso_28: 'هل الأرضية دافئة جداً؟',
    iso_29: 'هل تجعل درجة حرارة الأرضية الوقوف أو المشي غير مريح؟',
    iso_30: 'هل ملابس العمل المعتادة مناسبة لدرجة حرارة مكان العمل؟',
    iso_31: 'هل تحتاج إلى ملابس إضافية لأن مكان العمل بارد جداً؟',
    iso_32: 'هل تخلع بعض الملابس لأن مكان العمل حار جداً؟',
    iso_33: 'هل يجعلك نشاطك البدني تشعر بالحرارة المفرطة؟',
    iso_34: 'هل يتطلب عملك حركة متكررة تؤثر على راحتك الحرارية؟',
    iso_35: 'هل تتناسب درجة حرارة مكان العمل مع المجهود البدني المطلوب لوظيفتك؟',
    iso_36: 'هل البيئة الحرارية تقلل من تركيزك؟',
    iso_37: 'هل الانزعاج الحراري يقلل من إنتاجيتك؟',
    iso_38: 'هل احتجت يوماً إلى التوقف عن العمل بسبب الانزعاج الحراري؟',
    iso_39: 'بشكل عام، ما مدى رضاك عن البيئة الحرارية في مكان عملك؟',
    iso_40: 'ما هي التحسينات التي من شأنها تحسين راحتك الحرارية بشكل أفضل؟',
  };

  return isoMap[code] || text;
}

function translateOptionText(text: string, value: string, lang: 'en' | 'ar'): string {
  if (lang !== 'ar') return text;

  const optMap: Record<string, string> = {
    'Yes': 'نعم',
    'No': 'لا',
    '0 days': '0 يوم',
    '1–7 days': '1-7 أيام',
    '1-7 days': '1-7 أيام',
    '8–30 days': '8-30 يوم',
    '8-30 days': '8-30 يوم',
    'More than 30 days': 'أكثر من 30 يوم',
    'More than 30 days (not daily)': 'أكثر من 30 يوم (ليس يومياً)',
    'Every day (daily)': 'كل يوم (يومياً)',
    'Never': 'أبداً',
    'Rarely': 'نادراً',
    'Sometimes': 'أحياناً',
    'Often': 'غالباً',
    'Always': 'دائماً',
    'Very Cold (-3)': 'بارد جداً (-3)',
    'Cold (-2)': 'بارد (-2)',
    'Slightly Cool (-1)': 'مائل للبرودة (-1)',
    'Neutral (0)': 'معتدل (0)',
    'Slightly Warm (+1)': 'مائل للدفء (+1)',
    'Warm (+2)': 'دافئ (+2)',
    'Very Hot (+3)': 'حار جداً (-3)',
  };

  return optMap[text] || optMap[value] || text;
}

// ─── Section label ────────────────────────────────────────────────────────────

function sectionLabel(q: Question, lang: 'en' | 'ar'): string {
  if (q.section === 'NMQ_summary') return lang === 'ar' ? 'استبيان الشمال الأوروبي (NMQ) — ملخص' : 'NMQ — Summary'
  if (q.section === 'NMQ_detail') return lang === 'ar' ? 'استبيان الشمال الأوروبي (NMQ) — تفصيلي' : 'NMQ — Detailed'
  return lang === 'ar' ? 'معيار ISO 7730 — الراحة الحرارية' : 'ISO 7730 — Thermal Comfort'
}

// ─── Build pages of 4 ────────────────────────────────────────────────────────

function buildPages(questions: Question[]): Question[][] {
  const pages: Question[][] = []
  for (let i = 0; i < questions.length; i += 4) {
    pages.push(questions.slice(i, i + 4))
  }
  return pages
}

// ─── Main Questionnaire ───────────────────────────────────────────────────────

export function EmployeeQuestionnaire() {
  const router = useRouter()
  const { language, setLanguage, questionAnswers, personalDataSubmitted, loadingProfile } = useApp()
  const t = translations[language].employee
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: questionsData, error } = await supabase
          .from('assessment_questions')
          .select(`
            id,
            question_code,
            question_text,
            question_type,
            category,
            is_required,
            display_order,
            options:question_options (
              id,
              option_text,
              option_value,
              display_order
            )
          `)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching questions:', error.message, error.details, error.code)
          return
        }

        if (questionsData) {
          const bodyRegionMap: Record<string, string> = {
            neck: language === 'ar' ? 'العنق' : 'Neck',
            shoulders: language === 'ar' ? 'الكتفين' : 'Shoulders',
            upper_back: language === 'ar' ? 'أعلى الظهر' : 'Upper Back',
            elbows: language === 'ar' ? 'المرفقين' : 'Elbows',
            wrists_hands: language === 'ar' ? 'المعصمين / اليدين' : 'Wrists / Hands',
            lower_back: language === 'ar' ? 'أسفل الظهر' : 'Lower Back',
            hips_thighs: language === 'ar' ? 'الوركين / الفخذين' : 'Hips / Thighs',
            knees: language === 'ar' ? 'الركبتين' : 'Knees',
            ankles_feet: language === 'ar' ? 'الكاحلين / القدمين' : 'Ankles / Feet',
          }

          const mapped: Question[] = questionsData.map((q: any) => {
            const code = q.question_code || ''
            let section: 'NMQ_summary' | 'NMQ_detail' | 'ISO7730' = 'ISO7730'
            if (code.startsWith('nmq_sum')) section = 'NMQ_summary'
            else if (code.startsWith('nmq_det')) section = 'NMQ_detail'

            let scaleMin, scaleMax, scaleLowLabel, scaleHighLabel
            if (q.question_type === 'scale') {
              scaleMin = 1
              scaleMax = 5
              if (code === 'iso_1') {
                scaleLowLabel = language === 'ar' ? 'سيء جداً' : 'Very poor'
                scaleHighLabel = language === 'ar' ? 'ممتاز' : 'Excellent'
              } else if (code === 'iso_39') {
                scaleLowLabel = language === 'ar' ? 'غير راضٍ تماماً' : 'Very dissatisfied'
                scaleHighLabel = language === 'ar' ? 'راضٍ تماماً' : 'Very satisfied'
              }
            }

            const options = q.options && q.options.length > 0
              ? [...q.options]
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .map(o => ({
                    value: o.id,
                    label: translateOptionText(o.option_text, o.option_value || '', language),
                    optionValue: o.option_value
                  }))
              : undefined

            const displayQuestion = translateQuestionText(code, q.question_text, q.category || '', language)

            return {
              id: q.id,
              section,
              bodyRegion: (bodyRegionMap[q.category || ''] || undefined) as Question['bodyRegion'],
              text: displayQuestion,
              answerType: q.question_type as any,
              options,
              scaleMin,
              scaleMax,
              scaleLowLabel,
              scaleHighLabel,
            }
          })

          setQuestions(mapped)
        }
      } catch (err) {
        console.error('Unhandled error fetching questions:', err)
      } finally {
        setLoadingQuestions(false)
      }
    }

    fetchQuestions()
  }, [])

  // Redirect to profile if not submitted
  useEffect(() => {
    if (!loadingProfile && !personalDataSubmitted) {
      router.push('/employee/profile')
    }
  }, [loadingProfile, personalDataSubmitted, router])

  const [pageIndex, setPageIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [animating, setAnimating] = useState(false)
  const [openNoteForPage, setOpenNoteForPage] = useState<number | null>(null)

  if (loadingProfile || loadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">No questions found in the database.</p>
        </div>
      </div>
    )
  }

  const pages = buildPages(questions)
  const totalPages = pages.length
  const currentPage = pages[pageIndex] || []
  const firstQuestion = currentPage[0]
  const progress = totalPages > 0 ? ((pageIndex + 1) / totalPages) * 100 : 0

  // Count answered on current page
  const answeredOnPage = currentPage.filter(q => (questionAnswers[q.id] ?? '').trim() !== '').length

  function navigate(dir: 'forward' | 'backward') {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setOpenNoteForPage(null)
    setTimeout(() => {
      setPageIndex(prev => dir === 'forward' ? prev + 1 : prev - 1)
      setAnimating(false)
      // Scroll to top of questions
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 200)
  }

  function handleNext() {
    if (pageIndex < totalPages - 1) navigate('forward')
    else router.push('/employee/review')
  }

  function handleBack() {
    if (pageIndex > 0) navigate('backward')
    else router.push('/employee')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>

      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-card border-b border-border px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.back}
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">
                {sectionLabel(firstQuestion, language)}
              </span>
              <span className="text-xs text-muted-foreground">
                {t.page} {pageIndex + 1} {t.of} {totalPages}
                {answeredOnPage < currentPage.length && (
                  <span className="ml-1.5 text-warning font-medium">
                    ({answeredOnPage}/{currentPage.length} {t.answered})
                  </span>
                )}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors cursor-pointer text-foreground"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Question cards */}
      <div className="flex-1 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div
            className={cn(
              'grid grid-cols-2 grid-rows-2 gap-4 transition-all duration-200',
              animating && direction === 'forward' && 'opacity-0 translate-x-4',
              animating && direction === 'backward' && 'opacity-0 -translate-x-4',
              !animating && 'opacity-100 translate-x-0'
            )}
          >
            {currentPage.map((question, i) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={pageIndex * 4 + i}
              />
            ))}
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <button
              onClick={handleBack}
              disabled={animating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.previous}
            </button>

            {/* Add note — per-page note for context, lives between nav buttons */}
            <button
              onClick={() => setOpenNoteForPage(prev => prev === pageIndex ? null : pageIndex)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer',
                openNoteForPage === pageIndex
                  ? 'bg-amber-50 border-amber-300/60 text-amber-700'
                  : 'bg-muted border-border text-muted-foreground hover:text-amber-700 hover:border-amber-300/60 hover:bg-amber-50'
              )}
            >
              <StickyNote className="w-3.5 h-3.5" />
              {t.addNote}
            </button>

            <button
              onClick={handleNext}
              disabled={animating || answeredOnPage < currentPage.length}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer',
                pageIndex === totalPages - 1
                  ? 'bg-success text-white hover:bg-success/90'
                  : 'bg-brand text-brand-foreground hover:bg-brand/90'
              )}
            >
              {pageIndex === totalPages - 1 ? t.reviewAnswers : t.next}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page-level note panel (below nav) */}
          {openNoteForPage === pageIndex && (
            <div className="mt-3 bg-amber-50 border border-amber-300/60 rounded-xl p-4">
              <p className="text-xs text-amber-700 font-medium mb-2 flex items-center gap-1.5 font-sora">
                <StickyNote className="w-3.5 h-3.5" />
                {language === 'ar' ? 'انقر فوق رابط "إضافة ملاحظة" الخاص بكل سؤال للحصول على ملاحظة خاصة بالسؤال' : 'Click any question\'s "Add note" link for a question-specific note'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {currentPage.map((q, i) => (
                  <div key={q.id} className="text-xs text-amber-800 bg-white/60 rounded-lg px-3 py-2 border border-amber-200">
                    <span className="font-semibold">{language === 'ar' ? 'س' : 'Q'}{pageIndex * 4 + i + 1}:</span> {q.text.slice(0, 70)}{q.text.length > 70 ? '…' : ''}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setOpenNoteForPage(null)}
                className="mt-3 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                {t.close}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
