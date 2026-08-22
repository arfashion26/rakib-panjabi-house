"use client";

import Link from "next/link";
import { Search, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/types";

const orders = [
  { id: "1", number: "RPH-260822-001", customer: "Tanvir Ahmed", email: "tanvir@example.com", date: "Aug 22, 2026", items: 3, total: 4498, status: "PENDING", payment: "UNPAID" },
  { id: "2", number: "RPH-260822-002", customer: "Rakibul Hasan", email: "rakibul@example.com", date: "Aug 22, 2026", items: 1, total: 9999, status: "CONFIRMED", payment: "PAID" },
  { id: "3", number: "RPH-260821-003", customer: "Imran Khan", email: "imran@example.com", date: "Aug 21, 2026", items: 2, total: 2799, status: "SHIPPED", payment: "PAID" },
  { id: "4", number: "RPH-260821-004", customer: "Sadia Islam", email: "sadia@example.com", date: "Aug 21, 2026", items: 1, total: 1799, status: "DELIVERED", payment: "PAID" },
  { id: "5", number: "RPH-260820-005", customer: "Mahmud Hasan", email: "mahmud@example.com", date: "Aug 20, 2026", items: 4, total: 7196, status: "PENDING", payment: "UNPAID" },
  { id: "6", number: "RPH-260820-006", customer: "Nusrat Jahan", email: "nusrat@example.com", date: "Aug 20, 2026", items: 2, total: 3598, status: "CANCELLED", payment: "REFUNDED" },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  UNPAID: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Orders
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {orders.length} orders total
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by order number or customer..." className="pl-10" />
        </div>
        <Button variant="outline">All Status</Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</th>
                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-accent hover:underline">
                      {order.number}
                    </Link>
                  </td>
                  <td className="p-3">
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{order.date}</td>
                  <td className="p-3 text-center text-sm">{order.items}</td>
                  <td className="p-3 text-right text-sm font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary" className={paymentColors[order.payment]}>
                      {order.payment}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary" className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
