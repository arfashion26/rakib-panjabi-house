"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ChevronRight, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/types";
import { useLanguage } from "@/i18n/language-context";

interface Order {
  id: string;
  order_number: string;
  placed_at: string;
  status: string;
  payment_status: string;
  grand_total: number;
}

const statusColors: Record<string, string> = {
  DELIVERED: "bg-green-500/10 text-green-600",
  SHIPPED: "bg-blue-500/10 text-blue-600",
  PROCESSING: "bg-yellow-500/10 text-yellow-600",
  PENDING: "bg-orange-500/10 text-orange-600",
  CANCELLED: "bg-red-500/10 text-red-600",
};

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/dashboard/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) =>
    o.order_number.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"} placed
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">{t("dashboard.noOrders")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You haven&apos;t placed any orders yet. Start shopping!
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
          {filtered.map((order) => (
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
                      {order.order_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Placed on{" "}
                      {new Date(order.placed_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className={statusColors[order.status] || ""}>
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.grand_total)}</p>
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
