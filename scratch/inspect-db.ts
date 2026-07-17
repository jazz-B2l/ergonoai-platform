import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabase } from '../lib/supabase';

async function inspect() {
  const orgId = '0d6abdb4-6698-4a29-9569-f730892be9da';
  const { data: depts } = await supabase.from('departments').select('*').eq('organization_id', orgId);
  const { data: campaigns } = await supabase.from('assessment_campaigns').select('*').eq('organization_id', orgId);
  const { data: members } = await supabase.from('organization_members').select('*').eq('organization_id', orgId);
  
  console.log('--- DB INSPECTION FOR HYPROC ---');
  console.log('Departments:', depts);
  console.log('Campaigns:', campaigns);
  console.log('Members count:', members?.length || 0);
}

inspect();
