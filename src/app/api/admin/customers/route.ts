import { NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * GET /api/admin/customers
 * Fetch all users with their order counts and total spent.
 * Returns real data from Supabase.
 */
export async function GET() {
  try {
    // Verify admin
    const supabase = await createServerClientHelper();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (!profile || profile.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(profile.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await admin
      .from("profiles")
      .select("id, email, name, phone, role, status, created_at")
      .order("created_at", { ascending: false });

    if (profilesError) {
      return NextResponse.json(
        { success: false, error: profilesError.message },
        { status: 500 }
      );
    }

    // Fetch order stats per user (order count + total spent)
    const { data: orders } = await admin
      .from("orders")
      .select("user_id, grand_total")
      .not("status", "eq", "CANCELLED");

    // Build a map of user_id -> { order_count, total_spent }
    const orderStats: Record<string, { order_count: number; total_spent: number }> = {};
    if (orders) {
      for (const order of orders) {
        if (order.user_id) {
          if (!orderStats[order.user_id]) {
            orderStats[order.user_id] = { order_count: 0, total_spent: 0 };
          }
          orderStats[order.user_id].order_count++;
          orderStats[order.user_id].total_spent += Number(order.grand_total);
        }
      }
    }

    // Merge order stats into profiles
    const usersWithStats = (profiles || []).map((p) => ({
      ...p,
      order_count: orderStats[p.id]?.order_count || 0,
      total_spent: orderStats[p.id]?.total_spent || 0,
    }));

    return NextResponse.json({
      success: true,
      users: usersWithStats,
    });
  } catch (error: any) {
    console.error("Customers API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
