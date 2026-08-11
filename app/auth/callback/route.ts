import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Default to redirect to /role-select or /org / /employee depending on roles
  const next = searchParams.get('next') ?? '/org'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Successful session exchange, redirect to the desired route
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If code exchange fails, redirect to login page with error query param
  return NextResponse.redirect(`${origin}/login?error=Could not exchange auth code for session`)
}
