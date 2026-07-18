import { createClient } from '@/lib/supabase/client'
import { UserProfile, Company, RolePermissions, Role } from '@/lib/types'

// Static permissions mapping since database stores roles but does not contain a permissions table/column.
const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  admin: [
    'view:dashboard',
    'manage:users',
    'manage:invites',
    'manage:roles',
    'view:reports',
    'run:assessments',
    'log:hazards',
  ],
  hr: [
    'view:dashboard',
    'manage:invites',
    'view:reports',
    'manage:departments',
  ],
  'safety officer': [
    'view:dashboard',
    'run:assessments',
    'log:hazards',
    'view:reports',
  ],
  'safety_officer': [
    'view:dashboard',
    'run:assessments',
    'log:hazards',
    'view:reports',
  ],
  employee: [
    'view:dashboard',
    'complete:assessments',
  ],
}

class SessionService {
  private get supabase() {
    return createClient()
  }

  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    if (error) throw error
    return session
  }

  async fetchProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as UserProfile | null
  }

  async fetchCompanies(userId: string): Promise<Company[]> {
    const { data, error } = await this.supabase
      .from('organization_members')
      .select(`
        organization_id,
        organizations (*)
      `)
      .eq('profile_id', userId)
      .eq('is_active', true)
    
    if (error) throw error
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || [])
      .map((item: any) => item.organizations)
      .filter(Boolean) as Company[]
  }

  async fetchRole(userId: string, companyId: string): Promise<Role | null> {
    const { data, error } = await this.supabase
      .from('organization_members')
      .select('role:roles(name)')
      .eq('profile_id', userId)
      .eq('organization_id', companyId)
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    if (!data || !data.role) return null
    
    // Normalize role name to lowercase to match the frontend expects
    const rawRole = (data.role as any).name?.toLowerCase() || ''
    return rawRole as Role
  }

  async fetchPermissions(role: Role): Promise<RolePermissions | null> {
    const normalizedRole = role ? role.toLowerCase() : ''
    const permissionNames = ROLE_PERMISSIONS_MAP[normalizedRole] || []
    
    // Map string permissions to AppPermission type structure
    const permissions = permissionNames.map((name, index) => ({
      id: `${normalizedRole}_perm_${index}`,
      name,
      description: `Permission to ${name.replace(':', ' ')}`
    }))

    return {
      role,
      permissions
    }
  }
}

export const sessionService = new SessionService()
