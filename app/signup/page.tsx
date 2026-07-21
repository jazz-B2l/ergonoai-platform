'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Brain, Activity, Shield, User, ArrowRight, Loader2, Check, ChevronRight, ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { supabase } from '@/lib/supabase'
import { WILAYAS } from '@/lib/constants'

import { translations } from '@/lib/translations'
import { ThemeToggle } from '@/components/theme-toggle'

const InputLabel = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{children}</label>
)

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="block w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
  />
)

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setRole: setAppRole, language, setLanguage } = useApp()
  
  const roleParam = searchParams.get('role')
  const initialRole = roleParam === 'hr' || roleParam === 'employee' ? roleParam : 'hr'

  const [role, setRoleState] = useState<'hr' | 'employee'>(initialRole)
  const [step, setStep] = useState(1)
  
  // Base Auth & Profile
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Employee specifics
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  
  // Organization specifics (HR)
  const [organizationName, setOrganizationName] = useState('')
  const [organizationDescription, setOrganizationDescription] = useState('')
  const [organizationIndustry, setOrganizationIndustry] = useState('')
  const [organizationSize, setOrganizationSize] = useState('')
  const [organizationFounded, setOrganizationFounded] = useState('')
  const [organizationLogo, setOrganizationLogo] = useState('')
  const [organizationBanner, setOrganizationBanner] = useState('')
  
  const [organizationEmail, setOrganizationEmail] = useState('')
  const [organizationPhone, setOrganizationPhone] = useState('')
  const [organizationWebsite, setOrganizationWebsite] = useState('')
  const [organizationDistrict, setOrganizationDistrict] = useState('')
  const [organizationWilaya, setOrganizationWilaya] = useState('')
  const [organizationLat, setOrganizationLat] = useState('')
  const [organizationLng, setOrganizationLng] = useState('')
  const [organizationLinkedin, setOrganizationLinkedin] = useState('')
  const [organizationTwitter, setOrganizationTwitter] = useState('')
  const [organizationFacebook, setOrganizationFacebook] = useState('')

  const [signupDepts, setSignupDepts] = useState<any[]>([])
  const [selectedDeptId, setSelectedDeptId] = useState('')
  const [verifyingInvite, setVerifyingInvite] = useState(false)
  const [inviteVerified, setInviteVerified] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const t = translations[language].signup
  const tc = translations[language].common

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (roleParam === 'hr' || roleParam === 'employee') {
      setRoleState(roleParam)
      setStep(1)
    }
  }, [roleParam])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true)
        setEmail(user.email || '')
      }
    })
  }, [])

  const verifyInviteCode = async (code: string) => {
    if (!code || code.trim().length < 5) {
      setInviteVerified(false)
      setSignupDepts([])
      return
    }
    setVerifyingInvite(true)
    try {
      const { data: invite } = await supabase
        .from('invite_codes')
        .select('organization_id')
        .eq('code', code.trim())
        .maybeSingle()

      if (invite?.organization_id) {
        setInviteVerified(true)
        // Fetch departments
        const { data: depts } = await supabase
          .from('departments')
          .select('id, name')
          .eq('organization_id', invite.organization_id)
        setSignupDepts(depts || [])
      } else {
        setInviteVerified(false)
        setSignupDepts([])
      }
    } catch (err) {
      console.error('Error verifying invite code:', err)
    } finally {
      setVerifyingInvite(false)
    }
  }

  useEffect(() => {
    const code = inviteCode.trim()
    if (code.length >= 12) {
      verifyInviteCode(code)
    } else {
      setInviteVerified(false)
      setSignupDepts([])
    }
  }, [inviteCode])

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-url')) {
      setError(language === 'ar' ? 'لم يتم إعداد قاعدة البيانات. يرجى تهيئة ملف الإعدادات الخاص بك.' : 'Supabase is not configured. Please add your credentials to the .env.local file.')
      setLoading(false)
      return
    }

    if (!isLoggedIn && password !== confirmPassword) {
      setError(language === 'ar' ? 'كلمتا المرور غير متطابقتين. يرجى التحقق وإعادة المحاولة.' : 'Passwords do not match. Please check and try again.')
      setLoading(false)
      return
    }

    if (role === 'hr' && organizationFounded) {
      const year = parseInt(organizationFounded)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1800 || year > currentYear) {
        setError(language === 'ar' ? `سنة التأسيس يجب أن تكون بين 1800 و ${currentYear}` : `Founded year must be between 1800 and ${currentYear}`)
        setLoading(false)
        return
      }
    }

    try {
      let user = null
      if (isLoggedIn) {
        const { data: { session } } = await supabase.auth.getSession()
        user = session?.user || null
      }

      if (!user) {
        // 1. Supabase Auth Signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: role === 'hr' ? organizationName : `${firstName} ${lastName}`.trim(),
              role: role,
            }
          }
        })

        if (authError) throw authError
        user = authData?.user
      }

      if (!user) throw new Error('No user data returned.')

      // 2. Insert into public.profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          first_name: role === 'hr' ? organizationName : firstName,
          last_name: role === 'hr' ? 'Admin' : lastName,
          phone: role === 'hr' ? (organizationPhone || null) : (phone || null),
          language: language,
          updated_at: new Date().toISOString()
        })

      if (profileError) console.error('Error inserting profile:', profileError.message)

      // 3. Role specific logic
      if (role === 'hr') {
        const { data: organization, error: organizationError } = await supabase
          .from('organizations')
          .insert({
            name: organizationName,
            description: organizationDescription,
            industry: organizationIndustry,
            organization_size: organizationSize,
            founded_year: organizationFounded ? parseInt(organizationFounded) : null,
            contact_email: email,
            contact_phone: organizationPhone,
            website: organizationWebsite,
            district: organizationDistrict,
            wilaya: organizationWilaya,
            location_lat: organizationLat ? parseFloat(organizationLat) : null,
            location_lng: organizationLng ? parseFloat(organizationLng) : null,
            logo_url: organizationLogo,
            banner_url: organizationBanner,
            created_by: user.id,
            updated_by: user.id,
            social_media: {
              linkedin: organizationLinkedin,
              twitter: organizationTwitter,
              facebook: organizationFacebook
            }
          })
          .select()
          .single()

        if (organizationError) throw new Error(`Organization creation failed: ${organizationError.message}`)

        let { data: adminRole } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'Admin')
          .single()

        if (!adminRole) {
          const { data: newRole } = await supabase
            .from('roles')
            .insert({ name: 'Admin', description: 'Organization Administrator' })
            .select()
            .single()
          adminRole = newRole
        }

        if (adminRole) {
          await supabase.from('organization_members').insert({
            profile_id: user.id,
            organization_id: organization.id,
            role_id: adminRole.id,
            is_active: true
          })
        }
      } else {
        const { data: invite, error: inviteError } = await supabase
          .from('invite_codes')
          .select('*')
          .eq('code', inviteCode)
          .single()

        if (inviteError || !invite) {
          throw new Error(language === 'ar' ? 'رمز دعوة غير صالح أو منتهي الصلاحية. يرجى التواصل مع مسؤول الموارد البشرية.' : 'Invalid or expired invitation code. Please contact your HR Manager.')
        }

        const { data: member, error: memberError } = await supabase
          .from('organization_members')
          .insert({
            profile_id: user.id,
            organization_id: invite.organization_id,
            role_id: invite.role_id,
            department_id: selectedDeptId || null,
            site_id: invite.site_id,
            employee_number: employeeNumber,
            is_active: true
          })
          .select()
          .single()

        if (memberError) throw new Error(`Failed to join organization: ${memberError.message}`)

        await supabase.from('employee_profiles').insert({ member_id: member.id })
        await supabase.from('invite_codes').update({ used_count: (invite.used_count || 0) + 1 }).eq('id', invite.id)
      }

      setAppRole(role)
      setSuccess(true)
      
      setTimeout(() => {
        router.push(role === 'hr' ? '/org' : '/employee')
      }, 2000)

    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.includes('fetch') || errMsg.includes('network')) {
        setError(language === 'ar' ? 'لا يمكن الاتصال بقاعدة البيانات. يرجى التأكد من تكوين ملف .env.local الخاص بك.' : 'Cannot connect to the database. Please ensure your .env.local file is configured with Supabase credentials.')
      } else {
        setError(errMsg || (language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب.' : 'An error occurred during signup.'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-teal-500/5 via-slate-50 to-slate-50 dark:via-zinc-950 dark:to-zinc-950 z-0"></div>
      
      {/* Floating ThemeToggle & Language */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <ThemeToggle />
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
        >
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-sora font-semibold text-2xl tracking-tight text-slate-900 dark:text-white">ErgonoAI</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold font-sora tracking-tight text-slate-900 dark:text-white">
          {t.createAccount}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          {t.alreadyHaveAccount}{' '}
          <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
            {tc.login}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 sm:px-10 border border-slate-200 dark:border-zinc-800 shadow-xl rounded-2xl">
          
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <Check className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold font-sora text-slate-900 dark:text-white">{t.accountCreated}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.redirecting}</p>
              <div className="flex justify-center pt-4">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Role Indicator & Switch Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700/60 mb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sora">
                    {role === 'hr' ? t.orgReg : t.empReg}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {role === 'hr' ? t.orgRegDesc : t.empRegDesc}
                  </p>
                </div>
                <Link
                  href={role === 'hr' ? '/signup?role=employee' : '/signup?role=hr'}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-teal-600 dark:text-teal-400 text-xs font-semibold transition-all shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-zinc-600"
                >
                  {role === 'hr' ? (
                    <>
                      <User className="w-3.5 h-3.5" />
                      {t.switchToEmployee}
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      {t.switchToAdmin}
                    </>
                  )}
                </Link>
              </div>
              {/* Progress Bar (HR Only) */}
              {role === 'hr' && (
                <div className="flex items-center justify-between mb-8 mt-6 max-w-md mx-auto">
                  <div className={`h-2 rounded-full flex-1 ${step >= 1 ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
                  <div className="w-2"></div>
                  <div className={`h-2 rounded-full flex-1 ${step >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 font-medium text-center animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* STEP 1: Login Details */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 font-sora">
                    {role === 'hr' ? t.stepOrgCredentials : 'Your Personal Details'}
                  </h3>
                  
                  {role === 'employee' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <InputLabel htmlFor="firstName">{t.firstName}</InputLabel>
                          <Input id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                        </div>
                        <div>
                          <InputLabel htmlFor="lastName">{t.lastName}</InputLabel>
                          <Input id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <InputLabel htmlFor="email">{t.email}</InputLabel>
                          <Input id="email" type="email" required disabled={isLoggedIn} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                        </div>
                        {!isLoggedIn && (
                          <div>
                            <InputLabel htmlFor="password">{t.password}</InputLabel>
                            <div className="relative">
                              <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="block w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!isLoggedIn ? (
                          <div>
                            <InputLabel htmlFor="confirmPassword">{t.confirmPassword}</InputLabel>
                            <div className="relative">
                              <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`block w-full pl-4 pr-12 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                                  confirmPassword && password !== confirmPassword
                                    ? 'border-red-300 focus:ring-red-400'
                                    : confirmPassword && password === confirmPassword
                                    ? 'border-emerald-300 focus:ring-emerald-400'
                                    : 'border-slate-200'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                              <p className="text-xs text-red-500 font-medium mt-1">{language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}</p>
                            )}
                            {confirmPassword && password === confirmPassword && (
                              <p className="text-xs text-emerald-600 font-medium mt-1">{language === 'ar' ? 'كلمتا المرور متطابقتان ✓' : 'Passwords match ✓'}</p>
                            )}
                          </div>
                        ) : null}
                        <div>
                          <InputLabel htmlFor="phone">{t.phone}</InputLabel>
                          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213 555 123 456" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <InputLabel htmlFor="language">{t.lang}</InputLabel>
                          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 h-[50px] items-center">
                            <button type="button" onClick={() => setLanguage('en')} className={`py-1.5 rounded-lg text-sm font-semibold transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>English</button>
                            <button type="button" onClick={() => setLanguage('ar')} className={`py-1.5 rounded-lg text-sm font-semibold transition-all ${language === 'ar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>العربية</button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                        <div>
                          <InputLabel htmlFor="inviteCode">{t.inviteCode}</InputLabel>
                          <div className="relative">
                            <Input id="inviteCode" type="text" required value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Provided by your HR" />
                            {verifyingInvite && (
                              <div className="absolute right-3 inset-y-0 flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                              </div>
                            )}
                          </div>
                          {inviteVerified && (
                            <p className="text-xs text-emerald-600 font-medium mt-1">{t.inviteValid}</p>
                          )}
                        </div>

                        {inviteVerified && (
                          <div className="space-y-1.5 animate-in fade-in duration-200">
                            <label htmlFor="signupDept" className="block text-sm font-semibold text-slate-700 mb-1">{t.selectDept}</label>
                            {signupDepts.length > 0 ? (
                              <select
                                id="signupDept"
                                value={selectedDeptId}
                                onChange={(e) => setSelectedDeptId(e.target.value)}
                                className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none"
                              >
                                <option value="">Choose department...</option>
                                {signupDepts.map((d) => (
                                  <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                              </select>
                            ) : (
                              <p className="text-xs text-slate-400 italic px-1">No departments set up yet — you can update this later.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <InputLabel htmlFor="email">{t.contactEmail} *</InputLabel>
                          <Input id="email" type="email" required disabled={isLoggedIn} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@organization.com" />
                        </div>
                        {!isLoggedIn && (
                          <div>
                            <InputLabel htmlFor="password">{t.password}</InputLabel>
                            <div className="relative">
                              <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="block w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!isLoggedIn ? (
                          <div>
                            <InputLabel htmlFor="confirmPassword">{t.confirmPassword}</InputLabel>
                            <div className="relative">
                              <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`block w-full pl-4 pr-12 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                                  confirmPassword && password !== confirmPassword
                                    ? 'border-red-300 focus:ring-red-400'
                                    : confirmPassword && password === confirmPassword
                                    ? 'border-emerald-300 focus:ring-emerald-400'
                                    : 'border-slate-200'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                              <p className="text-xs text-red-500 font-medium mt-1">{language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}</p>
                            )}
                            {confirmPassword && password === confirmPassword && (
                              <p className="text-xs text-emerald-600 font-medium mt-1">{language === 'ar' ? 'كلمتا المرور متطابقتان ✓' : 'Passwords match ✓'}</p>
                            )}
                          </div>
                        ) : null}
                        <div>
                          <InputLabel htmlFor="language">{t.lang}</InputLabel>
                          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 h-[50px] items-center">
                            <button type="button" onClick={() => setLanguage('en')} className={`py-1.5 rounded-lg text-sm font-semibold transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>English</button>
                            <button type="button" onClick={() => setLanguage('ar')} className={`py-1.5 rounded-lg text-sm font-semibold transition-all ${language === 'ar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>العربية</button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {role === 'hr' ? (
                    <div className="pt-4 flex justify-end">
                      <button type="button" onClick={nextStep} className="flex items-center gap-2 py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all shadow-md cursor-pointer">
                        {t.nextOrgInfo} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all shadow-md cursor-pointer">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Organization'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Organization Identity */}
              {step === 2 && role === 'hr' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 font-sora">{t.stepOrgIdentity}</h3>
                  
                  <div>
                    <InputLabel htmlFor="organizationName">{t.orgName} *</InputLabel>
                    <Input id="organizationName" type="text" required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder={t.orgNamePlaceholder} />
                  </div>

                  <div>
                    <InputLabel htmlFor="organizationDescription">{t.orgDesc}</InputLabel>
                    <textarea
                      id="organizationDescription"
                      rows={3}
                      value={organizationDescription}
                      onChange={(e) => setOrganizationDescription(e.target.value)}
                      placeholder={t.orgDescPlaceholder}
                      className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <InputLabel htmlFor="organizationIndustry">{t.industry}</InputLabel>
                      <Input id="organizationIndustry" type="text" value={organizationIndustry} onChange={(e) => setOrganizationIndustry(e.target.value)} placeholder="e.g. Energy" />
                    </div>
                    <div>
                      <InputLabel htmlFor="organizationSize">{t.orgSize}</InputLabel>
                      <select
                        id="organizationSize"
                        value={organizationSize}
                        onChange={(e) => setOrganizationSize(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none"
                      >
                        <option value="">{t.selectSize}</option>
                        <option value="1-10">1 - 10 employees</option>
                        <option value="11-50">11 - 50 employees</option>
                        <option value="51-200">51 - 200 employees</option>
                        <option value="201-500">201 - 500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>
                    <div>
                      <InputLabel htmlFor="organizationFounded">{t.foundedYear}</InputLabel>
                      <Input id="organizationFounded" type="number" min="1800" max={new Date().getFullYear()} value={organizationFounded} onChange={(e) => setOrganizationFounded(e.target.value)} placeholder="e.g. 1963" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <InputLabel htmlFor="organizationPhone">{t.contactPhone}</InputLabel>
                      <Input id="organizationPhone" type="tel" value={organizationPhone} onChange={(e) => setOrganizationPhone(e.target.value)} placeholder="+213 ..." />
                    </div>
                    <div>
                      <InputLabel htmlFor="organizationWebsite">{t.website}</InputLabel>
                      <Input id="organizationWebsite" type="url" value={organizationWebsite} onChange={(e) => setOrganizationWebsite(e.target.value)} placeholder="https://www.organization.dz" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-4 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-800">{t.socialLinks}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input id="organizationLinkedin" type="url" value={organizationLinkedin} onChange={(e) => setOrganizationLinkedin(e.target.value)} placeholder="LinkedIn URL" />
                      <Input id="organizationTwitter" type="url" value={organizationTwitter} onChange={(e) => setOrganizationTwitter(e.target.value)} placeholder="Twitter URL" />
                      <Input id="organizationFacebook" type="url" value={organizationFacebook} onChange={(e) => setOrganizationFacebook(e.target.value)} placeholder="Facebook URL" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={prevStep} className="flex items-center gap-2 py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all cursor-pointer">
                      <ChevronLeft className="w-4 h-4" /> {t.back}
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all shadow-md cursor-pointer">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t.createAccountBtn} <Check className="w-4 h-4" /></>}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <Activity className="w-4 h-4 text-teal-600 mt-0.5 shrink-0 animate-pulse" />
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {t.gdprNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
