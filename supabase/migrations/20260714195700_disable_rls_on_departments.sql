-- Disable row level security on departments table to prevent 42501 RLS policy violations
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
