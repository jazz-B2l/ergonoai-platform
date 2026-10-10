-- ==============================================================================
-- ERGONOAI PLATFORM DATABASE OPTIMIZATION & PERFORMANCE INDEXES
-- Migration: 20260726000000_performance_indexes_and_optimizations.sql
-- ==============================================================================

-- 1. Assessment Campaigns Table Optimization
CREATE INDEX IF NOT EXISTS idx_assessment_campaigns_org_created 
    ON public.assessment_campaigns (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_campaigns_org_status 
    ON public.assessment_campaigns (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_assessment_campaigns_status 
    ON public.assessment_campaigns (status);

-- 2. Assessment Assignments Table Optimization
CREATE INDEX IF NOT EXISTS idx_assessment_assignments_campaign_member 
    ON public.assessment_assignments (campaign_id, member_id);

CREATE INDEX IF NOT EXISTS idx_assessment_assignments_member_status 
    ON public.assessment_assignments (member_id, status);

CREATE INDEX IF NOT EXISTS idx_assessment_assignments_campaign_status 
    ON public.assessment_assignments (campaign_id, status);

-- 3. Assessment Responses Table Optimization
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assignment_completion 
    ON public.assessment_responses (assignment_id, completion_percentage);

CREATE INDEX IF NOT EXISTS idx_assessment_responses_submitted_at 
    ON public.assessment_responses (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_responses_ai_risk_score 
    ON public.assessment_responses (ai_risk_score) 
    WHERE ai_risk_score IS NOT NULL;

-- 4. Response Answers Table Optimization
CREATE INDEX IF NOT EXISTS idx_response_answers_response_id 
    ON public.response_answers (response_id);

CREATE INDEX IF NOT EXISTS idx_response_answers_question_id 
    ON public.response_answers (question_id);

CREATE INDEX IF NOT EXISTS idx_response_answers_composite 
    ON public.response_answers (response_id, question_id);

-- 5. AI Assessment Analysis Table Optimization
CREATE INDEX IF NOT EXISTS idx_assessment_ai_analysis_response_id 
    ON public.assessment_ai_analysis (response_id);

CREATE INDEX IF NOT EXISTS idx_assessment_ai_analysis_risk_level 
    ON public.assessment_ai_analysis (risk_level);

-- 6. AI Assessment Findings Table Optimization
CREATE INDEX IF NOT EXISTS idx_assessment_ai_findings_analysis_id 
    ON public.assessment_ai_findings (analysis_id);

CREATE INDEX IF NOT EXISTS idx_assessment_ai_findings_severity 
    ON public.assessment_ai_findings (severity);

-- 7. AI Assessment Recommendations Table Optimization
CREATE INDEX IF NOT EXISTS idx_assessment_ai_recommendations_analysis_id 
    ON public.assessment_ai_recommendations (analysis_id);

CREATE INDEX IF NOT EXISTS idx_assessment_ai_recommendations_status 
    ON public.assessment_ai_recommendations (status);

CREATE INDEX IF NOT EXISTS idx_assessment_ai_recommendations_priority 
    ON public.assessment_ai_recommendations (priority);

-- 8. Hazard Categories & Hazards Table Optimization
CREATE INDEX IF NOT EXISTS idx_hazard_categories_org 
    ON public.hazard_categories (organization_id);

CREATE INDEX IF NOT EXISTS idx_hazards_category_id 
    ON public.hazards (category_id);

-- 9. Hazard Occurrences Table Optimization
CREATE INDEX IF NOT EXISTS idx_hazard_occurrences_org_status 
    ON public.hazard_occurrences (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_hazard_occurrences_department_id 
    ON public.hazard_occurrences (department_id) 
    WHERE department_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_hazard_occurrences_hazard_id 
    ON public.hazard_occurrences (hazard_id);

-- 10. Organization Members Table Optimization
CREATE INDEX IF NOT EXISTS idx_organization_members_org_profile 
    ON public.organization_members (organization_id, profile_id);

CREATE INDEX IF NOT EXISTS idx_organization_members_org_dept_active 
    ON public.organization_members (organization_id, department_id, is_active);

CREATE INDEX IF NOT EXISTS idx_organization_members_profile_active 
    ON public.organization_members (profile_id, is_active);

-- 11. Departments Table Optimization
CREATE INDEX IF NOT EXISTS idx_departments_organization_id 
    ON public.departments (organization_id, name);

-- 12. Generated Reports Table Optimization
CREATE INDEX IF NOT EXISTS idx_generated_reports_org_created 
    ON public.generated_reports (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generated_reports_type_status 
    ON public.generated_reports (organization_id, type, status);

-- Vacuum and analyze to update planner statistics (optional on self-hosted, ignored on standard supabase)
ANALYZE public.assessment_campaigns;
ANALYZE public.assessment_assignments;
ANALYZE public.assessment_responses;
ANALYZE public.response_answers;
ANALYZE public.organization_members;
ANALYZE public.departments;
