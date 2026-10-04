import { NextResponse } from "next/server";
import { getBrandAssets } from "@/lib/services/settings";

/**
 * GET /api/brand-assets
 * Public endpoint — returns the brand logo URL, favicon URL, and USD rate.
 * Used by client-side Logo component and the currency toggle.
 *
 * Falls back to /logo.jpg, /favicon.ico, and 110 if not set.
 *
 * Cache: 1 hour at CDN, 1 hour in browser. Logo/rate rarely changes,
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
        usdRate: 110,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }
}
