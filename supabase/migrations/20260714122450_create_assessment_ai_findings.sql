CREATE TABLE public.assessment_ai_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    analysis_id UUID NOT NULL
        REFERENCES public.assessment_ai_analysis(id)
        ON DELETE CASCADE,

    body_part TEXT,

    category TEXT,

    finding TEXT NOT NULL,

    severity TEXT NOT NULL,

    score NUMERIC(5,2),

    created_at TIMESTAMPTZ DEFAULT now()
);