import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabase } from '../lib/supabase';

async function testUpdate() {
  console.log('--- TESTING HAZARD OCCURRENCE UPDATE ---');
  
  // 1. Fetch one hazard occurrence
  const { data: occurrences, error: fetchErr } = await supabase
    .from('hazard_occurrences')
    .select('id, status')
    .limit(1);

  if (fetchErr) {
    console.error('Error fetching occurrence:', fetchErr);
    return;
  }

  if (!occurrences || occurrences.length === 0) {
    console.log('No hazard occurrences found to update. Click "Report Test Hazard" in the dashboard first.');
    return;
  }

  const id = occurrences[0].id;
  const currentStatus = occurrences[0].status;
  const nextStatus = currentStatus === 'OPEN' ? 'INVESTIGATING' : 'OPEN';

  console.log(`Attempting to update occurrence ${id} from "${currentStatus}" to "${nextStatus}"...`);

  // 2. Perform update
  const { error: updateErr } = await supabase
    .from('hazard_occurrences')
    .update({ status: nextStatus })
    .eq('id', id);

  if (updateErr) {
    console.error('UPDATE FAILED! Error Details:');
    console.error('  Code:', updateErr.code);
    console.error('  Message:', updateErr.message);
    console.error('  Details:', updateErr.details);
    console.error('  Hint:', updateErr.hint);
  } else {
    console.log('[SUCCESS] Occurrence status updated successfully!');
  }
}

testUpdate();
