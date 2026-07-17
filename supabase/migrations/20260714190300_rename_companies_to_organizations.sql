-- Rename Tables
ALTER TABLE IF EXISTS public.companies RENAME TO organizations;
ALTER TABLE IF EXISTS public.company_members RENAME TO organization_members;
ALTER TABLE IF EXISTS public.company_settings RENAME TO organization_settings;

-- Rename Columns
-- organization_members
ALTER TABLE IF EXISTS public.organization_members RENAME COLUMN company_id TO organization_id;
-- organization_settings
ALTER TABLE IF EXISTS public.organization_settings RENAME COLUMN company_id TO organization_id;
-- departments
ALTER TABLE IF EXISTS public.departments RENAME COLUMN company_id TO organization_id;
-- sites
ALTER TABLE IF EXISTS public.sites RENAME COLUMN company_id TO organization_id;
-- invite_codes
ALTER TABLE IF EXISTS public.invite_codes RENAME COLUMN company_id TO organization_id;
-- assessment_campaigns
ALTER TABLE IF EXISTS public.assessment_campaigns RENAME COLUMN company_id TO organization_id;
-- workstations
ALTER TABLE IF EXISTS public.workstations RENAME COLUMN company_id TO organization_id;
-- hazard_categories
ALTER TABLE IF EXISTS public.hazard_categories RENAME COLUMN company_id TO organization_id;
-- hazard_occurrences
ALTER TABLE IF EXISTS public.hazard_occurrences RENAME COLUMN company_id TO organization_id;
-- corrective_actions
ALTER TABLE IF EXISTS public.corrective_actions RENAME COLUMN company_id TO organization_id;
-- generated_reports
ALTER TABLE IF EXISTS public.generated_reports RENAME COLUMN company_id TO organization_id;
-- attachments
ALTER TABLE IF EXISTS public.attachments RENAME COLUMN company_id TO organization_id;
-- notifications
ALTER TABLE IF EXISTS public.notifications RENAME COLUMN company_id TO organization_id;
-- audit_logs
ALTER TABLE IF EXISTS public.audit_logs RENAME COLUMN company_id TO organization_id;
-- ai_conversations
ALTER TABLE IF EXISTS public.ai_conversations RENAME COLUMN company_id TO organization_id;
-- risk_snapshots
ALTER TABLE IF EXISTS public.risk_snapshots RENAME COLUMN company_id TO organization_id;
