'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies, headers } from 'next/headers'
import { createHmac, pbkdf2Sync } from 'crypto'

// A server-side secret key to sign the admin cookie
const COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET || 'ergonoai-admin-cookie-signing-secret-key-2026'

// Generate a secure hash signature for the admin session
function getAdminTokenSignature() {
  return createHmac('sha256', COOKIE_SECRET).update('ergono-admin-active-session').digest('hex')
}

export async function verifyAdminPassword(password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  let correctPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (supabaseUrl && supabaseServiceKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { data, error } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_password')
        .single()
      
      if (!error && data?.value) {
        correctPassword = data.value
      }
    } catch (e) {
      console.warn('Could not fetch admin password from database, using env/hardcoded fallback')
    }
  }

  let isCorrect = false
  if (correctPassword.includes(':')) {
    const [salt, hash] = correctPassword.split(':')
    try {
      const hashedInput = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
      isCorrect = hashedInput === hash
    } catch (e) {
      isCorrect = false
    }
  } else {
    isCorrect = password === correctPassword
  }

  if (isCorrect) {
    // Generate a secure signed token
    const adminToken = getAdminTokenSignature()
    
    // Detect if running on localhost to bypass secure-cookie rejection over HTTP
    const headerStore = await headers()
    const host = headerStore.get('host') || ''
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
    
    // Set a cookie to indicate the user is an admin
    const cookieStore = await cookies()
    cookieStore.set('ergono_admin', adminToken, {
      httpOnly: true, // Prevents client-side scripts from accessing the cookie
      secure: !isLocalhost && process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'strict', // Protects against CSRF
    })
    return { success: true }
  }
  return { success: false, error: 'Invalid password' }
}

export async function getOrganizationsAsAdmin() {
  try {
    // Verify the admin session signature
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('ergono_admin')?.value
    const expectedToken = getAdminTokenSignature()
    
    if (!adminToken || adminToken !== expectedToken) {
      return { success: false, error: 'Unauthorized: Invalid or expired admin session. Please log in again.' }
    }

    // Create a Supabase client with the Service Role Key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: 'Configuration Error: Supabase environment variables (specifically SUPABASE_SERVICE_ROLE_KEY) are missing on this environment.' }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching organizations as admin:', error)
      return { success: false, error: 'Database Query Failed: ' + error.message }
    }

    return { success: true, data: data || [] }
  } catch (e: any) {
    console.error('Unexpected admin fetch error:', e)
    return { success: false, error: 'Unexpected system error: ' + (e.message || String(e)) }
  }
}

export async function toggleOrganizationActiveStatus(orgId: string, isActive: boolean) {
  // Verify the admin session signature
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('ergono_admin')?.value
  const expectedToken = getAdminTokenSignature()
  
  if (!adminToken || adminToken !== expectedToken) {
    throw new Error('Unauthorized')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables not set')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('organizations')
    .update({ is_active: isActive })
    .eq('id', orgId)
    .select()
    .single()

  if (error) {
    console.error('Error toggling organization status:', error)
    throw new Error('Failed to update organization status')
  }

  return data
}
