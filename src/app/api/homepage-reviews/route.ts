import { NextResponse } from "next/server";
import { getActiveHomepageReviews } from "@/lib/services/homepage-reviews";

/**
 * GET /api/homepage-reviews
 * Public endpoint — returns active homepage reviews for display.
 */
export async function GET() {
  try {
    const reviews = await getActiveHomepageReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
