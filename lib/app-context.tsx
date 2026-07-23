'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Role, PersonalData, SubmittedForm, StandaloneNote, ActiveAssessment } from './types'
import { mockSubmittedForms, mockStandaloneNotes } from './types'
import { supabase } from './supabase'

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

  loadingProfile: boolean

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

  // Theme support
  theme: 'light' | 'dark'
  toggleTheme: () => void

  // Language support
  language: 'en' | 'ar'
  setLanguage: (lang: 'en' | 'ar') => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [activeAssessment, setActiveAssessment] = useState<ActiveAssessment | null>(null)
  const [hrPage, setHRPage] = useState<HRPage>('overview')
  const [employeeView, setEmployeeView] = useState<EmployeeView>('home')
  const [personalDataSubmitted, setPersonalDataSubmitted] = useState(false)
  const [personalData, setPersonalData] = useState<PersonalData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    let active = true

    const loadedUserIdRef = { current: '' }

    const checkProfile = async (userId: string) => {
      try {
        loadedUserIdRef.current = userId
        const { data: member, error: memberError } = await supabase
          .from('organization_members')
          .select('id')
          .eq('profile_id', userId)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle()

        if (memberError) {
          console.error('Error checking organization_members in app-context:', memberError.message, memberError.details, memberError.code)
        }

        if (member && active) {
          const { data: empProfile, error: empProfileError } = await supabase
            .from('employee_profiles')
            .select('full_name, work_position, gender, date_of_birth, place_of_birth, marital_status, height_cm, weight_kg, years_in_role, working_hours_per_day, has_part_time_job')
            .eq('member_id', member.id)
            .maybeSingle()

          if (empProfileError) {
            console.error('Error checking employee_profiles in app-context:', empProfileError.message, empProfileError.details, empProfileError.code)
          }

          if (empProfile && active) {
            setPersonalData({
              fullName: empProfile.full_name || '',
              workPosition: empProfile.work_position || '',
              gender: empProfile.gender || '',
              dateOfBirth: empProfile.date_of_birth || '',
              placeOfBirth: empProfile.place_of_birth || '',
              maritalStatus: empProfile.marital_status || '',
              height: empProfile.height_cm ? String(empProfile.height_cm) : '',
              weight: empProfile.weight_kg ? String(empProfile.weight_kg) : '',
              yearsWorking: empProfile.years_in_role ? String(empProfile.years_in_role) : '',
              workingHoursPerDay: empProfile.working_hours_per_day ? String(empProfile.working_hours_per_day) : '',
              hasPartTimeJob: empProfile.has_part_time_job,
            })
            setPersonalDataSubmitted(true)
          }
        }
      } catch (err) {
        console.error('Error fetching employee profile in context:', err)
      } finally {
        if (active) {
          setLoadingProfile(false)
        }
      }
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await checkProfile(session.user.id)
        } else {
          setLoadingProfile(false)
        }
      } catch (err) {
        console.error('Error getting session on init:', err)
        setLoadingProfile(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        if (loadedUserIdRef.current !== session.user.id) {
          setLoadingProfile(true)
          await checkProfile(session.user.id)
        }
      } else if (event === 'SIGNED_OUT') {
        loadedUserIdRef.current = ''
        setPersonalData(null)
        setPersonalDataSubmitted(false)
        setLoadingProfile(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])
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

  // Theme support state and persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // Language support state and persistence
  const [language, setLanguageState] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute('lang', language)
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang)
  }

  return (
    <AppContext.Provider
      value={{
        role, setRole,
        loadingProfile,
        activeAssessment, setActiveAssessment,
        hrPage, setHRPage,
        employeeView, setEmployeeView,
        personalDataSubmitted, setPersonalDataSubmitted,
        personalData, setPersonalData,
        questionAnswers, setQuestionAnswers,
        questionNotes, setQuestionNotes,
        submittedForms, addSubmittedForm,
        standaloneNotes, addStandaloneNote,
        theme, toggleTheme,
        language, setLanguage,
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
