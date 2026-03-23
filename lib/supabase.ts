import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Browser client for Supabase. Use for client-side operations including Realtime.
 * Returns null if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.
 */
export function getSupabaseBrowser() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}
