import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login/employee')
  }

  // 2. Verify Member Record
  const { data: member, error: memberError } = await supabase
    .from('organization_members')
    .select('id')
    .eq('profile_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single()

  if (memberError || !member) {
    // If no active member record, deny access
    redirect('/login/employee')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {children}
    </div>
  )
}
