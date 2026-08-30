import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/categories
 * Public endpoint — returns all active categories.
 * Used by Shop mega menu and other public pages.
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

    return NextResponse.json({ success: true, categories: data || [] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
