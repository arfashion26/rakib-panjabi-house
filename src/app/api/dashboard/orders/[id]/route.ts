import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * GET /api/dashboard/orders/[id]
 * Fetch a specific order with items — only for the current user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClientHelper();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    const admin = createAdminClient();

    // Fetch order — MUST belong to current user
    const { data: order, error } = await admin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id) // Security: only own orders
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Fetch order items
    const { data: items } = await admin
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    return NextResponse.json({
      success: true,
      order: { ...order, items: items || [] },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
