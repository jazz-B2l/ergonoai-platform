import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opsagtciuyunlkcllydg.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wc2FndGNpdXl1bmxrY2xseWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzQxODksImV4cCI6MjA5OTU1MDE4OX0.lI1-avdtSEqDqzmuPIyVmui_oezP8KxCQUcfU9asBu4'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
