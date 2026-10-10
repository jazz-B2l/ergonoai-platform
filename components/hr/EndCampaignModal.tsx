'use client'

import { useState } from 'react'
import { AlertTriangle, Lock, Eye, EyeOff, X, Loader2, ShieldAlert } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface EndCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (campaignId?: string) => Promise<void>
  campaignTitle?: string
  campaignId?: string
}

export function EndCampaignModal({
  isOpen,
  onClose,
  onConfirm,
  campaignTitle,
  campaignId,
}: EndCampaignModalProps) {
  const { language } = useApp()
  const isAr = language === 'ar'

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    if (isVerifying) return
    setPassword('')
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError(isAr ? 'يرجى إدخال كلمة المرور' : 'Please enter your password')
      return
    }

    setError(null)
    setIsVerifying(true)

    try {
      // 1. Get currently authenticated user's email
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user?.email) {
        throw new Error(
          isAr
            ? 'تعذر التحقق من جلسة المستخدم الحالية. يرجى تسجيل الدخول مجدداً.'
            : 'Could not verify current user session. Please re-login.'
        )
      }

      // 2. Verify password by attempting signInWithPassword
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      })

      if (authError) {
        setError(
          isAr
            ? 'كلمة المرور غير صحيحة. يرجى التأكد والمحاولة مرة أخرى.'
            : 'Incorrect password. Please verify and try again.'
        )
        setIsVerifying(false)
        return
      }

      // 3. Password verified successfully -> trigger campaign end
      await onConfirm(campaignId)
      handleClose()
    } catch (err: any) {
      console.error('Error during password confirmation to end campaign:', err)
      setError(
        err.message ||
          (isAr
            ? 'حدث خطأ أثناء التحقق من كلمة المرور'
            : 'An unexpected error occurred during password verification')
      )
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-destructive/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center text-destructive">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora text-base font-bold text-foreground">
                {isAr ? 'تأكيد إنهاء حملة التقييم' : 'End Assessment Campaign'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAr ? 'مطلوب التحقق الأمني من الهوية' : 'Security verification required'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isVerifying}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">
                {isAr
                  ? `أنت على وشك إنهاء: "${campaignTitle || 'حملة التقييم'}"`
                  : `You are about to end "${campaignTitle || 'the assessment campaign'}".`}
              </p>
              <p>
                {isAr
                  ? 'سيتم إغلاق استقبال إجابات الموظفين واعتبار الحملة مكتملة. لا يمكن التراجع عن هذا الإجراء.'
                  : 'Employee submissions will be closed and finalized. This action cannot be undone.'}
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="account-password" className="text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              {isAr ? 'أدخل كلمة مرور حسابك للمتابعة' : 'Enter your account password to confirm'}
            </Label>
            <div className="relative">
              <Input
                id="account-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAr ? 'كلمة المرور الحالية' : 'Current account password'}
                disabled={isVerifying}
                autoFocus
                className="pr-10 bg-background text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isVerifying}
              className="text-xs font-medium cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isAr ? 'جاري التحقق...' : 'Verifying & Ending...'}
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  {isAr ? 'تأكيد وإنهاء الحملة' : 'Confirm & End Campaign'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
