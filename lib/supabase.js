import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.POSTGRESV2_NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.POSTGRESV2_NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
