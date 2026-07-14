CREATE TABLE public.question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    question_id UUID NOT NULL
        REFERENCES public.assessment_questions(id)
        ON DELETE CASCADE,

    option_text TEXT NOT NULL,

    option_value TEXT,

    score NUMERIC(5,2),

    display_order INTEGER NOT NULL
);