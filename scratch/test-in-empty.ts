import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabase } from '../lib/supabase';

async function main() {
  const { data: hazards, error } = await supabase
    .from('hazards')
    .select('*')
    .in('category_id', []);
  
  console.log('Error:', error);
  console.log('Hazards count with empty array in .in():', hazards?.length || 0);
  if (hazards && hazards.length > 0) {
    console.log('Sample Hazards:', hazards.slice(0, 3));
  }
}

main();
