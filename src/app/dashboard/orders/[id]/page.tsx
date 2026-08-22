"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/types";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  // Sample order detail (in production, fetched from database by orderId)
  const order = {
    id: orderId,
    orderNumber: "RPH-260815-12345",
    date: "Aug 15, 2026 — 10:32 AM",
    status: "DELIVERED",
    paymentStatus: "PAID",
    total: 4498,
    subtotal: 4298,
    shipping: 0,
    codCharge: 200,
    paymentMethod: "Cash on Delivery",
    shippingAddress: {
      name: "Tanvir Ahmed",
      phone: "+880 1711-123456",
      address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
    },
    items: [
      {
        id: "1",
        name: "Premium Cotton Panjabi — Emerald",
        sku: "RPH-PAN-001",
        size: "42",
        color: "Emerald",
        quantity: 1,
        price: 1999,
      },
      {
        id: "2",
        name: "Linen Casual Shirt — Sand",
        sku: "RPH-SHT-001",
        size: "L",
        color: "Sand",
        quantity: 1,
        price: 1199,
      },
      {
        id: "3",
        name: "Premium T-Shirt — Heather Grey",
        sku: "RPH-TST-001",
        size: "M",
        color: "Heather Grey",
        quantity: 1,
        price: 599,
      },
    ],
    timeline: [
      { status: "Order Placed", date: "Aug 15, 2026 — 10:32 AM", done: true },
      { status: "Payment Confirmed", date: "Aug 15, 2026 — 11:00 AM", done: true },
      { status: "Processing", date: "Aug 15, 2026 — 2:15 PM", done: true },
      { status: "Shipped", date: "Aug 16, 2026 — 9:00 AM", done: true },
      { status: "Delivered", date: "Aug 18, 2026 — 3:45 PM", done: true },
    ],
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard/orders"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Order Details
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Order #{order.orderNumber} · Placed on {order.date}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
            {order.status}
          </Badge>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: items + timeline */}
        <div className="space-y-6">
          {/* Order items */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Items in Order</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-border/40 pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-serif text-lg font-light text-muted-foreground/40">
                        RPH
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href="#"
                      className="text-sm font-medium hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                    </p>
                    <p className="mt-auto text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Order Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        step.done
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {idx < order.timeline.length - 1 && (
                      <div className="mt-1 h-8 w-0.5 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-medium">{step.status}</p>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary + address */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-accent">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">COD Charge</span>
                <span className="font-medium">{formatPrice(order.codCharge)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-serif text-lg font-medium">
                  {formatPrice(order.total)}
                </span>
              </div>
              <div className="mt-3 rounded-md bg-muted/50 p-2 text-center">
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="text-sm font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-medium">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </h2>
            <div className="text-sm">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
              <p className="mt-2 text-muted-foreground">
                {order.shippingAddress.address}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/track-order">
                <Truck className="mr-2 h-4 w-4" />
                Track Order
              </Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600">
              Request Return
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
