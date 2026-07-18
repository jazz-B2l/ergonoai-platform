const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const userId = '9e5941d3-6566-4163-9257-0d7dfda49e11'; // User ID from logs
  
  const { data: memberData, error: memberError } = await supabase
    .from('organization_members')
    .select('*')
    .eq('profile_id', userId);

  console.log('Member records for user:', memberData);
  console.log('Error:', memberError);
}

run();
