import { NextResponse } from "next/server";
import { getActiveNavItems } from "@/lib/services/nav-menu";

/**
 * GET /api/nav-menu
 * Public endpoint — returns active nav menu items for the header.
 *
 * Cache: 1 hour at CDN + 5 min stale-while-revalidate.
 * Menu rarely changes after admin publishes it.
 */
export async function GET() {
  try {
    const items = await getActiveNavItems();
    return NextResponse.json(
      { success: true, items },
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
