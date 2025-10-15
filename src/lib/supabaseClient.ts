import { createClient } from '@supabase/supabase-js';

// Read from Vite env vars. Ensure these are set in .env/.env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Ensure a single Supabase client instance (prevents multiple GoTrueClient warnings)
const g: any = globalThis as any;
export const supabase = g.__ff_supabase__ ?? (g.__ff_supabase__ = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'ff-auth-v1',
  },
}));



