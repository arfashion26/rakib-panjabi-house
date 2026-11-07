import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/categories
 * Public endpoint — returns all active categories.
 * Used by Shop mega menu, header navigation, and other public pages.
 *
 * IMPORTANT: This endpoint MUST stay fresh — admin category edits
 * (image, description, name, featured flag, etc.) need to be reflected
 * immediately on the live site. If we cache for an hour, the changes
 * won't appear until the cache expires.
 *
 * Cache strategy:
 *   - force-dynamic: never cached by Next.js server-side
 *   - Cache-Control: no-store — browser fetch also stays fresh
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("categories")
      .select("id, name, slug, description, is_featured, is_active, parent_id, image")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, categories: data || [] },
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
