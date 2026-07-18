import { useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import { AUTH_CONSTANTS } from '@/lib/auth/constants'

export function PasswordStrengthIndicator({ password }: { password?: string }) {
  const strength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= AUTH_CONSTANTS.PASSWORD.MIN_LENGTH) score += 20
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/[0-9]/.test(password)) score += 20
    if (/[^A-Za-z0-9]/.test(password)) score += 20
    return score
  }, [password])

  let color = 'bg-red-500'
  if (strength >= 60) color = 'bg-yellow-500'
  if (strength === 100) color = 'bg-green-500'

  return (
    <div className="space-y-1">
      <Progress value={strength} className={`h-1.5 w-full ${color}`} />
      <p className="text-xs text-zinc-500">
        Must contain: {AUTH_CONSTANTS.PASSWORD.MIN_LENGTH}+ chars, uppercase, lowercase, number, special char.
      </p>
    </div>
  )
}
