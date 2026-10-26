import { createBrowserClient } from '@supabase/ssr';

function sanitizeSupabaseUrl(url?: string): string {
  if (!url) return '';
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export function createClient() {
  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  return createBrowserClient(url, key);
}
