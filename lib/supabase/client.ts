import { createBrowserClient } from '@supabase/ssr'

// Singleton instance — reuse the same client across all callers to
// prevent multiple concurrent session-refresh timers colliding with
// each other (AuthRefreshDiscardedError).
let _client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}
