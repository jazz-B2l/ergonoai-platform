import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabase } from '../lib/supabase';

async function main() {
  const { data: campaignsUndefined, error: errUndef } = await supabase
    .from('assessment_campaigns')
    .select('id, title, organization_id')
    .eq('organization_id', undefined as any);

  console.log('Error Undefined:', errUndef);
  console.log('Campaigns count with undefined:', campaignsUndefined?.length || 0);

  const { data: campaignsNull, error: errNull } = await supabase
    .from('assessment_campaigns')
    .select('id, title, organization_id')
    .eq('organization_id', null as any);

  console.log('Error Null:', errNull);
  console.log('Campaigns count with null:', campaignsNull?.length || 0);
}

main();
