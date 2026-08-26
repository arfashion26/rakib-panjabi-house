import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/admin/coupons
 * List all coupons.
 */
export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, coupons: data || [] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/coupons
 * Create a new coupon.
 *
 * Body: {
 *   code, description?, type, value, min_order?, max_discount?,
 *   usage_limit?, per_user_limit?, starts_at?, expires_at?, is_active,
 *   first_time_only?
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      description,
      type,
      value,
      min_order,
      max_discount,
      usage_limit,
      per_user_limit = 1,
      starts_at,
      expires_at,
      is_active = true,
      first_time_only = false,
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { success: false, error: "Code, type, and value are required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Check if coupon code already exists
    const { data: existing } = await admin
      .from("coupons")
      .select("id")
      .eq("code", code.toUpperCase().trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A coupon with this code already exists" },
        { status: 400 }
      );
    }

    const { data: coupon, error } = await admin
      .from("coupons")
      .insert({
        code: code.toUpperCase().trim(),
        description: description || null,
        type,
        value: Number(value),
        min_order: min_order ? Number(min_order) : null,
        max_discount: max_discount ? Number(max_discount) : null,
        usage_limit: usage_limit ? Number(usage_limit) : null,
        per_user_limit: Number(per_user_limit),
        starts_at: starts_at || new Date().toISOString(),
        expires_at: expires_at || null,
        is_active: Boolean(is_active),
        first_time_only: Boolean(first_time_only),
        used_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Coupon create error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, coupon });
  } catch (e: any) {
    console.error("Coupon create API error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
