CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    logo_url TEXT,

    industry TEXT,

    country TEXT NOT NULL,

    city TEXT,

    address TEXT,

    website TEXT,

    employee_count INTEGER DEFAULT 0,

    subscription_plan TEXT NOT NULL DEFAULT 'FREE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);