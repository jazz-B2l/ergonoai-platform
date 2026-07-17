-- Disable row level security on organization_members and employee_profiles tables to prevent 42501 RLS policy violations
ALTER TABLE public.organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_profiles DISABLE ROW LEVEL SECURITY;
