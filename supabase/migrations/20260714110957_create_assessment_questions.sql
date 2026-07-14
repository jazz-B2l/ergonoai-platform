CREATE TABLE public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    section_id UUID NOT NULL
        REFERENCES public.assessment_sections(id)
        ON DELETE CASCADE,

    question_code TEXT NOT NULL,

    question_text TEXT NOT NULL,

    category TEXT,

    question_type TEXT NOT NULL,

    is_required BOOLEAN DEFAULT TRUE,

    display_order INTEGER NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()
);