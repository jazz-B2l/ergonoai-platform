// Single source of truth for the browser Supabase client.
// Re-exports the singleton from lib/supabase/client.ts so that
// both `import { supabase } from '@/lib/supabase'` and
// `import { createClient } from '@/lib/supabase/client'` share
// the exact same instance and the same session-refresh timer.
export { createClient } from './supabase/client'

import { createClient } from './supabase/client'
export const supabase = createClient()
