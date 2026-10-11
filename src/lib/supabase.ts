// ============================================
// Supabase Client Utilities
// ============================================
// Provides typed Supabase clients for server-side and client-side use.
// We use @supabase/ssr for proper Next.js App Router cookie handling.

import { createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Hardcoded correct values — do NOT rely on env vars.
// Vercel had wrong SUPABASE_SERVICE_ROLE_KEY (missing 'h' in project ref)
// which caused all admin DB queries to fail silently.
const SUPABASE_URL = "https://diraphksavgifippktuh.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";

/**
 * Browser-side Supabase client.
 * Use this in 'use client' components.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SERVICE_ROLE_KEY);
}

/**
 * Server-side Supabase client for Server Components, Route Handlers, Server Actions.
 * Reads/writes auth cookies via next/headers.
 */
export async function createServerClientHelper() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
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
  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
