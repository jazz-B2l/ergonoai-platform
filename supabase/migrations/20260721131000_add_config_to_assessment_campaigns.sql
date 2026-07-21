-- Add config JSONB column to assessment_campaigns to store custom section order, pause/resume rules, anonymity toggles, and reminder frequencies
ALTER TABLE public.assessment_campaigns
ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{
  "template_id": "full_ergonomic_audit",
  "allow_pause": true,
  "pause_duration_days": 7,
  "anonymous_mode": false,
  "reminder_frequency": "weekly",
  "target_departments": ["all"],
  "sections_order": ["NMQ_summary", "NMQ_detail", "ISO7730", "workstation_setup", "psychosocial_habits"]
}'::jsonb;
