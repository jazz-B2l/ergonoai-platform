'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brain, ArrowRight, Loader2, Eye, EyeOff, Shield } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/theme-toggle'
import { translations } from '@/lib/translations'

function OrgLoginContent() {
  const router = useRouter()
  const { setRole: setAppRole, language } = useApp()
  const t = translations[language].loginOrg
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedOrgEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (!data.user) {
        throw new Error('No user returned')
      }

      // Fetch user role to determine routing, specifying relationship alias
      const { data: memberData } = await supabase
        .from('organization_members')
        .select('role:roles(name)')
        .eq('profile_id', data.user.id)
        .eq('is_active', true)

      let userRole = 'employee'
      if (memberData && memberData.length > 0) {
        const hasHrRole = memberData.some((m: any) => {
          const roleName = m.role?.name?.toLowerCase() || ''
          return roleName === 'hr' || roleName === 'admin'
        })
        if (hasHrRole) {
          userRole = 'hr'
        }
      }

      // Remember Me logic
      if (rememberMe) {
        localStorage.setItem('rememberedOrgEmail', email)
      } else {
        localStorage.removeItem('rememberedOrgEmail')
      }

      // Update app context role
      setAppRole(userRole as 'hr' | 'employee')

      // Redirect
      if (userRole === 'hr') {
        router.push('/org')
      } else {
        router.push('/employee')
      }
    } catch (err: any) {
      const errMsg = err.message || ''
      if (errMsg.includes('fetch') || errMsg.includes('network') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
         setError(language === 'ar' ? 'لا يمكن الاتصال بقاعدة البيانات. يرجى التأكد من تكوين ملف .env.local الخاص بك.' : 'Cannot connect to the database. Please ensure your .env.local file is configured with Supabase credentials.')
      } else {
         setError(errMsg || (language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صالحة.' : 'Invalid email or password.'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent z-0"></div>
      {/* Floating ThemeToggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-sora font-semibold text-2xl tracking-tight text-foreground">ErgonoAI</span>
        </Link>

        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            {t.portal}
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold font-sora tracking-tight text-foreground">
          {t.signInTitle}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground font-medium">
          {t.signInSubtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-card py-8 px-4 border border-border shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-muted-foreground">
                  {t.emailAddress}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  className="mt-1.5 block w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-muted-foreground">
                  {t.password}
                </label>
                <div className="mt-1.5 relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-4 pr-12 py-3 bg-background border border-border rounded-xl text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 ltr:right-0 ltr:pr-4 rtl:left-0 rtl:pl-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-muted-foreground">{t.rememberMe}</span>
              </label>

              <Link href="#" className="text-xs font-semibold text-brand hover:underline">
                {t.forgotPassword}
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t.signInButton}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-muted-foreground">
              {t.employeeNotice}{' '}
              <Link href="/login/employee" className="font-semibold text-brand hover:underline">
                {t.signInAsEmployee}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrgLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    }>
      <OrgLoginContent />
    </Suspense>
  )
}
