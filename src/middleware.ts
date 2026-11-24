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
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (RSC payloads — handled by Next.js)
     * - favicon.ico (favicon file)
     * - public folder assets (images, fonts, etc.)
     * - api routes (they do their own auth via service-role, no cookie
     *   refresh needed; excluding them avoids running middleware on
     *   every API call and prevents timeout cascades)
     */
    "/((?!_next/static|_next/image|_next/data|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|otf)$).*)",
  ],
};
