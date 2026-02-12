import { createClient } from '@supabase/supabase-js';

// DeOnde é sistema independente: use SEMPRE um projeto Supabase próprio (variáveis de ambiente).
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'DeOnde: configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env (projeto Supabase novo). ' +
    'Veja .env.example e README.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);