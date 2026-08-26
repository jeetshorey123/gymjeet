import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ammmgbomtqgprlivgkds.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbW1nYm9tdHFncHJsaXZna2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Mjc5NzUsImV4cCI6MjEwMzMwMzk3NX0.IbgvdIGO9bteDTDDheqvgbCW9AeXi6V8DqsUkvzkrCA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
