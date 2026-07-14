'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  StickyNote,
  X,
  Check,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { buildFullQuestionList } from '@/lib/mock-data'
import type { Question } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

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
  return (
    <div className="flex gap-2 mt-2">
      {(['Yes', 'No'] as const).map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all',
            value === opt
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

function ScaleWidget({ value, onChange, min = 1, max = 5, lowLabel, highLabel }: {
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  lowLabel?: string
  highLabel?: string
}) {
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => i + min)
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {ticks.map(tick => (
          <button
            key={tick}
            type="button"
            onClick={() => onChange(String(tick))}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all',
              value === String(tick)
                ? 'bg-brand text-brand-foreground border-brand shadow-sm'
                : 'bg-muted border-border text-muted-foreground hover:border-brand/50 hover:text-foreground'
            )}
          >
            {tick}
          </button>
        ))}
      </div>
      {(lowLabel || highLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">{lowLabel}</span>
          <span className="text-xs text-muted-foreground">{highLabel}</span>
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

// ─── Section label ────────────────────────────────────────────────────────────

function sectionLabel(q: Question): string {
  if (q.section === 'NMQ_summary') return 'NMQ — Summary'
  if (q.section === 'NMQ_detail') return 'NMQ — Detailed'
  return 'ISO 7730 — Thermal Comfort'
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

const ALL_QUESTIONS = buildFullQuestionList()
const PAGES = buildPages(ALL_QUESTIONS)
const TOTAL_PAGES = PAGES.length

export function EmployeeQuestionnaire() {
  const router = useRouter()
  const { questionAnswers, personalDataSubmitted } = useApp()

  // Redirect to profile if not submitted
  useEffect(() => {
    if (!personalDataSubmitted) {
      router.push('/employee/profile')
    }
  }, [personalDataSubmitted, router])

  const [pageIndex, setPageIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [animating, setAnimating] = useState(false)
  const [openNoteForPage, setOpenNoteForPage] = useState<number | null>(null)

  const currentPage = PAGES[pageIndex]
  const firstQuestion = currentPage[0]
  const progress = ((pageIndex + 1) / TOTAL_PAGES) * 100

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
    if (pageIndex < TOTAL_PAGES - 1) navigate('forward')
    else router.push('/employee/review')
  }

  function handleBack() {
    if (pageIndex > 0) navigate('backward')
    else router.push('/employee')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-card border-b border-border px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
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
                {sectionLabel(firstQuestion)}
              </span>
              <span className="text-xs text-muted-foreground">
                Page {pageIndex + 1} of {TOTAL_PAGES}
                {answeredOnPage < currentPage.length && (
                  <span className="ml-1.5 text-warning font-medium">
                    ({answeredOnPage}/{currentPage.length} answered)
                  </span>
                )}
              </span>
            </div>
          </div>
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Add note — per-page note for context, lives between nav buttons */}
            <button
              onClick={() => setOpenNoteForPage(prev => prev === pageIndex ? null : pageIndex)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors',
                openNoteForPage === pageIndex
                  ? 'bg-amber-50 border-amber-300/60 text-amber-700'
                  : 'bg-muted border-border text-muted-foreground hover:text-amber-700 hover:border-amber-300/60 hover:bg-amber-50'
              )}
            >
              <StickyNote className="w-3.5 h-3.5" />
              Add note
            </button>

            <button
              onClick={handleNext}
              disabled={animating}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40',
                pageIndex === TOTAL_PAGES - 1
                  ? 'bg-success text-white hover:bg-success/90'
                  : 'bg-brand text-brand-foreground hover:bg-brand/90'
              )}
            >
              {pageIndex === TOTAL_PAGES - 1 ? 'Review Answers' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page-level note panel (below nav) */}
          {openNoteForPage === pageIndex && (
            <div className="mt-3 bg-amber-50 border border-amber-300/60 rounded-xl p-4">
              <p className="text-xs text-amber-700 font-medium mb-2 flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Click any question&apos;s &quot;Add note&quot; link for a question-specific note
              </p>
              <div className="grid grid-cols-2 gap-2">
                {currentPage.map((q, i) => (
                  <div key={q.id} className="text-xs text-amber-800 bg-white/60 rounded-lg px-3 py-2 border border-amber-200">
                    <span className="font-semibold">Q{pageIndex * 4 + i + 1}:</span> {q.text.slice(0, 70)}{q.text.length > 70 ? '…' : ''}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setOpenNoteForPage(null)}
                className="mt-3 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
