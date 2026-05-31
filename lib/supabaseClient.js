import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variabel lingkungan Supabase belum dikonfigurasi dengan benar di .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)