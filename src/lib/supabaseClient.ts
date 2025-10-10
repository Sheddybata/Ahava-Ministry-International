import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmhopsdfmadqltufbmeq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaG9wc2RmbWFkcWx0dWZibWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjkxMDEsImV4cCI6MjA3NTM0NTEwMX0.2oqmo0rXR5xHNBVE1OaiQfICH1Pp3onmG8zrw0aif2A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});



