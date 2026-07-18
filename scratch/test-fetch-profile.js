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
  const testUserId = '83bd5db6-b573-4c76-915c-d11dcfe5eb2e'; // HR user ID
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', testUserId)
    .single();

  console.log('Profile data:', data);
  console.log('Profile error:', error);
}

run();
