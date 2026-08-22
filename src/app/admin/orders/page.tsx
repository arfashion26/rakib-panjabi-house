"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Eye, Trash2, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/types";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  grand_total: number;
  placed_at: string;
  shipping_address_json?: string;
  items?: OrderItem[];
  admin_note?: string;
}

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "bg-orange-100 text-orange-700" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  { value: "PROCESSING", label: "Processing", color: "bg-yellow-100 text-yellow-700" },
  { value: "SHIPPED", label: "Shipped", color: "bg-purple-100 text-purple-700" },
  { value: "DELIVERED", label: "Delivered", color: "bg-green-100 text-green-700" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-700" },
  { value: "RETURNED", label: "Returned", color: "bg-orange-100 text-orange-700" },
];

const paymentColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  UNPAID: "bg-orange-100 text-orange-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REFUNDED: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [viewOrder, setViewOrder] = React.useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Order | null>(null);

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function updateOrderStatus(order: Order, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders?id=${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        loadOrders();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function deleteOrder(order: Order) {
    try {
      const res = await fetch(`/api/admin/orders?id=${order.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order ${order.order_number} deleted`);
        setDeleteConfirm(null);
        loadOrders();
      } else {
        toast.error(data.error || "Failed to delete order");
      }
    } catch {
      toast.error("Failed to delete order");
    }
  }

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

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order #, customer name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium">
            {search || statusFilter !== "ALL" ? "No orders match your filters" : "No orders yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || statusFilter !== "ALL" ? "Try different filters" : "Orders will appear here when customers place them"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order #</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((order) => {
                  const statusInfo = statusOptions.find((s) => s.value === order.status);
                  return (
                    <tr key={order.id} className="hover:bg-muted/20">
                      <td className="p-3">
                        <button
                          className="font-medium text-accent hover:underline"
                          onClick={() => setViewOrder(order)}
                        >
                          {order.order_number}
                        </button>
                      </td>
                      <td className="p-3">
                        <p className="text-sm font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(order.placed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-right text-sm font-medium">
                        {formatPrice(order.grand_total)}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary" className={paymentColors[order.payment_status] || "bg-muted"}>
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Select
                          value={order.status}
                          onValueChange={(v) => updateOrderStatus(order, v)}
                        >
                          <SelectTrigger size="sm" className={`w-[130px] border-0 ${statusInfo?.color}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {["CANCELLED", "FAILED"].includes(order.status) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-500"
                              onClick={() => setDeleteConfirm(order)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Order Dialog */}
      {viewOrder && (
        <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details — {viewOrder.order_number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Customer info */}
              <div className="rounded-lg bg-muted/30 p-4">
                <h3 className="mb-2 text-sm font-semibold">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">{viewOrder.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    <span className="font-medium">{viewOrder.customer_phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{viewOrder.customer_email}</span>
                  </div>
                </div>
                {viewOrder.shipping_address_json && (
                  <div className="mt-2">
                    <span className="text-muted-foreground">Address:</span>{" "}
                    <span className="text-sm">{viewOrder.shipping_address_json}</span>
                  </div>
                )}
              </div>

              {/* Order items */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">Items ({viewOrder.items?.length || 0})</h3>
                {viewOrder.items && viewOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {viewOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-md border border-border/60 p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.sku}
                            {item.selected_size && ` · Size: ${item.selected_size}`}
                            {item.selected_color && ` · Color: ${item.selected_color}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No items in this order</p>
                )}
              </div>

              {/* Totals */}
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-serif text-lg font-medium">
                    {formatPrice(viewOrder.grand_total)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{viewOrder.payment_method || "—"}</span>
                </div>
              </div>

              {/* Status update */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Update Status:</span>
                <Select
                  value={viewOrder.status}
                  onValueChange={(v) => {
                    updateOrderStatus(viewOrder, v);
                    setViewOrder({ ...viewOrder, status: v });
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Order?</DialogTitle>
            </DialogHeader>
            <p className="py-4 text-sm text-muted-foreground">
              Are you sure you want to permanently delete order{" "}
              <strong className="text-foreground">{deleteConfirm.order_number}</strong>?
              This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => deleteOrder(deleteConfirm)}>
                Delete Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
