'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginInput } from '@/lib/auth/validation'
import { authService } from '@/lib/auth/service'
import { useAuth } from '@/hooks/useAuth'
import { useCompany } from '@/hooks/useCompany'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { user, refreshSession } = useAuth()
  const { activeCompany } = useCompany()
  const { language } = useApp()
  const t = translations[language].auth
  
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('remembered_email')
      const remember = localStorage.getItem('remember_me') === 'true'
      if (savedEmail && remember) {
        setValue('email', savedEmail)
        setValue('rememberMe', true)
      }
    }
  }, [setValue])

  const onSubmit = async (data: LoginInput) => {
    setError(null)
    if (data.rememberMe) {
      localStorage.setItem('remembered_email', data.email)
      localStorage.setItem('remember_me', 'true')
    } else {
      localStorage.removeItem('remembered_email')
      localStorage.removeItem('remember_me')
    }
    try {
      await authService.login(data)
      await refreshSession()
      router.push('/org/profile')
    } catch (err: any) {
      if (err.message?.includes('Email not confirmed')) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else {
        setError(err.message || 'Failed to login')
      }
    }
  }

  if (user) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {t.alreadySignedIn}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            {t.signedInAs} <span className="font-semibold text-zinc-950 dark:text-zinc-100">{user.email}</span>.
          </p>
        </div>
        
        <div className="space-y-3">
          {activeCompany ? (
            <Button onClick={() => router.push('/org/profile')} className="w-full">
              {t.goDashboard}
            </Button>
          ) : (
            <Button onClick={() => router.push('/role-select')} className="w-full">
              {t.completeOnboarding}
            </Button>
          )}
          <Button 
            onClick={async () => {
              await authService.logout()
              window.location.reload()
            }} 
            variant="outline" 
            className="w-full text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200"
          >
            {t.signOutAnother}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          {t.signInTitle}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          {t.dontHaveAccount}{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            {t.signUp}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t.emailAddress}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            disabled={isSubmitting}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.password}</Label>
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                {t.forgotPassword}
              </Link>
            </div>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')}
              disabled={isSubmitting}
              className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2 py-1">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 accent-teal-600 dark:border-zinc-700 dark:bg-zinc-800 cursor-pointer"
          />
          <Label htmlFor="rememberMe" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
            {language === 'ar' ? 'تذكرني' : 'Remember me'}
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}
            </>
          ) : (
            t.signIn
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 inline-flex items-center gap-1.5 transition-colors">
          {language === 'ar' ? (
            <>
              {t.backToLanding}
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4" />
              {t.backToLanding}
            </>
          )}
        </Link>
      </div>
    </div>
  )
}
