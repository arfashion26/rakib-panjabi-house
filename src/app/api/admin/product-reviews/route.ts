import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

async function verifyAdmin() {
  const supabase = await createServerClientHelper();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();
  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(profile.role)) return null;
  return profile;
}

/**
 * GET /api/admin/product-reviews?status=PENDING
 * List all product reviews (optionally filtered by status).
 */
export async function GET(req: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const status = req.nextUrl.searchParams.get("status");

    let query = admin
      .from("reviews")
      .select(`
        id,
        product_id,
        user_id,
        rating,
        title,
        content,
        status,
        is_verified,
        created_at,
        product:products(name, slug)
      `)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status.toUpperCase());
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Fetch reviewer names from profiles
    const reviewsWithName = await Promise.all(
      (data || []).map(async (review: any) => {
        let reviewerName = "Anonymous";
        if (review.user_id) {
          const { data: profile } = await admin
            .from("profiles")
            .select("name, email, phone")
            .eq("id", review.user_id)
            .maybeSingle();
          if (profile) {
            reviewerName = profile.name || profile.email || profile.phone || "Customer";
          }
        }
        return { ...review, reviewer_name: reviewerName };
      })
    );

    return NextResponse.json({ success: true, reviews: reviewsWithName });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
