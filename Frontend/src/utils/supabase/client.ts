import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Missing Supabase environment variables. Please check your .env file.",
      { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey }
    );
  }
  
  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  );
}
