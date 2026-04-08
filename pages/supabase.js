import { createClient } from '@supabase/supabase-js'

// Replace the text inside quotes with your actual keys from Supabase Settings
const supabaseUrl = 'https://tphjtsqsruunddpdgtdh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaGp0c3FzcnV1bmRkcGRndGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjUzMTAsImV4cCI6MjA5MTIwMTMxMH0.ycONlfwIK0zv-Gjer5JOeVWJ5yykKJiOnnYQgkV0kPg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)