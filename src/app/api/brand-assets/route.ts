import { NextResponse } from "next/server";
import { getBrandAssets } from "@/lib/services/settings";

/**
 * GET /api/brand-assets
 * Public endpoint — returns the brand logo URL, favicon URL, and USD rate.
 * Used by client-side Logo component and the currency toggle.
 *
 * IMPORTANT: This endpoint MUST stay fresh — admin logo/favicon/rate edits
 * need to be reflected immediately. If we cache for an hour, the new logo
 * won't appear on the live site until the cache expires.
 *
 * Cache strategy:
 *   - force-dynamic: never cached by Next.js server-side
 *   - Cache-Control: no-store — browser fetch also stays fresh
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const assets = await getBrandAssets();
    return NextResponse.json(
      { success: true, ...assets },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: true,
        logoUrl: "/logo.png",
        faviconUrl: "/logo.png",
        usdRate: 110,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  }
}
