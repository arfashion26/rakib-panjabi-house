"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  TrendingUp,
  ArrowRight,
  User,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/types";

export default function DashboardOverview() {
  const [profile, setProfile] = React.useState<{
    name: string | null;
    email: string;
    phone: string | null;
  } | null>(null);
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    addresses: 0,
  });
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Fetch profile
        const profileRes = await fetch("/api/dashboard/profile");
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.profile);
        }

        // Fetch orders
        const ordersRes = await fetch("/api/dashboard/orders");
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          const orders = ordersData.orders || [];
          const totalSpent = orders.reduce(
            (sum: number, o: any) => sum + Number(o.grand_total),
            0
          );
          setStats({
            totalOrders: orders.length,
            totalSpent,
            wishlistItems: 0,
            addresses: 0,
          });
          setRecentOrders(orders.slice(0, 3));
        }
      } catch {
        // ignore errors
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

  const statCards = [
    {
      label: "Total Orders",
      value: String(stats.totalOrders),
      icon: Package,
      color: "bg-blue-500/10 text-blue-500",
      link: "/dashboard/orders",
    },
    {
      label: "Wishlist Items",
      value: String(stats.wishlistItems),
      icon: Heart,
      color: "bg-red-500/10 text-red-500",
      link: "/dashboard/wishlist",
    },
    {
      label: "Saved Addresses",
      value: String(stats.addresses),
      icon: MapPin,
      color: "bg-green-500/10 text-green-500",
      link: "/dashboard/addresses",
    },
    {
      label: "Total Spent",
      value: formatPrice(stats.totalSpent),
      icon: CreditCard,
      color: "bg-accent/10 text-accent",
      link: "/dashboard/orders",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back{profile?.name ? `, ${profile.name}` : ""}! Here&apos;s your account summary.
        </p>
      </div>

      {/* Profile info card */}
      {profile && (
        <div className="mb-6 rounded-lg border border-border/60 bg-background p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{profile.name || "Customer"}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {profile.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {profile.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
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
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block rounded-lg border border-border/60 bg-background p-4 transition-colors hover:border-accent/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-accent">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.placed_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.grand_total)}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
