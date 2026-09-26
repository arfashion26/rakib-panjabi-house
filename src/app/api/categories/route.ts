import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/categories
 * Public endpoint — returns all active categories.
 * Used by Shop mega menu and other public pages.
 *
 * Cache: 1 hour at CDN + 5 min stale-while-revalidate.
 * Categories rarely change, so this is safe to cache aggressively.
 */
export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("categories")
      .select("id, name, slug, description, is_featured, is_active")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, categories: data || [] },
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
