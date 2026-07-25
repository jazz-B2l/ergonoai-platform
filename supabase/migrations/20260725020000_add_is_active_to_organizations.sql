-- Add is_active column to organizations to support deactivation/reactivation of accounts
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
