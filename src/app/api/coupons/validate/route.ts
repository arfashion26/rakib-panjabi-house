import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * POST /api/coupons/validate
 *
 * Body: { code: "WELCOME10", subtotal: 1500, userId?: "uuid" }
 *
 * Validates a coupon code and returns the discount amount if valid.
 * This endpoint is public (anyone can validate a coupon before checkout).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal, userId } = body as {
      code: string;
      subtotal: number;
      userId?: string;
    };

    if (!code || !subtotal || subtotal <= 0) {
      return NextResponse.json(
        { success: false, error: "Coupon code and subtotal are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerClientHelper();

    // Fetch the coupon
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .maybeSingle();

    if (error || !coupon) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Check if active
    if (!coupon.is_active) {
      return NextResponse.json(
        { success: false, error: "This coupon is no longer active" },
        { status: 400 }
      );
    }

    // Check date range
    const now = new Date();
    const startsAt = new Date(coupon.starts_at);
    if (now < startsAt) {
      return NextResponse.json(
        { success: false, error: "This coupon is not yet active" },
        { status: 400 }
      );
    }

    if (coupon.expires_at && now > new Date(coupon.expires_at)) {
      return NextResponse.json(
        { success: false, error: "This coupon has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json(
        { success: false, error: "This coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    // Check minimum order
    if (coupon.min_order && subtotal < Number(coupon.min_order)) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount is ৳${Number(coupon.min_order).toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    // Check per-user limit (if userId provided)
    if (userId && coupon.per_user_limit) {
      const { count } = await supabase
        .from("order_coupons")
        .select("*", { count: "exact", head: true })
        .eq("coupon_id", coupon.id)
        .eq("user_id", userId);
      if ((count || 0) >= coupon.per_user_limit) {
        return NextResponse.json(
          { success: false, error: "You have already used this coupon the maximum number of times" },
          { status: 400 }
        );
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = (subtotal * Number(coupon.value)) / 100;
      if (coupon.max_discount && discount > Number(coupon.max_discount)) {
        discount = Number(coupon.max_discount);
      }
    } else if (coupon.type === "FIXED_AMOUNT") {
      discount = Number(coupon.value);
    } else if (coupon.type === "FREE_SHIPPING") {
      // Free shipping — discount = 0 here, but flagged for the order
      discount = 0;
    }

    // Discount cannot exceed the subtotal
    if (discount > subtotal) discount = subtotal;

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        description: coupon.description,
      },
      discount,
      freeShipping: coupon.type === "FREE_SHIPPING",
    });
  } catch (e: any) {
    console.error("Coupon validation error:", e);
    return NextResponse.json(
      { success: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
