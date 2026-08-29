import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/track-order?order=RPH-260823-67460
 *
 * Public endpoint — anyone with an order number can track the order.
 * Returns the order status, items, tracking history, and tracking number.
 *
 * Uses the admin client (service role) to bypass RLS, since order tracking
 * must be accessible without authentication (the order number itself is the
 * "secret"). Only public fields are returned.
 */
export async function GET(req: NextRequest) {
  try {
    const orderNumber = req.nextUrl.searchParams.get("order")?.trim();
    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required" },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS (order number is the access token)
    const supabase = createAdminClient();

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        status,
        payment_status,
        fulfillment_status,
        grand_total,
        currency,
        customer_name,
        customer_phone,
        shipping_address_json,
        payment_method,
        tracking_number,
        tracking_url,
        shipping_provider,
        placed_at,
        confirmed_at,
        shipped_at,
        delivered_at,
        cancelled_at
      `
      )
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found. Please check your order number." },
        { status: 404 }
      );
    }

    // Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("name, sku, quantity, price, discount_price, selected_size, selected_color")
      .eq("order_id", order.id);

    // Fetch tracking history
    const { data: history } = await supabase
      .from("order_tracking_history")
      .select("status, message, location, timestamp")
      .eq("order_id", order.id)
      .order("timestamp", { ascending: true });

    const timeline = buildTimeline(order, history || []);

    return NextResponse.json({
      success: true,
      order: {
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        grand_total: Number(order.grand_total),
        currency: order.currency,
        customer_name: order.customer_name,
        placed_at: order.placed_at,
        delivered_at: order.delivered_at,
        tracking_number: order.tracking_number,
        tracking_url: order.tracking_url,
        shipping_provider: order.shipping_provider,
        payment_method: order.payment_method,
        items: items || [],
        timeline,
      },
    });
  } catch (e: any) {
    console.error("Track order API error:", e);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Build a step-by-step tracking timeline based on order status + timestamps.
 */
function buildTimeline(order: any, history: any[]) {
  if (order.status === "CANCELLED" || order.status === "FAILED") {
    return [
      {
        step: "order_placed",
        title: "Order Placed",
        titleBn: "অর্ডার করা হয়েছে",
        desc: `Order placed on ${new Date(order.placed_at).toLocaleString()}`,
        timestamp: order.placed_at,
        done: true,
      },
      {
        step: "cancelled",
        title: "Cancelled",
        titleBn: "বাতিল করা হয়েছে",
        desc: order.status === "CANCELLED" ? "This order was cancelled." : "This order failed.",
        timestamp: order.cancelled_at || null,
        done: true,
        isCancelled: true,
      },
    ];
  }

  const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIdx = Math.max(0, statusOrder.indexOf(order.status));

  const steps = [
    {
      step: "order_placed",
      title: "Order Placed",
      titleBn: "অর্ডার করা হয়েছে",
      desc: "We've received your order",
      descBn: "আমরা আপনার অর্ডার পেয়েছি",
      timestamp: order.placed_at,
      done: true,
    },
    {
      step: "confirmed",
      title: "Confirmed",
      titleBn: "কনফার্মড",
      desc: "Order confirmed by seller",
      descBn: "বিক্রেতা অর্ডার কনফার্ম করেছে",
      timestamp: order.confirmed_at,
      done: currentIdx >= 1 || !!order.confirmed_at,
      current: currentIdx === 0,
    },
    {
      step: "processing",
      title: "Processing",
      titleBn: "প্রসেসিং",
      desc: "Your order is being prepared",
      descBn: "আপনার অর্ডার প্রস্তুত হচ্ছে",
      timestamp: null,
      done: currentIdx >= 2,
      current: currentIdx === 1,
    },
    {
      step: "shipped",
      title: "Shipped",
      titleBn: "শিপড",
      desc: order.shipping_provider
        ? `Out for delivery via ${order.shipping_provider}`
        : "Out for delivery",
      descBn: "ডেলিভারির পথে",
      timestamp: order.shipped_at,
      done: currentIdx >= 3 || !!order.shipped_at,
      current: currentIdx === 2 || currentIdx === 3,
    },
    {
      step: "delivered",
      title: "Delivered",
      titleBn: "ডেলিভার্ড",
      desc: "Order delivered to your address",
      descBn: "অর্ডার আপনার ঠিকানায় পৌঁছে গেছে",
      timestamp: order.delivered_at,
      done: currentIdx >= 4 || !!order.delivered_at,
      current: false,
    },
  ];

  return steps;
}
