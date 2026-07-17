-- Add part-time job flag and additional profile fields to employee_profiles
ALTER TABLE public.employee_profiles
  ADD COLUMN IF NOT EXISTS has_part_time_job BOOLEAN,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS work_position TEXT,
  ADD COLUMN IF NOT EXISTS place_of_birth TEXT,
  ADD COLUMN IF NOT EXISTS marital_status TEXT,
  ADD COLUMN IF NOT EXISTS years_in_role NUMERIC(4,1),
  ADD COLUMN IF NOT EXISTS working_hours_per_day NUMERIC(4,1);
