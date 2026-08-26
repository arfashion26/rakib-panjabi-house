import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * PATCH /api/admin/coupons/[id]
 * Update a coupon (toggle active, change expiry, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const admin = createAdminClient();

    const updateFields: any = {};
    const allowed = [
      "description",
      "type",
      "value",
      "min_order",
      "max_discount",
      "usage_limit",
      "per_user_limit",
      "expires_at",
      "is_active",
      "first_time_only",
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === "is_active" || key === "first_time_only") {
          updateFields[key] = Boolean(body[key]);
        } else if (key === "value" || key === "min_order" || key === "max_discount" || key === "usage_limit" || key === "per_user_limit") {
          updateFields[key] = body[key] === null ? null : Number(body[key]);
        } else {
          updateFields[key] = body[key];
        }
      }
    }
    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await admin
      .from("coupons")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, coupon: data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/coupons/[id]
 * Delete a coupon permanently.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = createAdminClient();

    // First check if the coupon was used in any orders — if so, prevent deletion
    const { count } = await admin
      .from("order_coupons")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", id);

    if ((count || 0) > 0) {
      // Don't delete — just deactivate to preserve history
      const { error } = await admin
        .from("coupons")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        deactivated: true,
        message: "Coupon was used in orders, so it has been deactivated instead of deleted.",
      });
    }

    const { error } = await admin.from("coupons").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
