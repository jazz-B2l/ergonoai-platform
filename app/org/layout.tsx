import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HRSidebar } from '@/components/hr/sidebar'

export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. Verify Role-Based Access Control (RBAC)
  const { data: member, error: roleError } = await supabase
    .from('organization_members')
    .select('role:roles(name)')
    .eq('profile_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single()

  if (roleError || !member) {
    // If no active member record, deny access
    redirect('/login')
  }

  // Check if role is HR or Admin
  // (In some schemas role is an object from a join, handle accordingly)
  const roleName = typeof member.role === 'object' && member.role !== null 
    ? (member.role as any).name?.toLowerCase() 
    : String(member.role).toLowerCase()

  if (roleName !== 'hr' && roleName !== 'admin') {
    // Unauthorized for org dashboard, send to employee dashboard
    redirect('/employee')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <HRSidebar />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
