import { NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * GET /api/dashboard/orders
 * Fetch the current logged-in user's orders.
 */
export async function GET() {
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

    const admin = createAdminClient();
    const { data: orders, error } = await admin
      .from("orders")
      .select("id, order_number, placed_at, status, payment_status, grand_total, payment_method")
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
