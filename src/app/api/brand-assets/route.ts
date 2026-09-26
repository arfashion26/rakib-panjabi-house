import { NextResponse } from "next/server";
import { getBrandAssets } from "@/lib/services/settings";

/**
 * GET /api/brand-assets
 * Public endpoint — returns the brand logo URL and favicon URL.
 * Used by client-side Logo component and other places that need
 * to know the current brand logo without exposing admin auth.
 *
 * Falls back to /logo.jpg and /favicon.ico if no custom logo set.
 *
 * Cache: 1 hour at CDN, 1 hour in browser. Logo rarely changes,
 * so aggressive caching is safe and reduces DB hits significantly.
 */
export async function GET() {
  try {
    const assets = await getBrandAssets();
    return NextResponse.json(
      { success: true, ...assets },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: true,
        logoUrl: "/logo.jpg",
        faviconUrl: "/favicon.ico",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }
}
