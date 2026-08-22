import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware that refreshes Supabase auth session on every request.
 * Also protects admin and dashboard routes.
 *
 * IMPORTANT: /admin/login is EXCLUDED from protection —
 * users need to access it without being logged in.
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

  // Refresh the user's session (important for SSR auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Allow /admin/login for everyone (including non-logged-in users)
  if (pathname === "/admin/login") {
    return supabaseResponse;
  }

  // Protect admin routes (EXCEPT /admin/login which is handled above)
  if (pathname.startsWith("/admin")) {
    if (!user) {
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
    if (!user) {
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
     * - favicon.ico (favicon file)
     * - public folder assets
     * - api routes that don't need auth
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
