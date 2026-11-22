import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/search-suggest?q=biomil&limit=8
 * Public endpoint — returns matching products for search autocomplete.
 *
 * Searches across name, sku AND search_keywords (case-insensitive),
 * matching the same fields the /shop?q= results page uses, so the
 * dropdown and the results page agree.
 *
 * Returns: { success, products: [{id, name, slug, price, discountPrice, image}] }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const limit = Math.min(parseInt(searchParams.get("limit") || "8") || 8, 12);

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, products: [] });
    }

    const admin = createAdminClient();

    // Match name, sku OR search_keywords — same fields as the shop results
    // page (getProducts in lib/services/products.ts) so suggestions and full
    // results stay consistent.
    const { data, error } = await admin
      .from("products")
      .select("id, name, slug, price, discount_price, search_keywords")
      .eq("status", "ACTIVE")
      .or(
        `name.ilike.%${q}%,sku.ilike.%${q}%,search_keywords.ilike.%${q}%`
      )
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("[search-suggest] query error:", error.message);
      return NextResponse.json({ success: true, products: [] });
    }

    // Fetch primary image for each product in a single pass (one query per
    // product is acceptable at limit ≤ 12; batching with an `in` filter would
    // be one round-trip but PostgREST doesn't guarantee order within `in`).
    const productsWithImages = await Promise.all(
      (data || []).map(async (p) => {
        const { data: img } = await admin
          .from("product_images")
          .select("url")
          .eq("product_id", p.id)
          .order("position", { ascending: true })
          .limit(1)
          .maybeSingle();
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          discountPrice:
            p.discount_price != null ? Number(p.discount_price) : null,
          image: img?.url || null,
        };
      })
    );

    return NextResponse.json({ success: true, products: productsWithImages });
  } catch (e: any) {
    console.error("[search-suggest] fatal:", e?.message);
    return NextResponse.json({ success: true, products: [] });
  }
}
