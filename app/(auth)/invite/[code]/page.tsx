'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupInput } from '@/lib/auth/validation'
import { authService } from '@/lib/auth/service'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const inviteCode = params.code as string

  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [inviteData, setInviteData] = useState<{ email: string; companyName: string } | null>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  useEffect(() => {
    // In a real implementation, you would validate the invite code against your backend API here
    // to ensure it hasn't expired or been used, and fetch the pre-assigned email and company info.
    const validateInvite = async () => {
      try {
        // Mock validation for now
        // const data = await fetch(`/api/auth/invite/${inviteCode}`).then(res => res.json())
        setTimeout(() => {
          setInviteData({ email: 'invited@example.com', companyName: 'Acme Corp' })
          setValue('email', 'invited@example.com')
          setIsValidating(false)
        }, 1000)
      } catch (err) {
        setError('Invalid or expired invite link.')
        setIsValidating(false)
      }
    }
    validateInvite()
  }, [inviteCode, setValue])

  const passwordValue = watch('password')

  const onSubmit = async (data: SignupInput) => {
    setError(null)
    try {
      // Create the user account via Supabase Auth
      await authService.signup(data)
      
      // In a real implementation, you would also accept the invite on the backend
      // which automatically associates the new user with the company and role.
      // await fetch(`/api/auth/invite/${inviteCode}/accept`, { method: 'POST', body: JSON.stringify({ userId: ... }) })

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    }
  }

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
        <p>Validating invitation...</p>
      </div>
    )
  }

  if (error && !inviteData) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
          Invitation Invalid
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          This invitation link has expired or is no longer valid.
        </p>
        <Button onClick={() => router.push('/login')} className="w-full">
          Return to login
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Join {inviteData?.companyName}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          You&apos;ve been invited to join ErgonoAI. Create your account to accept the invitation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              disabled={isSubmitting}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              disabled={isSubmitting}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            disabled={true} // Email is locked to the invite
            className="bg-zinc-50 text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            disabled={isSubmitting}
            className={errors.password ? 'border-red-500' : ''}
          />
          <PasswordStrengthIndicator password={passwordValue} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            disabled={isSubmitting}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Accept Invitation'
          )}
        </Button>
      </form>
    </div>
  )
}
