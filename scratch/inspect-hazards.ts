import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabase } from '../lib/supabase';

async function inspect() {
  const { data: categories } = await supabase.from('hazard_categories').select('*');
  const { data: hazards } = await supabase.from('hazards').select('*');
  const { data: occurrences } = await supabase.from('hazard_occurrences').select('*');
  
  console.log('--- HAZARD TABLES INSPECTION ---');
  console.log('Categories:', categories);
  console.log('Hazards count:', hazards?.length || 0);
  console.log('Occurrences count:', occurrences?.length || 0);
  if (occurrences && occurrences.length > 0) {
    console.log('Sample Occurrences:', occurrences.slice(0, 3));
  }
}

inspect();
