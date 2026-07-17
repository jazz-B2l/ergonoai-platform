import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabase } from '../lib/supabase';

async function listResponses() {
  console.log('--- FETCHING ASSESSMENT RESPONSES FROM SUPABASE ---');

  // Fetch responses
  const { data: responses, error } = await supabase
    .from('assessment_responses')
    .select(`
      id,
      completion_percentage,
      ai_risk_score,
      submitted_at,
      assessment_assignments(
        id,
        member_id,
        organization_members(
          id,
          job_title,
          profiles!organization_members_profile_id_fkey(
            id,
            first_name,
            last_name
          )
        )
      )
    `)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching responses:', error);
    return;
  }

  if (!responses || responses.length === 0) {
    console.log('No assessment responses found. Complete a questionnaire in the employee workspace first.');
    return;
  }

  console.log(`Found ${responses.length} responses:\n`);
  responses.forEach((r: any) => {
    const member = r.assessment_assignments?.organization_members;
    const profile = member?.profiles;
    const name = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown Employee';
    const title = member?.job_title || 'N/A';
    
    console.log(`[Response ID]: ${r.id}`);
    console.log(`  Employee: ${name} (${title})`);
    console.log(`  Completed: ${r.completion_percentage}%`);
    console.log(`  AI Risk Score: ${r.ai_risk_score || 'Not analyzed yet'}`);
    console.log(`  Submitted At: ${r.submitted_at ? new Date(r.submitted_at).toLocaleString() : 'Not submitted'}`);
    console.log('--------------------------------------------------');
  });
}

listResponses();
