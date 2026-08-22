"use client";

import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types";

export default function DashboardOverview() {
  const stats = [
    {
      label: "Total Orders",
      value: "0",
      icon: Package,
      color: "bg-blue-500/10 text-blue-500",
      link: "/dashboard/orders",
    },
    {
      label: "Wishlist Items",
      value: "0",
      icon: Heart,
      color: "bg-red-500/10 text-red-500",
      link: "/dashboard/wishlist",
    },
    {
      label: "Saved Addresses",
      value: "0",
      icon: MapPin,
      color: "bg-green-500/10 text-green-500",
      link: "/dashboard/addresses",
    },
    {
      label: "Total Spent",
      value: formatPrice(0),
      icon: CreditCard,
      color: "bg-accent/10 text-accent",
      link: "/dashboard/orders",
    },
  ];

  const recentOrders = [
    // Empty state — in production this would come from the database
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your account.
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

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-xl font-medium">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/shop"
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-4 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Continue Shopping</p>
              <p className="text-xs text-muted-foreground">Browse new arrivals</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/track-order"
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-4 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Track Order</p>
              <p className="text-xs text-muted-foreground">Check delivery status</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-4 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Account Settings</p>
              <p className="text-xs text-muted-foreground">Update your profile</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center">
            <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm font-medium">No orders yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              When you place your first order, it will appear here.
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Order items would go here */}
          </div>
        )}
      </div>
    </div>
  );
}
