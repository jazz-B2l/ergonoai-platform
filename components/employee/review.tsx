'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Pencil, Check, X, StickyNote, Send, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { Question, SubmittedForm } from '@/lib/types'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'



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
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Rating:</span>
            <div className={`px-2.5 py-0.5 rounded-full border text-xs font-bold transition-all ${
              parseInt(draft || '5', 10) <= 4 ? 'text-destructive bg-destructive/10 border-destructive/20' :
              parseInt(draft || '5', 10) <= 7 ? 'text-warning bg-warning/10 border-warning/20' :
              'text-success bg-success/10 border-success/20'
            }`}>
              {draft || '5'}
            </div>
          </div>
          <input
            type="range"
            min={question.scaleMin ?? 1}
            max={question.scaleMax ?? 10}
            value={draft || '5'}
            onChange={e => setDraft(e.target.value)}
            className="w-full h-2 rounded-lg cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #22c55e 100%)`,
              accentColor: parseInt(draft || '5', 10) <= 4 ? '#ef4444' : parseInt(draft || '5', 10) <= 7 ? '#f59e0b' : '#22c55e'
            }}
          />
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

function groupQuestions(allQuestions: Question[]): Section[] {
  const nmqSummary: Question[] = []
  const nmqDetail: Question[] = []
  const iso: Question[] = []
  for (const q of allQuestions) {
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
            neck: 'Neck',
            shoulders: 'Shoulders',
            upper_back: 'Upper Back',
            elbows: 'Elbows',
            wrists_hands: 'Wrists / Hands',
            lower_back: 'Lower Back',
            hips_thighs: 'Hips / Thighs',
            knees: 'Knees',
            ankles_feet: 'Ankles / Feet',
          }

          const mapped: Question[] = questionsData.map(q => {
            const code = q.question_code || ''
            let section: 'NMQ_summary' | 'NMQ_detail' | 'ISO7730' = 'ISO7730'
            if (code.startsWith('nmq_sum')) section = 'NMQ_summary'
            else if (code.startsWith('nmq_det')) section = 'NMQ_detail'

            let scaleMin, scaleMax, scaleLowLabel, scaleHighLabel
            if (q.question_type === 'scale') {
              scaleMin = 1
              scaleMax = 5
              if (code === 'iso_1') {
                scaleLowLabel = 'Very poor'
                scaleHighLabel = 'Excellent'
              } else if (code === 'iso_39') {
                scaleLowLabel = 'Very dissatisfied'
                scaleHighLabel = 'Very satisfied'
              }
            }

            const options = q.options && q.options.length > 0
              ? [...q.options]
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .map(o => ({
                    value: o.id,
                    label: o.option_text,
                    optionValue: o.option_value
                  }))
              : undefined

            return {
              id: q.id,
              section,
              bodyRegion: bodyRegionMap[q.category || ''] || undefined,
              text: q.question_text,
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

  const [submitting, setSubmitting] = useState(false)

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

  const sections = groupQuestions(questions)

  function handleSave(questionId: string, answer: string, note: string) {
    setQuestionAnswers({ ...questionAnswers, [questionId]: answer })
    setQuestionNotes({ ...questionNotes, [questionId]: note })
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('No logged in user found during submit.')
        setSubmitting(false)
        return
      }

      // 1. Get active organization member row
      const { data: member } = await supabase
        .from('organization_members')
        .select('id')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (!member) {
        console.error('No active organization member row found.')
        setSubmitting(false)
        return
      }

      // 2. Find pending/in_progress assignment
      const { data: assignment } = await supabase
        .from('assessment_assignments')
        .select('id')
        .eq('member_id', member.id)
        .in('status', ['PENDING', 'IN_PROGRESS'])
        .limit(1)
        .maybeSingle()

      let finalAssignmentId = assignment?.id

      if (!finalAssignmentId) {
        // Look up active campaign to match dynamically
        let { data: activeCampaign } = await supabase
          .from('assessment_campaigns')
          .select('id')
          .eq('status', 'ACTIVE')
          .limit(1)
          .maybeSingle()

        // Auto-create active campaign if none exists
        if (!activeCampaign) {
          const { data: template } = await supabase
            .from('assessment_templates')
            .select('id')
            .limit(1)
            .maybeSingle()

          if (template) {
            const { data: memberOrg } = await supabase
              .from('organization_members')
              .select('organization_id')
              .eq('id', member.id)
              .single()

            if (memberOrg?.organization_id) {
              const { data: newCampaign, error: campCreateErr } = await supabase
                .from('assessment_campaigns')
                .insert({
                  organization_id: memberOrg.organization_id,
                  template_id: template.id,
                  title: 'Default Assessment Campaign',
                  status: 'ACTIVE'
                })
                .select('id')
                .maybeSingle()

              if (campCreateErr) {
                console.error('Error auto-creating default campaign:', campCreateErr)
              }
              activeCampaign = newCampaign
            }
          }
        }

        if (activeCampaign) {
          const { data: newAssignment, error: assignCreateErr } = await supabase
            .from('assessment_assignments')
            .insert({
              campaign_id: activeCampaign.id,
              member_id: member.id,
              status: 'IN_PROGRESS'
            })
            .select('id')
            .maybeSingle()

          if (assignCreateErr) {
            console.error('Error auto-creating assignment:', assignCreateErr)
          }
          finalAssignmentId = newAssignment?.id
        }
      }

      if (!finalAssignmentId) {
        console.error('Could not resolve an active assignment for submission.')
        setSubmitting(false)
        return
      }

      // 3. Create response record
      const { data: response, error: respErr } = await supabase
        .from('assessment_responses')
        .insert({
          assignment_id: finalAssignmentId,
          completion_percentage: 100,
          submitted_at: new Date().toISOString()
        })
        .select('id')
        .maybeSingle()

      if (respErr) throw respErr

      if (response) {
        // 4. Map and insert all answers
        const answersToInsert = []
        for (const q of questions) {
          const val = questionAnswers[q.id]
          if (val !== undefined && val.trim() !== '') {
            let selectedOptionId = null
            let numericAnswer = null
            let answerText = null

            if (q.answerType === 'scale') {
              numericAnswer = parseFloat(val)
              answerText = val
            } else if (q.answerType === 'radio') {
              if (q.options) {
                const selectedOpt = q.options.find(o => o.value === val)
                if (selectedOpt) {
                  selectedOptionId = selectedOpt.value // Option UUID
                  answerText = (selectedOpt as any).optionValue || selectedOpt.label
                }
              }
            } else {
              answerText = val
            }

            answersToInsert.push({
              response_id: response.id,
              question_id: q.id,
              selected_option_id: selectedOptionId,
              answer_text: answerText,
              numeric_answer: numericAnswer
            })
          }
        }

        if (answersToInsert.length > 0) {
          const { error: answersErr } = await supabase
            .from('response_answers')
            .insert(answersToInsert)

          if (answersErr) throw answersErr
        }

        // 5. Update assignment status to COMPLETED
        const { error: updateErr } = await supabase
          .from('assessment_assignments')
          .update({ status: 'COMPLETED' })
          .eq('id', finalAssignmentId)

        if (updateErr) throw updateErr
      }

      // Success legacy integration
      const form: SubmittedForm = {
        id: `form_${Date.now()}`,
        assessmentId: activeAssessment?.id,
        submittedAt: new Date().toISOString(),
        questionCount: questions.length,
        answeredCount: questions.filter(q => questionAnswers[q.id]?.trim()).length,
        sections: ['NMQ Summary', 'NMQ Detail', 'ISO 7730'],
        answers: { ...questionAnswers },
        notes: { ...questionNotes },
      }
      addSubmittedForm(form)
      resetAnswers({})
      resetNotes({})
      router.push('/employee')
    } catch (err) {
      console.error('Error during assessment submission:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const totalAnswered = questions.filter(q => questionAnswers[q.id]?.trim()).length

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
          <ThemeToggle />
          <span className="text-xs text-muted-foreground">
            {totalAnswered} / {questions.length} answered
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
          {sections.map(section => (
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
