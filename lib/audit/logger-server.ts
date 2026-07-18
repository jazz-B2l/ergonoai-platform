import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AuditLogData } from './logger'

class ServerAuditLogger {
  async logServer(data: AuditLogData, request?: Request) {
    try {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll() { /* ignore */ },
          }
        }
      )
      
      const userAgent = request?.headers.get('user-agent') || 'Unknown'
      const ip = request?.headers.get('x-forwarded-for') || 'Unknown'

      await supabase.from('audit_logs').insert({
        event: data.event,
        user_id: data.userId || null,
        company_id: data.companyId || null,
        ip_address: ip,
        details: {
          ...data.details,
          browser: this.getBrowserFromUserAgent(userAgent),
          userAgent
        }
      })
    } catch (err) {
      console.error('Failed to log audit event on server', err)
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

export const serverAuditLogger = new ServerAuditLogger()
