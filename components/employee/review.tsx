'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Pencil, Check, X, StickyNote, Send, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { buildFullQuestionList } from '@/lib/mock-data'
import type { Question, SubmittedForm } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const QUESTIONS = buildFullQuestionList()

// ─── Inline edit widget ───────────────────────────────────────────────────────

function InlineEdit({ question, value, note, onSave }: {
  question: Question
  value: string
  note: string
  onSave: (answer: string, note: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [draftNote, setDraftNote] = useState(note)

  function open() { setDraft(value); setDraftNote(note); setEditing(true) }
  function cancel() { setEditing(false) }
  function save() { onSave(draft, draftNote); setEditing(false) }

  function displayValue(q: Question, v: string): string {
    if (!v) return '—'
    if (q.answerType === 'radio' && q.options) {
      return q.options.find(o => o.value === v)?.label ?? v
    }
    return v
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className={cn('text-sm', value ? 'text-foreground font-medium' : 'text-muted-foreground italic')}>
            {displayValue(question, value)}
          </span>
          {note && (
            <div className="flex items-start gap-1.5 mt-1">
              <StickyNote className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
              <span className="text-xs text-muted-foreground leading-relaxed">{note}</span>
            </div>
          )}
        </div>
        <button
          onClick={open}
          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground border border-border hover:text-foreground hover:border-brand/40 transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Answer input */}
      {question.answerType === 'yesno' && (
        <div className="flex gap-2">
          {(['Yes', 'No'] as const).map(opt => (
            <button key={opt} type="button" onClick={() => setDraft(opt)}
              className={cn('flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                draft === opt ? 'bg-brand text-brand-foreground border-brand' : 'bg-input border-border text-muted-foreground hover:border-brand/40'
              )}>{opt}</button>
          ))}
        </div>
      )}
      {question.answerType === 'radio' && question.options && (
        <div className="flex flex-col gap-1.5">
          {question.options.map(opt => (
            <button key={opt.value} type="button" onClick={() => setDraft(opt.value)}
              className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors text-left',
                draft === opt.value ? 'bg-brand/10 border-brand text-foreground' : 'bg-input border-border text-muted-foreground hover:border-brand/40'
              )}>
              <div className={cn('w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center',
                draft === opt.value ? 'border-brand bg-brand' : 'border-muted-foreground/40'
              )}>
                {draft === opt.value && <div className="w-1 h-1 rounded-full bg-brand-foreground" />}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {question.answerType === 'scale' && (
        <div className="flex gap-1.5">
          {Array.from({ length: (question.scaleMax ?? 5) - (question.scaleMin ?? 1) + 1 }, (_, i) => i + (question.scaleMin ?? 1)).map(tick => (
            <button key={tick} type="button" onClick={() => setDraft(String(tick))}
              className={cn('flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                draft === String(tick) ? 'bg-brand text-brand-foreground border-brand' : 'bg-input border-border text-muted-foreground hover:border-brand/40'
              )}>{tick}</button>
          ))}
        </div>
      )}
      {question.answerType === 'text' && (
        <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3}
          className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none" />
      )}

      {/* Note */}
      <textarea
        value={draftNote}
        onChange={e => setDraftNote(e.target.value)}
        rows={2}
        placeholder="Note (optional)..."
        className="w-full px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
      />

      <div className="flex items-center justify-end gap-2">
        <button onClick={cancel} className="flex items-center gap-1 px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-3 h-3" /> Cancel
        </button>
        <button onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors">
          <Check className="w-3 h-3" /> Save
        </button>
      </div>
    </div>
  )
}

// ─── Group questions by section ───────────────────────────────────────────────

type Section = {
  label: string
  key: string
  questions: Question[]
}

function groupQuestions(): Section[] {
  const nmqSummary: Question[] = []
  const nmqDetail: Question[] = []
  const iso: Question[] = []
  for (const q of QUESTIONS) {
    if (q.section === 'NMQ_summary') nmqSummary.push(q)
    else if (q.section === 'NMQ_detail') nmqDetail.push(q)
    else iso.push(q)
  }
  return [
    { label: 'NMQ — Summary Questions', key: 'nmq_sum', questions: nmqSummary },
    { label: 'NMQ — Detailed Questions', key: 'nmq_det', questions: nmqDetail },
    { label: 'ISO 7730 — Thermal Comfort', key: 'iso', questions: iso },
  ]
}

const SECTIONS = groupQuestions()

// ─── Main review ──────────────────────────────────────────────────────────────

export function EmployeeReview() {
  const router = useRouter()
  const {
    activeAssessment,
    personalDataSubmitted,
    loadingProfile,
    questionAnswers, setQuestionAnswers,
    questionNotes, setQuestionNotes,
    addSubmittedForm,
    setQuestionAnswers: resetAnswers,
    setQuestionNotes: resetNotes,
  } = useApp()

  // Redirect to profile if not submitted
  useEffect(() => {
    if (!loadingProfile && !personalDataSubmitted) {
      router.push('/employee/profile')
    }
  }, [loadingProfile, personalDataSubmitted, router])

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  const [submitting, setSubmitting] = useState(false)

  function handleSave(questionId: string, answer: string, note: string) {
    setQuestionAnswers({ ...questionAnswers, [questionId]: answer })
    setQuestionNotes({ ...questionNotes, [questionId]: note })
  }

  function handleSubmit() {
    setSubmitting(true)
    const form: SubmittedForm = {
      id: `form_${Date.now()}`,
      assessmentId: activeAssessment?.id,
      submittedAt: new Date().toISOString(),
      questionCount: QUESTIONS.length,
      answeredCount: QUESTIONS.filter(q => questionAnswers[q.id]?.trim()).length,
      sections: ['NMQ Summary', 'NMQ Detail', 'ISO 7730'],
      answers: { ...questionAnswers },
      notes: { ...questionNotes },
    }
    addSubmittedForm(form)
    // Reset active questionnaire state
    resetAnswers({})
    resetNotes({})
    setTimeout(() => {
      setSubmitting(false)
      router.push('/employee')
    }, 400)
  }

  const totalAnswered = QUESTIONS.filter(q => questionAnswers[q.id]?.trim()).length

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/employee/questionnaire')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Questions
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {totalAnswered} / {QUESTIONS.length} answered
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-success text-white text-sm font-semibold hover:bg-success/90 transition-colors disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
        </div>
      </header>

      <div className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Review your answers</h1>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Check your responses below. You can edit any answer inline before submitting. Once submitted, answers cannot be changed.
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map(section => (
            <div key={section.key} className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                {section.label}
              </h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                {section.questions.map((q, idx) => (
                  <div key={q.id} className="px-5 py-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="shrink-0 text-xs font-mono text-muted-foreground/60 mt-0.5 w-5 text-right">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap mb-2">
                          {q.bodyRegion && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 font-medium shrink-0">
                              {q.bodyRegion}
                            </span>
                          )}
                          <p className="text-sm text-foreground leading-snug">{q.text}</p>
                        </div>
                        <InlineEdit
                          question={q}
                          value={questionAnswers[q.id] ?? ''}
                          note={questionNotes[q.id] ?? ''}
                          onSave={(a, n) => handleSave(q.id, a, n)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom submit */}
          <div className="flex justify-end py-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-success text-white text-sm font-semibold hover:bg-success/90 transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
