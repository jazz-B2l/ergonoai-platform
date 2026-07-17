-- Add columns to departments table to support department owner/chef and employee count
ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS employee_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS chef_department TEXT;
