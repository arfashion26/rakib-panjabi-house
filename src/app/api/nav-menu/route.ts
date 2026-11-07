import { NextResponse } from "next/server";
import { getActiveNavItems } from "@/lib/services/nav-menu";

/**
 * GET /api/nav-menu
 * Public endpoint — returns active nav menu items for the header.
 *
 * IMPORTANT: This endpoint MUST stay fresh — admin nav menu edits and
 * category changes (which feed into the navigation) need to be reflected
 * immediately on the live site.
 *
 * Cache strategy:
 *   - force-dynamic: never cached by Next.js server-side
 *   - Cache-Control: no-store — browser fetch also stays fresh
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const items = await getActiveNavItems();
    return NextResponse.json(
      { success: true, items },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
