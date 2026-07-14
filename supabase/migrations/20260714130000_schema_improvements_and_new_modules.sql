-- Migration: Schema Improvements and New Modules
-- Description: Adds audit fields, soft deletes, explicit foreign keys, and completely defines missing modules.

-- ==========================================
-- 1. ALTER EXISTING TABLES
-- ==========================================

-- Companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Departments
ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Sites
ALTER TABLE public.sites
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Company Members
ALTER TABLE public.company_members
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Assessment Templates (Versioning Support)
ALTER TABLE public.assessment_templates DROP CONSTRAINT IF EXISTS assessment_templates_code_key;
ALTER TABLE public.assessment_templates ADD CONSTRAINT assessment_templates_code_version_key UNIQUE (code, version);
ALTER TABLE public.assessment_templates
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Assessment Campaigns
ALTER TABLE public.assessment_campaigns
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Assessment Assignments
ALTER TABLE public.assessment_assignments DROP CONSTRAINT IF EXISTS assessment_assignments_campaign_id_member_id_key;
ALTER TABLE public.assessment_assignments ALTER COLUMN member_id DROP NOT NULL;
-- Note: workstation_id will be added below after workstations table is created.

-- Assessment AI Analysis (Drop UNIQUE constraint to allow multiple analyses per response)
ALTER TABLE public.assessment_ai_analysis DROP CONSTRAINT IF EXISTS assessment_ai_analysis_response_id_key;

-- Assessment AI Findings (Already exists, but adding an updated_at field if missing)
ALTER TABLE public.assessment_ai_findings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();


-- ==========================================
-- 2. CREATE NEW TABLES
-- ==========================================

-- 2.1 Workstations
CREATE TABLE IF NOT EXISTS public.workstations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    asset_tag TEXT,
    serial_number TEXT,
    manufacturer TEXT,
    model TEXT,
    purchase_date DATE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED')),
    location_notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Complete Assessment Assignments alteration now that Workstations exist
ALTER TABLE public.assessment_assignments 
ADD COLUMN IF NOT EXISTS workstation_id UUID REFERENCES public.workstations(id) ON DELETE CASCADE;

-- We conditionally add the constraint since doing it IF NOT EXISTS is trickier on standard constraints
-- A standard trick is dropping if exists then adding
ALTER TABLE public.assessment_assignments DROP CONSTRAINT IF EXISTS assessment_assignments_target_check;
ALTER TABLE public.assessment_assignments ADD CONSTRAINT assessment_assignments_target_check CHECK (member_id IS NOT NULL OR workstation_id IS NOT NULL);


-- 2.2 Employee Profiles
CREATE TABLE IF NOT EXISTS public.employee_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL UNIQUE REFERENCES public.company_members(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    dominant_hand TEXT CHECK (dominant_hand IN ('LEFT', 'RIGHT', 'AMBIDEXTROUS')),
    extra_characteristics JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Company Settings
CREATE TABLE IF NOT EXISTS public.company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    theme TEXT DEFAULT 'system',
    logo_url TEXT,
    risk_threshold NUMERIC(5,2),
    working_hours_start TIME,
    working_hours_end TIME,
    ai_enabled BOOLEAN DEFAULT TRUE,
    extra_settings JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 2.4 Hazard Categories
CREATE TABLE IF NOT EXISTS public.hazard_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE, -- Null means global default
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Hazards
CREATE TABLE IF NOT EXISTS public.hazards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.hazard_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    default_risk_level TEXT CHECK (default_risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Hazard Occurrences
CREATE TABLE IF NOT EXISTS public.hazard_occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    hazard_id UUID NOT NULL REFERENCES public.hazards(id) ON DELETE RESTRICT,
    site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    workstation_id UUID REFERENCES public.workstations(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES public.company_members(id) ON DELETE SET NULL,
    detected_by TEXT CHECK (detected_by IN ('AI', 'EMPLOYEE', 'MANAGER', 'SAFETY_OFFICER')),
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED')),
    severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.7 Corrective Actions
CREATE TABLE IF NOT EXISTS public.corrective_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Specific explicit relationships for referential integrity
    hazard_occurrence_id UUID REFERENCES public.hazard_occurrences(id) ON DELETE CASCADE,
    assessment_ai_recommendation_id UUID REFERENCES public.assessment_ai_recommendations(id) ON DELETE CASCADE,
    is_manual BOOLEAN NOT NULL DEFAULT FALSE,
    
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES public.company_members(id) ON DELETE SET NULL,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT corrective_actions_source_check CHECK (
        num_nonnulls(hazard_occurrence_id, assessment_ai_recommendation_id) = 1
        OR (is_manual = TRUE AND num_nonnulls(hazard_occurrence_id, assessment_ai_recommendation_id) = 0)
    )
);

-- 2.8 Generated Reports
CREATE TABLE IF NOT EXISTS public.generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    parameters JSONB,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    generation_time_ms INTEGER,
    file_size INTEGER,
    generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.9 Attachments
CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Specific explicit relationships
    assessment_response_id UUID REFERENCES public.assessment_responses(id) ON DELETE CASCADE,
    hazard_occurrence_id UUID REFERENCES public.hazard_occurrences(id) ON DELETE CASCADE,
    corrective_action_id UUID REFERENCES public.corrective_actions(id) ON DELETE CASCADE,
    ai_analysis_id UUID REFERENCES public.assessment_ai_analysis(id) ON DELETE CASCADE,
    generated_report_id UUID REFERENCES public.generated_reports(id) ON DELETE CASCADE,
    
    file_name TEXT NOT NULL,
    file_size INTEGER,
    content_type TEXT,
    storage_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT attachments_entity_check CHECK (
        num_nonnulls(
            assessment_response_id, 
            hazard_occurrence_id, 
            corrective_action_id, 
            ai_analysis_id, 
            generated_report_id
        ) = 1
    )
);

-- 2.10 Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.11 Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.12 AI Conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    context_type TEXT,
    context_id UUID,
    title TEXT,
    last_message_at TIMESTAMPTZ,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.13 AI Messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.14 Risk Snapshots
CREATE TABLE IF NOT EXISTS public.risk_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    average_risk_score NUMERIC(5,2) NOT NULL,
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
