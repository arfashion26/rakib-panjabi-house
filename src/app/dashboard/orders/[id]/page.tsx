"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/types";

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  discount_price: number | null;
  selected_size: string | null;
  selected_color: string | null;
  image: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  grand_total: number;
  subtotal: number;
  shipping_total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address_json: string;
  payment_method: string | null;
  placed_at: string;
  items?: OrderItem[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/dashboard/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium">Order not found</p>
        <Link href="/dashboard/orders" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  let shippingAddress: any = null;
  try {
    shippingAddress = JSON.parse(order.shipping_address_json);
  } catch {}

  return (
    <div>
      <Link href="/dashboard/orders" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Order Details
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Order #{order.order_number} · Placed on{" "}
            {new Date(order.placed_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className={statusColors[order.status] || ""}>
            {order.status}
          </Badge>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            {order.payment_status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: items */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Items in Order</h2>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-serif text-lg font-light text-muted-foreground/40">RPH</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      {(item.selected_size || item.selected_color) && (
                        <p className="text-xs text-muted-foreground">
                          {item.selected_size && `Size: ${item.selected_size}`}
                          {item.selected_size && item.selected_color && " · "}
                          {item.selected_color && `Color: ${item.selected_color}`}
                        </p>
                      )}
                      <p className="mt-auto text-sm font-medium">
                        {formatPrice((item.discount_price || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No items in this order</p>
            )}
          </div>

          {/* Tracking */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Order Timeline</h2>
            <div className="space-y-4">
              {[
                { status: "Order Placed", desc: "Your order has been placed", done: true },
                { status: "Confirmed", desc: "Order confirmed by seller", done: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status) },
                { status: "Processing", desc: "Preparing your items", done: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status) },
                { status: "Shipped", desc: "Out for delivery", done: ["SHIPPED", "DELIVERED"].includes(order.status) },
                { status: "Delivered", desc: "Order delivered", done: order.status === "DELIVERED" },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step.done ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {idx < 4 && <div className="mt-1 h-8 w-0.5 bg-border" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium">{step.status}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary + address */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{formatPrice(order.shipping_total)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-serif text-lg font-medium">{formatPrice(order.grand_total)}</span>
              </div>
              <div className="mt-3 rounded-md bg-muted/50 p-2 text-center">
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="text-sm font-medium">{order.payment_method || "—"}</p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {shippingAddress && (
            <div className="rounded-lg border border-border/60 bg-background p-6">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-medium">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h2>
              <div className="text-sm">
                <p className="font-medium">{shippingAddress.name || order.customer_name}</p>
                <p className="text-muted-foreground">{shippingAddress.phone || order.customer_phone}</p>
                <p className="mt-2 text-muted-foreground">{shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {shippingAddress.area === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                </p>
              </div>
            </div>
          )}

          <Button variant="outline" className="w-full">
            <Package className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
