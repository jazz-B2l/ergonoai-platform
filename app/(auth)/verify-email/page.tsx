'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/lib/auth/service'
import { AUTH_CONSTANTS } from '@/lib/auth/constants'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [cooldown])

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !otp.trim()) return
    setIsVerifying(true)
    setMessage(null)

    try {
      await authService.verifyOtp(email, otp.trim())
      setMessage({ type: 'success', text: 'Email successfully verified! Redirecting to login...' })
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Verification failed. Please check the code and try again.' })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setIsResending(true)
    setMessage(null)
    
    try {
      await authService.resendVerification(email)
      setMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' })
      setCooldown(AUTH_CONSTANTS.RATE_LIMIT.RESEND_VERIFICATION_COOLDOWN_SECONDS)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to resend email. Please try again later.' })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
        <Mail className="h-6 w-6 text-blue-600" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
        Check your email
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        We've sent a verification code to <span className="font-medium text-zinc-900 dark:text-zinc-200">{email || 'your email'}</span>.
        Please enter the 6-digit code below to confirm your account.
      </p>

      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className={`mb-6 text-left ${message.type === 'success' ? 'border-green-500 bg-green-50 text-green-700' : ''}`}>
          {message.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleVerifyOtp} className="mb-6 space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 text-left mb-1.5">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            className="block w-full text-center tracking-widest text-lg font-bold px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-zinc-400 placeholder:tracking-normal placeholder:font-normal"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isVerifying || otp.length < 6 || !email} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {isVerifying ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
          ) : (
            'Verify code'
          )}
        </Button>
      </form>

      <div className="relative flex py-3 items-center">
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
        <span className="flex-shrink mx-4 text-zinc-400 text-xs">or resend</span>
        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700"></div>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={handleResend} 
          disabled={isResending || cooldown > 0 || !email} 
          className="w-full"
          variant="outline"
        >
          {isResending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
          ) : cooldown > 0 ? (
            `Resend available in ${cooldown}s`
          ) : (
            'Resend verification code'
          )}
        </Button>
        <Button onClick={() => window.location.href = '/login'} className="w-full">
          Return to login
        </Button>
      </div>
    </div>
  )
}
