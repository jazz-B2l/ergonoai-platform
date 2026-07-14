'use client'

import { useState, useEffect } from 'react'
import {
  Brain,
  FileText,
  Plus,
  Eye,
  LogOut,
  Lock,
  StickyNote,
  X,
  Send,
  CheckCircle2,
  Clock,
  Hash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import type { SubmittedForm, StandaloneNote } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// ─── Form Card ────────────────────────────────────────────────────────────────

function FormCard({ form, onReview }: { form: SubmittedForm; onReview: () => void }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4 hover:border-brand/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-5 h-5 text-brand" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">Assessment Form</span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Submitted
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(form.submittedAt)} at {formatTime(form.submittedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {form.answeredCount} / {form.questionCount} questions
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {form.sections.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={onReview}
        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:border-brand/40 transition-colors"
      >
        <Eye className="w-3.5 h-3.5" />
        Review
      </button>
    </div>
  )
}

// ─── Standalone Note Modal ────────────────────────────────────────────────────

function NoteModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">Write a Note</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              This note will be sent to your HR team anonymously. Only your department will be visible — your identity will not.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/20 mb-4">
              <Lock className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-snug">
                Visible to HR as: <strong className="text-foreground">Anonymous · Engineering</strong>
              </p>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={5}
              placeholder="Write your note here... e.g. a concern, suggestion, or observation about your working conditions."
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1.5 text-right">{text.length} characters</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/90 text-white text-sm font-semibold hover:bg-amber-500 transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              Send Note
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Form Review Modal (read-only) ────────────────────────────────────────────

function ReviewModal({ form, onClose }: { form: SubmittedForm; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <span className="text-sm font-semibold text-foreground">Assessment Review</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submitted {formatDate(form.submittedAt)} at {formatTime(form.submittedAt)}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border mb-4">
            <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              This form has been submitted. Answers are read-only and cannot be edited.
            </p>
          </div>
          {Object.keys(form.answers).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              This is a historical mock form — detailed answers were not stored.
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(form.answers).map(([qId, answer]) => (
                <div key={qId} className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground font-mono">{qId}</span>
                  <span className="text-sm text-foreground text-right">{answer}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Home ────────────────────────────────────────────────────────────────

export function EmployeeHome() {
  const router = useRouter()
  const {
    setRole,
    activeAssessment,
    personalData,
    personalDataSubmitted,
    submittedForms,
    standaloneNotes,
    addStandaloneNote,
    questionAnswers,
    setQuestionAnswers,
    setQuestionNotes,
  } = useApp()

  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [reviewingForm, setReviewingForm] = useState<SubmittedForm | null>(null)

  // Redirect to profile if not submitted
  useEffect(() => {
    if (!personalDataSubmitted) {
      router.push('/employee/profile')
    }
  }, [personalDataSubmitted, router])

  function handleSubmitNote(text: string) {
    addStandaloneNote({
      id: `note_${Date.now()}`,
      text,
      department: 'Engineering',
      submittedAt: new Date().toISOString(),
    })
  }

  // Check if there's an active campaign not yet completed by the employee
  const pendingAssessment = activeAssessment && !submittedForms.some(f => f.assessmentId === activeAssessment.id)

  // Check if there's an in-progress session
  const hasInProgress = Object.keys(questionAnswers).length > 0

  function handleStartAssessment() {
    // If not in progress, clear previous answers
    if (!hasInProgress) {
      setQuestionAnswers({})
      setQuestionNotes({})
    }
    router.push('/employee/questionnaire')
  }

  const displayName = personalData?.fullName || "Mohamed Ali"
  const displayPosition = personalData?.workPosition ? `${personalData.workPosition} · HQ` : "Engineering · HQ Floor 3"
  const displayFirstName = displayName.split(' ')[0]
  const displayInitial = displayName.charAt(0).toUpperCase()

  return (
    <>
      {noteModalOpen && (
        <NoteModal onClose={() => setNoteModalOpen(false)} onSubmit={handleSubmitNote} />
      )}
      {reviewingForm && (
        <ReviewModal form={reviewingForm} onClose={() => setReviewingForm(null)} />
      )}

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-brand" />
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                ERGO<span className="text-brand">PSYC</span>.AI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-success/5 border border-success/20">
                <Lock className="w-3 h-3 text-success" />
                <span className="text-xs text-success font-medium">Private</span>
              </div>
              <Link href="/employee/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-xs font-semibold text-brand">
                  {displayInitial}
                </div>
                <span className="text-sm font-medium text-foreground">{displayName}</span>
              </Link>
              <button
                onClick={() => {
                  setRole(null)
                  router.push('/')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border hover:text-foreground hover:border-brand/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-10">
          {pendingAssessment ? (
            <div className="bg-card border border-brand/30 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center max-w-xl mx-auto my-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-brand animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Ergonomic Assessment Required</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                An active wellbeing and safety assessment campaign has been launched by your HR Manager:
                <strong className="block mt-2 text-foreground text-base">"{activeAssessment.title}"</strong>
              </p>
              
              <div className="w-full bg-muted/50 border border-border rounded-xl p-4 mb-8 text-left space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-foreground">Privacy Guaranteed:</strong> Individual answers are aggregated and kept completely anonymous.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-foreground">Required Step:</strong> Under company OSH guidelines, you must complete this assessment to access the feedback portal.
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartAssessment}
                className="w-full py-3.5 rounded-xl bg-brand text-brand-foreground font-semibold hover:bg-brand/90 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {hasInProgress ? 'Resume Assessment' : 'Start Assessment Now'} →
              </button>
            </div>
          ) : (
            <>
              {/* Welcome */}
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Welcome back, {displayFirstName}</h1>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {displayPosition}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setNoteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                  >
                    <StickyNote className="w-4 h-4" />
                    Write a note
                  </button>
                </div>
              </div>

              {/* Campaign notice if no campaign is active */}
              {!activeAssessment && (
                <div className="mb-8 p-4 rounded-xl bg-muted/40 border border-border text-center text-xs text-muted-foreground">
                  No active assessment campaigns currently required. We'll notify you here when the next cycle begins!
                </div>
              )}

              {/* Past Forms */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest text-muted-foreground">
                    Past Assessments
                  </h2>
                  <span className="text-xs text-muted-foreground">{submittedForms.length} total</span>
                </div>

                {submittedForms.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-10 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">No assessments yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start your first assessment above.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {submittedForms.map(form => (
                      <FormCard
                        key={form.id}
                        form={form}
                        onReview={() => setReviewingForm(form)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Standalone Notes */}
              {standaloneNotes.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                      Notes Sent
                    </h2>
                    <span className="text-xs text-muted-foreground">{standaloneNotes.length} total</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {standaloneNotes.map(note => (
                      <div key={note.id} className="bg-card border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                        <StickyNote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">{note.text}</p>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {formatDate(note.submittedAt)} at {formatTime(note.submittedAt)} · Sent anonymously
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}
