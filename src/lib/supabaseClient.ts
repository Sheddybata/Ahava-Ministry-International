import { createClient } from '@supabase/supabase-js';

// Read from Vite env vars. Ensure these are set in .env/.env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is not set');
  throw new Error('VITE_SUPABASE_URL environment variable is required');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not set');
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required');
}

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'faithflow-app',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // Add connection pooling and timeout settings
  fetch: (url, options = {}) => {
    return fetch(url, {
      ...options,
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });
  },
});



