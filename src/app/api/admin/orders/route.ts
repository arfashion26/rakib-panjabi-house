import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

async function verifyAdmin() {
  const supabase = await createServerClientHelper();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(profile.role)) {
    return null;
  }
  return profile;
}

/**
 * GET /api/admin/orders
 * Fetch all orders with items
 */
export async function GET() {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: orders, error } = await admin
      .from("orders")
      .select("*")
      .order("placed_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Fetch order items for all orders
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items } = await admin
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);
        return { ...order, items: items || [] };
      })
    );

    return NextResponse.json({ success: true, orders: ordersWithItems });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders?id=xxx
 * Update order status (status, payment_status, fulfillment_status)
 * Body: { status?, paymentStatus?, fulfillmentStatus?, trackingNumber?, trackingUrl?, adminNote? }
 */
export async function PUT(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });
    }

    const body = await request.json();
    const admin = createAdminClient();

    // Get current order to know what we're updating
    const { data: currentOrder } = await admin
      .from("orders")
      .select("status, payment_status, fulfillment_status")
      .eq("id", orderId)
      .single();

    if (!currentOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (body.status) {
      updateData.status = body.status;
      // Set timestamp based on status
      if (body.status === "CONFIRMED") updateData.confirmed_at = new Date().toISOString();
      if (body.status === "SHIPPED") {
        updateData.shipped_at = new Date().toISOString();
        updateData.fulfillment_status = "SHIPPED";
      }
      if (body.status === "DELIVERED") {
        updateData.delivered_at = new Date().toISOString();
        updateData.fulfillment_status = "DELIVERED";
        updateData.payment_status = "PAID";
        updateData.paid_at = new Date().toISOString();
      }
      if (body.status === "CANCELLED") updateData.cancelled_at = new Date().toISOString();
      if (body.status === "RETURNED") updateData.returned_at = new Date().toISOString();
      if (body.status === "REFUNDED") updateData.refunded_at = new Date().toISOString();
    }
    if (body.paymentStatus) updateData.payment_status = body.paymentStatus;
    if (body.fulfillmentStatus) updateData.fulfillment_status = body.fulfillmentStatus;
    if (body.trackingNumber !== undefined) updateData.tracking_number = body.trackingNumber;
    if (body.trackingUrl !== undefined) updateData.tracking_url = body.trackingUrl;
    if (body.adminNote !== undefined) updateData.admin_note = body.adminNote;

    const { error: updateError } = await admin
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    // Add tracking history entry
    if (body.status) {
      await admin.from("order_tracking_history").insert({
        order_id: orderId,
        status: body.status,
        message: `Status updated to ${body.status} by admin`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/orders?id=xxx
 * Delete an order (only SUPER_ADMIN or ADMIN, and only if status is CANCELLED or FAILED)
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(adminProfile.role)) {
      return NextResponse.json(
        { success: false, error: "Only Super Admin or Admin can delete orders" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Check order status — can only delete cancelled/failed orders
    const { data: order } = await admin
      .from("orders")
      .select("status, order_number")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (!["CANCELLED", "FAILED"].includes(order.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete order with status "${order.status}". Only cancelled or failed orders can be deleted.`,
        },
        { status: 400 }
      );
    }

    // Delete order (cascade will delete items, tracking, transactions)
    const { error } = await admin.from("orders").delete().eq("id", orderId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Order ${order.order_number} deleted` });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
