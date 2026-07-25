import { createBrowserClient } from '@supabase/ssr'

// Singleton instance — reuse the same client across all callers to
// prevent multiple concurrent session-refresh timers colliding with
// each other (AuthRefreshDiscardedError).
let _client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (input, init) => {
            let attempts = 0
            const maxAttempts = 4
            const delayMs = 1000

            while (attempts < maxAttempts) {
              const request = (typeof Request !== 'undefined' && input instanceof Request) ? input.clone() : input
              const response = await fetch(request, init)

              if (!response.ok) {
                try {
                  const clone = response.clone()
                  const body = await clone.json()
                  if (body && (body.code === 'PGRST303' || body.message?.includes('JWT issued at future'))) {
                    attempts++
                    if (attempts < maxAttempts) {
                      console.warn(
                        `[Supabase Client] Clock drift detected (JWT issued at future / PGRST303). Retrying in ${delayMs}ms (attempt ${attempts}/${maxAttempts})...`
                      )
                      await new Promise((resolve) => setTimeout(resolve, delayMs))
                      continue
                    }
                  }
                } catch {
                  // Ignore non-JSON responses
                }
              }
              return response
            }
            return fetch(input, init)
          }
        }
      }
    )
  }
  return _client
}
