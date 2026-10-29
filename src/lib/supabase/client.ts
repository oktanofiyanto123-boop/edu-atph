import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials for EduATPH cloud storage
const DEFAULT_SUPABASE_URL = 'https://ngreirksuoraurufzftn.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_Tj16Oq3f9BqbVj35Le-7bQ_avuh1PjD';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_KEY;

let client: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
};

export const getSupabaseConfig = () => {
  return {
    url: supabaseUrl,
    isConfigured: isSupabaseConfigured(),
  };
};
