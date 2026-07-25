import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/role-select',
  '/deactivated',
]

const PUBLIC_API_ROUTES = [
  '/api/ai/health',
]

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // 1. Bypass normal client auth check for admin routes
  // (The admin page verifies its own ergono_admin signed cookie securely)
  if (pathname.startsWith('/admin')) {
    return supabaseResponse
  }

  // Validate authenticated user securely with getUser() instead of getSession()
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Check if user's organization is active
  if (user && pathname !== '/deactivated' && !pathname.startsWith('/api/')) {
    const { data: member } = await supabase
      .from('organization_members')
      .select('organization_id, organizations(is_active)')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single()

    const orgIsActive = (member as any)?.organizations?.is_active !== false

    if (member && !orgIsActive) {
      const url = request.nextUrl.clone()
      url.pathname = '/deactivated'
      return NextResponse.redirect(url)
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(route)
  })

  const isPublicApiRoute = PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))

  if (pathname.startsWith('/api/')) {
    if (!user && !isPublicApiRoute) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required for API endpoints' },
        { status: 401 }
      )
    }
    return supabaseResponse
  }

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
