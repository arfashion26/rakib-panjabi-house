"use client";

import Link from "next/link";
import { Package, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

// Sample orders (in production, fetched from database)
const sampleOrders = [
  {
    id: "1",
    orderNumber: "RPH-260815-12345",
    date: "Aug 15, 2026",
    status: "DELIVERED",
    total: 4498,
    items: 3,
  },
  {
    id: "2",
    orderNumber: "RPH-260808-67890",
    date: "Aug 8, 2026",
    status: "SHIPPED",
    total: 9999,
    items: 1,
  },
  {
    id: "3",
    orderNumber: "RPH-260801-11111",
    date: "Aug 1, 2026",
    status: "PROCESSING",
    total: 2799,
    items: 2,
  },
];

const statusColors: Record<string, string> = {
  DELIVERED: "bg-green-500/10 text-green-600",
  SHIPPED: "bg-blue-500/10 text-blue-600",
  PROCESSING: "bg-yellow-500/10 text-yellow-600",
  PENDING: "bg-orange-500/10 text-orange-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and track all your orders
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders list */}
      {sampleOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No orders found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sampleOrders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block rounded-lg border border-border/60 bg-background p-4 transition-colors hover:border-accent/40 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-serif text-base font-medium">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Placed on {order.date} · {order.items}{" "}
                      {order.items === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className={statusColors[order.status] || ""}
                  >
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
