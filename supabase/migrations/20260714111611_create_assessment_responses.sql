CREATE TABLE public.assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assignment_id UUID NOT NULL
        REFERENCES public.assessment_assignments(id)
        ON DELETE CASCADE,

    completion_percentage INTEGER DEFAULT 0,

    ai_risk_score NUMERIC(5,2),

    submitted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);