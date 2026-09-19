import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if user already has an active organization membership
        const { data: member } = await supabase
          .from('organization_members')
          .select('organization_id, role:roles(name)')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle()

        if (member) {
          const roleName = ((member as any)?.role?.name || '').toLowerCase()
          if (roleName === 'admin' || roleName === 'hr' || roleName === 'manager') {
            return NextResponse.redirect(`${origin}/org`)
          } else {
            return NextResponse.redirect(`${origin}/employee`)
          }
        }

        // If no active membership yet, redirect to finish onboarding with chosen role
        if (role === 'hr' || role === 'employee') {
          return NextResponse.redirect(`${origin}/signup?role=${role}`)
        }

        // Default to role selection for new unassigned users
        return NextResponse.redirect(`${origin}/role-select`)
      }

      return NextResponse.redirect(`${origin}/org`)
    }
  }

  // If code exchange fails, redirect to login page with error query param
  return NextResponse.redirect(`${origin}/login?error=Could not exchange auth code for session`)
}
