-- Populate default platform roles if they don't exist, using WHERE NOT EXISTS to avoid requiring a UNIQUE constraint
INSERT INTO public.roles (name) 
SELECT val.name
FROM (VALUES ('HR'), ('Employee'), ('Safety Officer')) AS val(name)
WHERE NOT EXISTS (
    SELECT 1 FROM public.roles r WHERE r.name = val.name
);
