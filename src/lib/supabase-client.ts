import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shxncijzcgzwjbppcxfa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeG5jaWp6Y2d6d2picHBjeGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Njc2NTcsImV4cCI6MjA5MjE0MzY1N30.KIIS1gOuYvvt-8xojjnv_ipN9EYH4f7za8F2oAvGoQg';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
