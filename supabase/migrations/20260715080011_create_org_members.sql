-- 1. Recreate the organization_members table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    site_id UUID,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    job_title TEXT,
    employee_number TEXT,
    employment_type TEXT,
    joined_at DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    deleted_at TIMESTAMPTZ,
    UNIQUE(profile_id, organization_id)
);

-- 2. Restore the link for your employee account "json file"
INSERT INTO public.organization_members (id, profile_id, organization_id, role_id, is_active)
VALUES (
    '8d463bcb-67b6-4757-acea-4a5bfb2e06a3', -- member_id matching your employee_profiles row
    '9f8a7b19-ff99-4125-9f78-53840c5ca561', -- profile_id for "json file"
    '0d6abdb4-6698-4a29-9569-f730892be9da', -- organization_id for "hyproc"
    'ec506938-994a-4e8f-bb19-ca6cef8d6472', -- role_id for "Employee"
    true
)
ON CONFLICT (profile_id, organization_id) DO NOTHING;

-- 3. Restore the member link for safety/HR account "kkkk ahmed"
INSERT INTO public.organization_members (profile_id, organization_id, role_id, is_active)
VALUES (
    '83bd5db6-b573-4c76-915c-d11dcfe5eb2e', -- profile_id for "kkkk ahmed"
    '0d6abdb4-6698-4a29-9569-f730892be9da', -- organization_id for "hyproc"
    '419866ed-db20-417e-b28f-6c7a63a5c947', -- role_id for "HR"
    true
)
ON CONFLICT (profile_id, organization_id) DO NOTHING;

-- 4. Restore foreign keys from referencing tables
ALTER TABLE IF EXISTS public.employee_profiles
  DROP CONSTRAINT IF EXISTS employee_profiles_member_id_fkey,
  ADD CONSTRAINT employee_profiles_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.organization_members(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.hazard_occurrences
  DROP CONSTRAINT IF EXISTS hazard_occurrences_reported_by_fkey,
  ADD CONSTRAINT hazard_occurrences_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.organization_members(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.corrective_actions
  DROP CONSTRAINT IF EXISTS corrective_actions_assigned_to_fkey,
  ADD CONSTRAINT corrective_actions_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.organization_members(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.assessment_ai_recommendations
  DROP CONSTRAINT IF EXISTS assessment_ai_recommendations_assigned_to_fkey,
  ADD CONSTRAINT assessment_ai_recommendations_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.organization_members(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.assessment_assignments
  DROP CONSTRAINT IF EXISTS assessment_assignments_member_id_fkey,
  ADD CONSTRAINT assessment_assignments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.organization_members(id) ON DELETE CASCADE;

-- 5. Disable Row Level Security on the new table
ALTER TABLE public.organization_members DISABLE ROW LEVEL SECURITY;
