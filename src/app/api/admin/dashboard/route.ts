import { NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * GET /api/admin/dashboard
 * Fetches real dashboard statistics:
 * - Total revenue (from DELIVERED + PAID orders)
 * - Total orders count
 * - Total customers count
 * - Total products count
 * - Recent 5 orders
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

    // Fetch all stats in parallel
    const [ordersRes, customersRes, productsRes, recentOrdersRes] = await Promise.all([
      // Total revenue & orders count
      admin
        .from("orders")
        .select("grand_total, status, payment_status")
        .not("status", "eq", "CANCELLED"),

      // Total customers
      admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "CUSTOMER"),

      // Total products
      admin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("status", "ACTIVE"),

      // Recent 5 orders
      admin
        .from("orders")
        .select("id, order_number, customer_name, customer_phone, grand_total, status, placed_at")
        .order("placed_at", { ascending: false })
        .limit(5),
    ]);

    // Calculate total revenue from paid/delivered orders
    const orders = ordersRes.data || [];
    const totalRevenue = orders
      .filter((o) => o.payment_status === "PAID" || o.status === "DELIVERED")
      .reduce((sum, o) => sum + Number(o.grand_total), 0);

    const totalOrders = orders.length;
    const totalCustomers = customersRes.count || 0;
    const totalProducts = productsRes.count || 0;
    const recentOrders = recentOrdersRes.data || [];

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
