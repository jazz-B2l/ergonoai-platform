-- Copy data from duplicate columns (added in update_organization_schema) to original city/country columns
UPDATE public.organizations 
SET 
  city = COALESCE(city, district),
  country = COALESCE(country, wilaya);

-- Drop the duplicate columns district and wilaya
ALTER TABLE public.organizations DROP COLUMN IF EXISTS district;
ALTER TABLE public.organizations DROP COLUMN IF EXISTS wilaya;

-- Rename city to district
ALTER TABLE public.organizations RENAME COLUMN city TO district;

-- Rename country to wilaya
ALTER TABLE public.organizations RENAME COLUMN country TO wilaya;

-- Drop NOT NULL constraint on wilaya (previously country, which was NOT NULL)
ALTER TABLE public.organizations ALTER COLUMN wilaya DROP NOT NULL;
