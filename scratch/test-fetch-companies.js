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
  const testUserId = '83bd5db6-b573-4c76-915c-d11dcfe5eb2e'; // HR user ID from screenshot
  
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      organization_id,
      organizations (*)
    `)
    .eq('profile_id', testUserId)
    .eq('is_active', true);

  console.log('PostgREST response data:', JSON.stringify(data, null, 2));
  console.log('PostgREST error:', error);
  
  if (data) {
    const companies = data.map((item) => item.organizations).filter(Boolean);
    console.log('Mapped companies:', companies);
  }
}

run();
