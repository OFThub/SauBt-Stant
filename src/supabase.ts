import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// .env.local yoksa null: çevrimdışı sayfalar (meydan okuma, kişilik testi) yine çalışır.
export const supabase = url && key ? createClient(url, key) : null
