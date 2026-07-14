CREATE TABLE public.invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL
        REFERENCES public.companies(id)
        ON DELETE CASCADE,

    role_id UUID NOT NULL
        REFERENCES public.roles(id)
        ON DELETE RESTRICT,

    department_id UUID
        REFERENCES public.departments(id)
        ON DELETE SET NULL,

    site_id UUID
        REFERENCES public.sites(id)
        ON DELETE SET NULL,

    code TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ,

    max_uses INTEGER NOT NULL DEFAULT 1,

    used_count INTEGER NOT NULL DEFAULT 0,

    created_by UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);