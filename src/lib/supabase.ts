import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lsfwirvuknxpulhzhbom.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_V26A2a4VB9HRNJ-Jl5xQCg_Lj3-3on6';

export const supabase = createClient(supabaseUrl, supabaseKey)
