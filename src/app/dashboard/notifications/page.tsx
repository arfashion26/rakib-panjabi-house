"use client";

import { Bell, Check, Package, Heart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: "1",
    type: "order",
    title: "Order Delivered",
    message: "Your order #RPH-260815-12345 has been delivered successfully.",
    time: "2 hours ago",
    read: false,
    icon: Package,
  },
  {
    id: "2",
    type: "promo",
    title: "Flash Sale Alert!",
    message: "Up to 40% off on selected items. Limited time only!",
    time: "1 day ago",
    read: false,
    icon: Tag,
  },
  {
    id: "3",
    type: "wishlist",
    title: "Back in Stock",
    message: "An item in your wishlist is back in stock.",
    time: "2 days ago",
    read: true,
    icon: Heart,
  },
  {
    id: "4",
    type: "order",
    title: "Order Shipped",
    message: "Your order #RPH-260808-67890 is on the way.",
    time: "3 days ago",
    read: true,
    icon: Package,
  },
];

export default function NotificationsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Stay updated on your orders and offers
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/30 ${
              !n.read ? "border-accent/40 bg-accent/5" : "border-border/60"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <n.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{n.title}</p>
                {!n.read && (
                  <span className="h-2 w-2 rounded-full bg-accent" />
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
            </div>
            {!n.read && (
              <Button variant="ghost" size="sm">
                Mark read
              </Button>
            )}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
          <Bell className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No notifications yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            You&apos;ll see updates about your orders and exclusive offers here.
          </p>
        </div>
      )}
    </div>
  );
}
