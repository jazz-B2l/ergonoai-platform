-- Disable row level security on organization_settings and invite_codes tables to prevent 42501 RLS policy violations
ALTER TABLE public.organization_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes DISABLE ROW LEVEL SECURITY;
