import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Basic path protection at the edge
  const isOrgRoute = request.nextUrl.pathname.startsWith('/org')
  const isEmployeeRoute = request.nextUrl.pathname.startsWith('/employee')

  if (!user && (isOrgRoute || isEmployeeRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = isOrgRoute ? '/login/org' : '/login/employee'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
