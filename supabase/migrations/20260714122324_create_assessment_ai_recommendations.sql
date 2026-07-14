CREATE TABLE public.assessment_ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    analysis_id UUID NOT NULL
        REFERENCES public.assessment_ai_analysis(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    description TEXT NOT NULL,

    priority TEXT NOT NULL,

    category TEXT,

    estimated_impact TEXT,

    status TEXT NOT NULL DEFAULT 'PENDING',

    due_date DATE,

    assigned_to UUID
        REFERENCES public.company_members(id)
        ON DELETE SET NULL,

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);