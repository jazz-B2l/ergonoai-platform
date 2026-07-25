-- Create admin_settings table to store application-wide admin configurations
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS on admin_settings to allow service-role access (it won't be exposed to public)
ALTER TABLE public.admin_settings DISABLE ROW LEVEL SECURITY;

-- Seed the default admin password
INSERT INTO public.admin_settings (key, value)
VALUES ('admin_password', 'admin123')
ON CONFLICT (key) DO NOTHING;
