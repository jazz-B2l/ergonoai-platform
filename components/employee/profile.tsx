'use client'

import { useState, useEffect } from 'react'
import { User, Briefcase, Calendar, MapPin, Heart, Ruler, Scale, Clock, ArrowRight, ChevronLeft, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import type { PersonalData } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const EMPTY: PersonalData = {
  fullName: '',
  workPosition: '',
  gender: '',
  dateOfBirth: '',
  placeOfBirth: '',
  maritalStatus: '',
  height: '',
  weight: '',
  yearsWorking: '',
  workingHoursPerDay: '',
  hasPartTimeJob: null,
}

function Field({ label, icon: Icon, error, children }: {
  label: string
  icon: React.ElementType
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
const selectCls = cn(inputCls, "cursor-pointer")

export function EmployeeProfile() {
  const router = useRouter()
  const { personalData, setPersonalData, personalDataSubmitted, setPersonalDataSubmitted, setRole } = useApp()
  const [data, setData] = useState<PersonalData>(personalData || EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})
  const [profileFirstName, setProfileFirstName] = useState<string>('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('user_id', user.id)
          .maybeSingle()

        if (profileError) {
          console.error('Error loading profiles row:', profileError.message, profileError.details, profileError.code)
        }

        if (profile) {
          const firstName = profile.first_name || ''
          const lastName = profile.last_name || ''
          setProfileFirstName(firstName)

          // Pre-fill Full Name only if not already set
          setData(prev => ({
            ...prev,
            fullName: prev.fullName || `${firstName} ${lastName}`.trim(),
          }))
        }

        // Also load saved employee_profiles data if it exists
        // Resolve member_id via organization_members
        const { data: member, error: memberError } = await supabase
          .from('organization_members')
          .select('id')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle()

        if (memberError) {
          console.error('Error loading organization_members row:', memberError.message, memberError.details, memberError.code)
        }

        if (member) {
          const { data: empProfile, error: empProfileError } = await supabase
            .from('employee_profiles')
            .select('full_name, work_position, gender, date_of_birth, place_of_birth, marital_status, height_cm, weight_kg, years_in_role, working_hours_per_day, has_part_time_job')
            .eq('member_id', member.id)
            .maybeSingle()

          if (empProfileError) {
            console.error('Error loading employee_profiles row:', empProfileError.message, empProfileError.details, empProfileError.code)
          }

          if (empProfile) {
            const dataToSet = {
              fullName: empProfile.full_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
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
            }
            setData(dataToSet)
            setPersonalData(dataToSet)
            setPersonalDataSubmitted(true)
          }
        }
      } catch (err) {
        console.error('Unhandled error in profile load:', err)
      }
    }
    loadProfile()
  }, [setPersonalData, setPersonalDataSubmitted])

  function set<K extends keyof PersonalData>(key: K, value: PersonalData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof PersonalData, string>> = {}
    if (!data.fullName.trim()) e.fullName = 'Required'
    if (!data.workPosition.trim()) e.workPosition = 'Required'
    if (!data.gender) e.gender = 'Required'
    if (!data.dateOfBirth) e.dateOfBirth = 'Required'
    if (!data.placeOfBirth.trim()) e.placeOfBirth = 'Required'
    if (!data.maritalStatus) e.maritalStatus = 'Required'
    if (!data.height.trim()) e.height = 'Required'
    if (!data.weight.trim()) e.weight = 'Required'
    if (!data.yearsWorking.trim()) e.yearsWorking = 'Required'
    if (!data.workingHoursPerDay.trim()) e.workingHoursPerDay = 'Required'
    if (data.hasPartTimeJob === null) e.hasPartTimeJob = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    // Save to Supabase employee_profiles
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: member } = await supabase
          .from('organization_members')
          .select('id')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .limit(1)
          .single()

        if (member) {
          await supabase
            .from('employee_profiles')
            .upsert({
              member_id: member.id,
              full_name: data.fullName,
              work_position: data.workPosition,
              gender: data.gender,
              date_of_birth: data.dateOfBirth || null,
              place_of_birth: data.placeOfBirth,
              marital_status: data.maritalStatus,
              height_cm: data.height ? parseFloat(data.height) : null,
              weight_kg: data.weight ? parseFloat(data.weight) : null,
              years_in_role: data.yearsWorking ? parseFloat(data.yearsWorking) : null,
              working_hours_per_day: data.workingHoursPerDay ? parseFloat(data.workingHoursPerDay) : null,
              has_part_time_job: data.hasPartTimeJob,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'member_id' })
        }
      }
    } catch (err) {
      console.error('Error saving employee profile:', err)
    }

    setPersonalData(data)
    setPersonalDataSubmitted(true)
    router.push('/employee')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {personalDataSubmitted && (
            <button
              onClick={() => router.push('/employee')}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {personalDataSubmitted && <div className="w-px h-4 bg-border" />}
          <span className="text-sm font-semibold text-foreground">Personal Profile</span>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            setRole(null)
            router.push('/')
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </header>

      <div className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          {/* Intro */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground text-balance">
              {personalDataSubmitted
                ? 'Update your profile details'
                : profileFirstName
                  ? <>Hi <span className="text-brand">{profileFirstName}</span>, complete your profile to get started</>
                  : 'Complete your profile to get started'
              }
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              This information helps us contextualise your assessment results. It is stored privately and will never be shared with your employer in identifiable form.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5">

              {/* Row 1: Full name + Work position */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" icon={User} error={errors.fullName}>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={e => set('fullName', e.target.value)}
                    placeholder="e.g. Mohamed Ali"
                    className={cn(inputCls, errors.fullName && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
                <Field label="Work Position" icon={Briefcase} error={errors.workPosition}>
                  <input
                    type="text"
                    value={data.workPosition}
                    onChange={e => set('workPosition', e.target.value)}
                    placeholder="e.g. Mechanical Engineer"
                    className={cn(inputCls, errors.workPosition && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
              </div>

              {/* Row 2: Gender + Marital Status */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Gender" icon={User} error={errors.gender}>
                  <select
                    value={data.gender}
                    onChange={e => set('gender', e.target.value as PersonalData['gender'])}
                    className={cn(selectCls, errors.gender && 'border-destructive')}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </Field>
                <Field label="Marital Status" icon={Heart} error={errors.maritalStatus}>
                  <select
                    value={data.maritalStatus}
                    onChange={e => set('maritalStatus', e.target.value as PersonalData['maritalStatus'])}
                    className={cn(selectCls, errors.maritalStatus && 'border-destructive')}
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </Field>
              </div>

              {/* Row 3: Date of birth + Place of birth */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date of Birth" icon={Calendar} error={errors.dateOfBirth}>
                  <input
                    type="date"
                    value={data.dateOfBirth}
                    onChange={e => set('dateOfBirth', e.target.value)}
                    className={cn(inputCls, errors.dateOfBirth && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
                <Field label="Place of Birth" icon={MapPin} error={errors.placeOfBirth}>
                  <input
                    type="text"
                    value={data.placeOfBirth}
                    onChange={e => set('placeOfBirth', e.target.value)}
                    placeholder="e.g. Algiers"
                    className={cn(inputCls, errors.placeOfBirth && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
              </div>

              {/* Row 4: Height + Weight */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Height (cm)" icon={Ruler} error={errors.height}>
                  <input
                    type="number"
                    min={100} max={250}
                    value={data.height}
                    onChange={e => set('height', e.target.value)}
                    placeholder="e.g. 175"
                    className={cn(inputCls, errors.height && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
                <Field label="Weight (kg)" icon={Scale} error={errors.weight}>
                  <input
                    type="number"
                    min={30} max={300}
                    value={data.weight}
                    onChange={e => set('weight', e.target.value)}
                    placeholder="e.g. 72"
                    className={cn(inputCls, errors.weight && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
              </div>

              {/* Row 5: Years working + Working hours */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Years in Current Role" icon={Briefcase} error={errors.yearsWorking}>
                  <input
                    type="number"
                    min={0} max={50}
                    value={data.yearsWorking}
                    onChange={e => set('yearsWorking', e.target.value)}
                    placeholder="e.g. 4"
                    className={cn(inputCls, errors.yearsWorking && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
                <Field label="Working Hours per Day" icon={Clock} error={errors.workingHoursPerDay}>
                  <input
                    type="number"
                    min={1} max={24}
                    value={data.workingHoursPerDay}
                    onChange={e => set('workingHoursPerDay', e.target.value)}
                    placeholder="e.g. 8"
                    className={cn(inputCls, errors.workingHoursPerDay && 'border-destructive focus:ring-destructive/40')}
                  />
                </Field>
              </div>

              {/* Row 6: Part-time job */}
              <Field label="Do you have a part-time job in addition to this one?" icon={Briefcase} error={errors.hasPartTimeJob as string}>
                <div className="flex gap-3">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set('hasPartTimeJob', opt === 'Yes')}
                      className={cn(
                        'flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                        data.hasPartTimeJob === (opt === 'Yes')
                          ? 'bg-brand/15 border-brand text-brand'
                          : 'bg-input border-border text-muted-foreground hover:border-brand/40 hover:text-foreground'
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>

            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors"
              >
                {personalDataSubmitted ? 'Save Changes' : 'Complete Profile'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
