CREATE TABLE public.assessment_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    template_id UUID NOT NULL
        REFERENCES public.assessment_templates(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    description TEXT,

    display_order INTEGER NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()
);