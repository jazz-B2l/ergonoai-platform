/**
 * Provider-agnostic Rate Limiting Interface
 * Prepared for future Redis integration (e.g. Upstash)
 */

export interface RateLimitConfig {
  action: string
  limit: number
  windowMs: number
}

class RateLimiter {
  // In-memory fallback for now.
  // In production, this should be backed by Redis using the same API.
  private store = new Map<string, { count: number; resetAt: number }>()

  async checkLimit(identifier: string, config: RateLimitConfig): Promise<{ success: boolean; resetAt: number }> {
    const key = `${config.action}:${identifier}`
    const now = Date.now()

    let record = this.store.get(key)

    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + config.windowMs }
      this.store.set(key, record)
      return { success: true, resetAt: record.resetAt }
    }

    if (record.count >= config.limit) {
      return { success: false, resetAt: record.resetAt }
    }

    record.count += 1
    this.store.set(key, record)
    return { success: true, resetAt: record.resetAt }
  }

  // Clear expired records periodically (for in-memory only)
  cleanup() {
    const now = Date.now()
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetAt) {
        this.store.delete(key)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

// Optional: Run cleanup periodically
if (typeof window === 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 60000)
}
