CREATE TABLE public.response_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    response_id UUID NOT NULL
        REFERENCES public.assessment_responses(id)
        ON DELETE CASCADE,

    question_id UUID NOT NULL
        REFERENCES public.assessment_questions(id)
        ON DELETE CASCADE,

    selected_option_id UUID
        REFERENCES public.question_options(id)
        ON DELETE SET NULL,

    answer_text TEXT,

    numeric_answer NUMERIC,

    created_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(response_id, question_id)
);