import { createClient } from '@supabase/supabase-js';

export function createDatabase(env = process.env, fetchImpl) {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY en backend/.env');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    ...(fetchImpl ? { global: { fetch: fetchImpl } } : {}),
  });
}

