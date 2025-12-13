import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://zclkzyjvjpobwmzoyyjr.supabase.co'
const supabaseKey = 'sb_publishable_oToRvXhsN-8ZFDuFhoODIA_lGWI0j0W'

export const supabase =  createClient(supabaseUrl, supabaseKey)