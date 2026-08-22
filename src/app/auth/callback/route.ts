import { NextResponse } from "next/server";
import { createServerClientHelper } from "@/lib/supabase";

/**
 * OAuth callback handler for Supabase auth.
 * Supabase redirects here after Google OAuth completes.
 * We exchange the code for a session and redirect to the original page.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url());
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createServerClientHelper();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the original page (or dashboard)
  return NextResponse.redirect(
    new URL(next, requestUrl.origin)
  );
}
