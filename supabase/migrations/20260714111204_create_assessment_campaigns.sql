CREATE TABLE public.assessment_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL
        REFERENCES public.companies(id)
        ON DELETE CASCADE,

    template_id UUID NOT NULL
        REFERENCES public.assessment_templates(id)
        ON DELETE RESTRICT,

    title TEXT NOT NULL,

    start_date DATE,

    end_date DATE,

    status TEXT NOT NULL DEFAULT 'DRAFT',

    created_by UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT now(),

    updated_at TIMESTAMPTZ DEFAULT now()
);