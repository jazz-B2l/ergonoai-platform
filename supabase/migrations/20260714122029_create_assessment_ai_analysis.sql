CREATE TABLE public.assessment_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    response_id UUID NOT NULL
        REFERENCES public.assessment_responses(id)
        ON DELETE CASCADE,

    ai_model TEXT NOT NULL,

    ai_model_version TEXT,

    overall_risk_score NUMERIC(5,2),

    risk_level TEXT,

    confidence_score NUMERIC(5,2),

    summary TEXT,

    recommendations TEXT,

    detected_risks JSONB,

    body_part_scores JSONB,

    category_scores JSONB,

    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE(response_id)
);