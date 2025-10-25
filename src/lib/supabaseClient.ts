import { createClient } from '@supabase/supabase-js';

// Read from Vite env vars. Ensure these are set in .env/.env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL environment variable is required');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required');
}

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
      // Add aggressive timeout to prevent hanging
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
  },
});



