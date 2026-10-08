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
              try {
                let request: RequestInfo | URL = input
                if (typeof Request !== 'undefined' && input instanceof Request) {
                  try {
                    request = input.clone()
                  } catch {
                    request = input
                  }
                }

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
              } catch (error) {
                attempts++
                if (attempts < maxAttempts) {
                  console.warn(
                    `[Supabase Client] Network error (Failed to fetch). Retrying in ${delayMs}ms (attempt ${attempts}/${maxAttempts})...`,
                    error
                  )
                  await new Promise((resolve) => setTimeout(resolve, delayMs))
                  continue
                }
                console.warn(
                  `[Supabase Client] Host unreachable after ${maxAttempts} attempts. Returning offline fallback response:`,
                  error
                )
                const isAuth = typeof input === 'string'
                  ? input.includes('/auth/v1')
                  : (typeof Request !== 'undefined' && input instanceof Request ? input.url.includes('/auth/v1') : false)

                return new Response(
                  JSON.stringify({
                    error: isAuth ? 'invalid_grant' : 'Network Error',
                    message: error instanceof Error ? error.message : 'Supabase host unreachable',
                    msg: error instanceof Error ? error.message : 'Supabase host unreachable',
                    error_description: 'Supabase host unreachable. Please verify your Supabase project status in dashboard.'
                  }),
                  {
                    status: 400,
                    statusText: 'Bad Request',
                    headers: { 'Content-Type': 'application/json' }
                  }
                )
              }
            }
            return new Response(
              JSON.stringify({
                error: 'Network Error',
                message: 'Supabase host unreachable',
                msg: 'Supabase host unreachable',
                error_description: 'Supabase host unreachable'
              }),
              {
                status: 400,
                statusText: 'Bad Request',
                headers: { 'Content-Type': 'application/json' }
              }
            )
          }
        }
      }
    )
  }
  return _client
}
