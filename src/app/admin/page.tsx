"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatPrice } from "@/lib/types";

const stats = [
  {
    label: "Total Revenue",
    value: formatPrice(285400),
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    color: "bg-green-500/10 text-green-600",
  },
  {
    label: "Total Orders",
    value: "1,247",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Total Customers",
    value: "892",
    change: "+5.4%",
    trend: "up" as const,
    icon: Users,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    label: "Products in Stock",
    value: "342",
    change: "-2.1%",
    trend: "down" as const,
    icon: Package,
    color: "bg-orange-500/10 text-orange-600",
  },
];

const recentOrders = [
  { id: "RPH-260822-001", customer: "Tanvir Ahmed", items: 3, total: 4498, status: "PENDING" },
  { id: "RPH-260822-002", customer: "Rakibul Hasan", items: 1, total: 9999, status: "CONFIRMED" },
  { id: "RPH-260822-003", customer: "Imran Khan", items: 2, total: 2799, status: "SHIPPED" },
  { id: "RPH-260822-004", customer: "Sadia Islam", items: 1, total: 1799, status: "DELIVERED" },
  { id: "RPH-260822-005", customer: "Mahmud Hasan", items: 4, total: 7196, status: "PENDING" },
];

const topProducts = [
  { name: "Premium Cotton Panjabi — Emerald", sold: 124, revenue: 247876 },
  { name: "Linen Casual Shirt — Sand", sold: 203, revenue: 241397 },
  { name: "Slim Fit Jeans — Dark Indigo", sold: 256, revenue: 460544 },
  { name: "Premium Oxford Shirt — White", sold: 178, revenue: 249022 },
  { name: "Premium T-Shirt — Heather Grey", sold: 312, revenue: 186888 },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
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
          <div
            key={stat.label}
            className="rounded-lg border border-border/60 bg-background p-4"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 font-serif text-2xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center gap-3 rounded-md border border-border/40 p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{order.id}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.customer} · {order.items} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      statusColors[order.status] || ""
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium">Top Products</h2>
            <Link
              href="/admin/products"
              className="text-xs text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-md border border-border/40 p-3"
              >
                <span className="font-serif text-lg font-medium text-muted-foreground">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sold} sold
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <h2 className="mb-4 font-serif text-lg font-medium">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/admin/products/new"
            className="rounded-lg border border-border/60 bg-background p-4 text-center transition-colors hover:border-accent/40"
          >
            <Package className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="text-sm font-medium">Add Product</p>
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg border border-border/60 bg-background p-4 text-center transition-colors hover:border-accent/40"
          >
            <ShoppingCart className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="text-sm font-medium">View Orders</p>
          </Link>
          <Link
            href="/admin/customers"
            className="rounded-lg border border-border/60 bg-background p-4 text-center transition-colors hover:border-accent/40"
          >
            <Users className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="text-sm font-medium">Customers</p>
          </Link>
          <Link
            href="/admin/coupons"
            className="rounded-lg border border-border/60 bg-background p-4 text-center transition-colors hover:border-accent/40"
          >
            <TrendingUp className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="text-sm font-medium">Coupons</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
