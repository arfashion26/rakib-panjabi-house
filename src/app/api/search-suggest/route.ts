import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/search-suggest?q=biomil&limit=6
 * Public endpoint — returns matching products for search autocomplete.
 * Searches by product name (case-insensitive).
 * Returns: { success, products: [{id, name, slug, image, price}] }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const limit = parseInt(searchParams.get("limit") || "6");

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, products: [] });
    }

    const admin = createAdminClient();

    // Search products by name (ilike = case-insensitive)
    const { data, error } = await admin
      .from("products")
      .select("id, name, slug, price")
      .eq("status", "ACTIVE")
      .ilike("name", `%${q}%`)
      .limit(limit);

    if (error) {
      return NextResponse.json({ success: true, products: [] });
    }

    // For each product, fetch its primary image
    const productsWithImages = await Promise.all(
      (data || []).map(async (p) => {
        const { data: img } = await admin
          .from("product_images")
          .select("url")
          .eq("product_id", p.id)
          .order("position", { ascending: true })
          .limit(1)
          .single();
        return {
          ...p,
          image: img?.url || null,
        };
      })
    );

    return NextResponse.json({ success: true, products: productsWithImages });
  } catch {
    return NextResponse.json({ success: true, products: [] });
  }
}
