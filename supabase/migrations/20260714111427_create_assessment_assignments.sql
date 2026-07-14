CREATE TABLE public.assessment_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    campaign_id UUID NOT NULL
        REFERENCES public.assessment_campaigns(id)
        ON DELETE CASCADE,

    member_id UUID NOT NULL
        REFERENCES public.company_members(id)
        ON DELETE CASCADE,

    assigned_at TIMESTAMPTZ DEFAULT now(),

    due_date DATE,

    status TEXT DEFAULT 'PENDING',

    UNIQUE(campaign_id, member_id)
);