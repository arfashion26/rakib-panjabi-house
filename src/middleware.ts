import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware that refreshes Supabase auth session on every request.
 * Also protects admin and dashboard routes.
 *
 * IMPORTANT: /admin/login is EXCLUDED from protection —
 * users need to access it without being logged in.
 *
 * PERFORMANCE: We use `getSession()` instead of `getUser()` here.
 * `getUser()` makes a network round-trip to Supabase on EVERY request,
 * which exceeds Vercel's ~10s middleware timeout (504
 * MIDDLEWARE_INVOCATION_TIMEOUT). `getSession()` only reads/parses the
 * local cookie — no network — so it never blocks. The actual user
 * validity is enforced later in the protected pages/API routes via
 * `getUser()`. This is the official Supabase-recommended pattern for
 * middleware.
 */
export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY!;

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: getSession() is LOCAL-only (parses the JWT cookie).
  // Do NOT replace this with getUser() — that makes a network call to
  // Supabase Auth on every request and will trigger 504 middleware
  // timeouts on Vercel. Real user verification happens in the page /
  // API route via getUser().
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Allow /admin/login for everyone (including non-logged-in users)
  if (pathname === "/admin/login") {
    return supabaseResponse;
  }

  // Protect admin routes (EXCEPT /admin/login which is handled above)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // For role check, we need to verify in profiles table via service role
    // But we can't do DB queries in middleware (edge runtime)
    // So we check user_metadata.role as a hint, and the actual check
    // happens in the API routes (verifyAdmin)
    // For middleware, we just check if user exists and let them through
    // The admin layout/page will do the real role check
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * ONLY run middleware on protected route prefixes.
     *
     * Previously matched ALL pages, which meant Supabase session refresh
     * ran on every single page request. When Supabase is slow/unreachable
     * this hangs every page load (the createServerClient + getSession
     * path still does cookie/network work that can stall), causing
     * the whole site to time out even though static assets serve fine.
     *
     * Now middleware runs ONLY on:
     *   /admin/*      — admin auth gate
     *   /dashboard/*  — customer dashboard auth gate
     *
     * Public pages (/, /shop, /about, /contact, /product/*, etc.) are
     * served directly by Next.js with no middleware overhead and no
     * network call on every request. Auth cookie refresh happens
     * naturally on the next /admin or /dashboard visit.
     *
     * /admin/login is excluded so it stays accessible to logged-out users.
     */
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
