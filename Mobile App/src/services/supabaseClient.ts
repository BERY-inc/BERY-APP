import { createClient } from '@supabase/supabase-js';

const rawUrl = String((import.meta as any).env?.VITE_SUPABASE_URL ?? '').trim();
const rawAnonKey = String((import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? '').trim();
const rawPublishableKey = String((import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();
const resolvedKey = rawAnonKey || rawPublishableKey;

export const isSupabaseConfigured = Boolean(rawUrl && resolvedKey);

const isDev = !!(import.meta as any).env?.DEV;
if (isDev && rawUrl && !resolvedKey) {
  console.warn('Supabase is disabled: missing VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)');
}
if (isDev && resolvedKey && !rawUrl) {
  console.warn('Supabase is disabled: missing VITE_SUPABASE_URL');
}

export const supabase = isSupabaseConfigured ? createClient(rawUrl, resolvedKey) : null;

export const getStorageUrl = (path: string | undefined | null, bucket: 'profile' | 'product' | 'store' | 'banner' | 'category'): string => {
  if (!path || !isSupabaseConfigured || !supabase) return '';
  if (path.startsWith('http')) return path;
  
  // Clean path - remove leading slashes
  const cleanPath = path.replace(/^\/+/, '');
  
  // Get public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
  return data.publicUrl;
};
