/**
 * Supabase client configuration
 *
 * Set these two env vars in your .env file:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your-anon-key
 *
 * Until Supabase is connected the app falls back to localStorage (DataContext).
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseKey!)
  : null;
