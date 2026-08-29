"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  TrendingUp,
  Tag,
  Plus,
  Eye,
} from "lucide-react";
import { formatPrice } from "@/lib/types";
import { cn } from "@/lib/utils";

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <p className="text-base font-medium">Dashboard data unavailable</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(data?.totalRevenue || 0),
      icon: DollarSign,
      gradient: "from-green-500/20 to-green-500/5",
      iconBg: "bg-green-500/15 text-green-600",
      link: "/admin/orders",
    },
    {
      label: "Total Orders",
      value: String(data?.totalOrders || 0),
      icon: ShoppingCart,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconBg: "bg-blue-500/15 text-blue-600",
      link: "/admin/orders",
    },
    {
      label: "Customers",
      value: String(data?.totalCustomers || 0),
      icon: Users,
      gradient: "from-purple-500/20 to-purple-500/5",
      iconBg: "bg-purple-500/15 text-purple-600",
      link: "/admin/customers",
    },
    {
      label: "Products",
      value: String(data?.totalProducts || 0),
      icon: Package,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/15 text-accent",
      link: "/admin/products",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-700 border-orange-200",
    CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
    PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    FAILED: "bg-red-100 text-red-700 border-red-200",
  };

  const quickActions = [
    {
      label: "Add Product",
      desc: "Create new product",
      icon: Plus,
      href: "/admin/products",
    },
    {
      label: "View Orders",
      desc: "Process recent orders",
      icon: Eye,
      href: "/admin/orders",
    },
    {
      label: "Manage Coupons",
      desc: "Create discount codes",
      icon: Tag,
      href: "/admin/coupons",
    },
    {
      label: "Homepage",
      desc: "Edit homepage content",
      icon: TrendingUp,
      href: "/admin/homepage",
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Welcome back! Here&apos;s your store overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="group relative overflow-hidden rounded-xl border border-border/60 bg-background p-5 transition-all hover:border-accent/40 hover:shadow-md"
          >
            {/* Gradient backdrop */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-60",
                stat.gradient
              )}
            />
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    stat.iconBg
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-accent" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders — spans 2 columns */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/60 bg-background">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <h2 className="font-serif text-lg font-medium">Recent Orders</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Latest customer orders
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-2">
              {data?.recentOrders && data.recentOrders.length > 0 ? (
                <div className="space-y-1">
                  {data.recentOrders.slice(0, 6).map((order) => (
                    <Link
                      key={order.id}
                      href="/admin/orders"
                      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {order.order_number}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {order.customer_name} · {order.customer_phone}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-semibold text-foreground">
                          {formatPrice(order.grand_total)}
                        </p>
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            statusColors[order.status] ||
                              "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No orders yet</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Orders will appear here once customers start placing them
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <div className="rounded-xl border border-border/60 bg-background">
            <div className="border-b border-border/60 px-6 py-4">
              <h2 className="font-serif text-lg font-medium">Quick Actions</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Common tasks
              </p>
            </div>
            <div className="space-y-1 p-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </div>

          {/* Store status card */}
          <div className="mt-4 overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Store is Live
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your store is accepting orders at alrakib.com
                </p>
                <Link
                  href="/"
                  target="_blank"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  Visit store
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
