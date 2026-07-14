'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Role, PersonalData, SubmittedForm, StandaloneNote, ActiveAssessment } from './mock-data'
import { mockSubmittedForms, mockStandaloneNotes } from './mock-data'

export type HRPage =
  | 'overview'
  | 'departments'
  | 'hazard-checklist'
  | 'observations'
  | 'recommendations'
  | 'reports'
  | 'settings'

// The employee space is a flow, not a sidebar nav:
export type EmployeeView =
  | 'home'         // past submissions + standalone note
  | 'onboarding'   // personal data form (first time only)
  | 'questionnaire'// one question at a time
  | 'review'       // all answers, inline edit, then submit

interface AppContextValue {
  role: Role | null
  setRole: (role: Role | null) => void

  // Active campaign
  activeAssessment: ActiveAssessment | null
  setActiveAssessment: (assessment: ActiveAssessment | null) => void

  // HR
  hrPage: HRPage
  setHRPage: (page: HRPage) => void

  // Employee flow
  employeeView: EmployeeView
  setEmployeeView: (view: EmployeeView) => void
  personalDataSubmitted: boolean
  setPersonalDataSubmitted: (v: boolean) => void
  personalData: PersonalData | null
  setPersonalData: (data: PersonalData) => void

  // Active questionnaire state
  questionAnswers: Record<string, string>
  setQuestionAnswers: (answers: Record<string, string>) => void
  questionNotes: Record<string, string>
  setQuestionNotes: (notes: Record<string, string>) => void

  // Submitted forms list
  submittedForms: SubmittedForm[]
  addSubmittedForm: (form: SubmittedForm) => void

  // Standalone notes
  standaloneNotes: StandaloneNote[]
  addStandaloneNote: (note: StandaloneNote) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [activeAssessment, setActiveAssessment] = useState<ActiveAssessment | null>(null)
  const [hrPage, setHRPage] = useState<HRPage>('overview')
  const [employeeView, setEmployeeView] = useState<EmployeeView>('home')
  const [personalDataSubmitted, setPersonalDataSubmitted] = useState(false)
  const [personalData, setPersonalData] = useState<PersonalData | null>(null)
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({})
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>({})
  const [submittedForms, setSubmittedForms] = useState<SubmittedForm[]>(mockSubmittedForms)
  const [standaloneNotes, setStandaloneNotes] = useState<StandaloneNote[]>(mockStandaloneNotes)

  function addSubmittedForm(form: SubmittedForm) {
    setSubmittedForms(prev => [form, ...prev])
  }

  function addStandaloneNote(note: StandaloneNote) {
    setStandaloneNotes(prev => [note, ...prev])
  }

  return (
    <AppContext.Provider
      value={{
        role, setRole,
        activeAssessment, setActiveAssessment,
        hrPage, setHRPage,
        employeeView, setEmployeeView,
        personalDataSubmitted, setPersonalDataSubmitted,
        personalData, setPersonalData,
        questionAnswers, setQuestionAnswers,
        questionNotes, setQuestionNotes,
        submittedForms, addSubmittedForm,
        standaloneNotes, addStandaloneNote,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
