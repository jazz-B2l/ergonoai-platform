import { createClient } from '@/lib/supabase/client'

export type AuditEvent = 
  | 'login'
  | 'logout'
  | 'failed_login'
  | 'password_reset'
  | 'password_changed'
  | 'email_changed'
  | 'invite_created'
  | 'invite_accepted'
  | 'invite_revoked'
  | 'company_switched'
  | 'role_assigned'
  | 'role_removed'
  | 'permission_changed'

export interface AuditLogData {
  event: AuditEvent
  userId?: string
  companyId?: string
  details?: Record<string, any>
}

class AuditLogger {
  async logClient(data: AuditLogData) {
    try {
      const supabase = createClient()
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent : 'Unknown'
      
      await supabase.from('audit_logs').insert({
        event: data.event,
        user_id: data.userId || null,
        company_id: data.companyId || null,
        details: {
          ...data.details,
          browser: this.getBrowserFromUserAgent(userAgent),
          userAgent
        }
      })
    } catch (err) {
      console.error('Failed to log audit event', err)
    }
  }

  private getBrowserFromUserAgent(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    return 'Unknown'
  }
}

export const auditLogger = new AuditLogger()
