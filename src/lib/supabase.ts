// ============================================
// Supabase Client Utilities
// ============================================
// Provides typed Supabase clients for server-side and client-side use.
// We use @supabase/ssr for proper Next.js App Router cookie handling.

import { createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://diraphksavgifippktuh.supabase.co";
// Prefer anon key for client-side; fall back to service role only on server
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

/**
 * Browser-side Supabase client.
 * Use this in 'use client' components.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Server-side Supabase client for Server Components, Route Handlers, Server Actions.
 * Reads/writes auth cookies via next/headers.
 */
export async function createServerClientHelper() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Admin Supabase client using service role key (bypasses RLS).
 * ONLY use on the server, never expose to the client.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";
  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
