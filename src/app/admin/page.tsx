"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/types";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Failed to load dashboard data");
        }
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">Dashboard data unavailable</p>
        <p className="mt-1 text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(data?.totalRevenue || 0),
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600",
      link: "/admin/orders",
    },
    {
      label: "Total Orders",
      value: String(data?.totalOrders || 0),
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-600",
      link: "/admin/orders",
    },
    {
      label: "Total Customers",
      value: String(data?.totalCustomers || 0),
      icon: Users,
      color: "bg-purple-500/10 text-purple-600",
      link: "/admin/customers",
    },
    {
      label: "Products in Stock",
      value: String(data?.totalProducts || 0),
      icon: Package,
      color: "bg-orange-500/10 text-orange-600",
      link: "/admin/products",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back! Here&apos;s your store overview for today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="group rounded-lg border border-border/60 bg-background p-4 transition-colors hover:border-accent/40"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 font-serif text-2xl font-medium">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-accent hover:underline">
              View all
            </Link>
          </div>
          {data?.recentOrders && data.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders`}
                  className="flex items-center gap-3 rounded-md border border-border/40 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{order.order_number}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.customer_name} · {order.customer_phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.grand_total)}</p>
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No orders yet</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <h2 className="mb-4 font-serif text-lg font-medium">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/products"
              className="rounded-lg border border-border/60 p-4 text-center transition-colors hover:border-accent/40"
            >
              <Package className="mx-auto mb-2 h-6 w-6 text-accent" />
              <p className="text-sm font-medium">Manage Products</p>
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-lg border border-border/60 p-4 text-center transition-colors hover:border-accent/40"
            >
              <ShoppingCart className="mx-auto mb-2 h-6 w-6 text-accent" />
              <p className="text-sm font-medium">View Orders</p>
            </Link>
            <Link
              href="/admin/customers"
              className="rounded-lg border border-border/60 p-4 text-center transition-colors hover:border-accent/40"
            >
              <Users className="mx-auto mb-2 h-6 w-6 text-accent" />
              <p className="text-sm font-medium">Customers</p>
            </Link>
            <Link
              href="/admin/categories"
              className="rounded-lg border border-border/60 p-4 text-center transition-colors hover:border-accent/40"
            >
              <TrendingUp className="mx-auto mb-2 h-6 w-6 text-accent" />
              <p className="text-sm font-medium">Categories</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
