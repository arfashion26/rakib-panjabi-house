import { NextResponse } from "next/server";
import { getActiveHomepageReviews } from "@/lib/services/homepage-reviews";

/**
 * GET /api/homepage-reviews
 * Public endpoint — returns active homepage reviews for display.
 *
 * Cache: 1 hour at CDN + 5 min stale-while-revalidate.
 * Reviews are admin-curated; safe to cache aggressively.
 */
export async function GET() {
  try {
    const reviews = await getActiveHomepageReviews();
    return NextResponse.json(
      { success: true, reviews },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
