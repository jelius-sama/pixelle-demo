import { createBrowserClient as browserClient } from '@supabase/ssr';

export const createBrowserClient = () => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!SUPABASE_KEY || !SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_KEY environment variables are not defined!");

  return browserClient(SUPABASE_URL, SUPABASE_KEY);
};
