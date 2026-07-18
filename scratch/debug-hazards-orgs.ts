import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabase } from '../lib/supabase';

async function main() {
  const { data: members, error } = await supabase
    .from('organization_members')
    .select('*');
  
  console.log('--- MEMBERS ---');
  console.log('Error:', error);
  console.log('Data:', members);
}

main();
