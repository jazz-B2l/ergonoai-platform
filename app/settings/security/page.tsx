'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  updatePasswordSchema, UpdatePasswordInput,
  updateEmailSchema, UpdateEmailInput 
} from '@/lib/auth/validation'
import { authService } from '@/lib/auth/service'
import { useAuth } from '@/hooks/useAuth'
import { RequireAuth } from '@/lib/auth/guards'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'
import { auditLogger } from '@/lib/audit/logger'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, AlertCircle, CheckCircle2, Shield, Mail, Key } from 'lucide-react'

function SecuritySettingsContent() {
  const { user } = useAuth()
  
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)

  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const emailForm = useForm<UpdateEmailInput>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: user?.email || '',
    }
  })

  const passwordValue = passwordForm.watch('newPassword')

  const onPasswordSubmit = async (data: UpdatePasswordInput) => {
    setPasswordError(null)
    setPasswordSuccess(null)
    try {
      await authService.updatePassword(data)
      auditLogger.logClient({ event: 'password_changed', userId: user?.id })
      setPasswordSuccess('Password successfully updated.')
      passwordForm.reset()
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password')
    }
  }

  const onEmailSubmit = async (data: UpdateEmailInput) => {
    setEmailError(null)
    setEmailSuccess(null)
    try {
      await authService.updateEmail(data)
      auditLogger.logClient({ event: 'email_changed', userId: user?.id })
      setEmailSuccess('Confirmation email sent to the new address. Please verify to complete the change.')
      emailForm.reset()
    } catch (err: any) {
      setEmailError(err.message || 'Failed to update email')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Security Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your password, email address, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Update Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-zinc-500" />
              Change Email
            </CardTitle>
            <CardDescription>
              Update the email address associated with your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
            <CardContent className="space-y-4">
              {emailError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{emailError}</AlertDescription>
                </Alert>
              )}
              {emailSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription>{emailSuccess}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  {...emailForm.register('email')}
                  disabled={emailForm.formState.isSubmitting}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-current-password">Current Password</Label>
                <Input
                  id="email-current-password"
                  type="password"
                  {...emailForm.register('currentPassword')}
                  disabled={emailForm.formState.isSubmitting}
                />
                {emailForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">{emailForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={emailForm.formState.isSubmitting}>
                {emailForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Email
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Password Update Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-zinc-500" />
              Change Password
            </CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay secure.
            </CardDescription>
          </CardHeader>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <CardContent className="space-y-4">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              {passwordSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription>{passwordSuccess}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  {...passwordForm.register('currentPassword')}
                  disabled={passwordForm.formState.isSubmitting}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  {...passwordForm.register('newPassword')}
                  disabled={passwordForm.formState.isSubmitting}
                />
                <PasswordStrengthIndicator password={passwordValue} />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  {...passwordForm.register('confirmNewPassword')}
                  disabled={passwordForm.formState.isSubmitting}
                />
                {passwordForm.formState.errors.confirmNewPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmNewPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                {passwordForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function SecuritySettingsPage() {
  return (
    <RequireAuth>
      <SecuritySettingsContent />
    </RequireAuth>
  )
}
