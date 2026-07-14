CREATE TABLE public.company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    company_id UUID NOT NULL
        REFERENCES public.companies(id)
        ON DELETE CASCADE,

    department_id UUID
        REFERENCES public.departments(id)
        ON DELETE SET NULL,

    site_id UUID
        REFERENCES public.sites(id)
        ON DELETE SET NULL,

    role_id UUID NOT NULL
        REFERENCES public.roles(id)
        ON DELETE RESTRICT,

    job_title TEXT,

    employee_number TEXT,

    employment_type TEXT,

    joined_at DATE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE(profile_id, company_id)
);