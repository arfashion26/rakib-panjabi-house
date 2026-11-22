"use client";

import * as React from "react";
import {
  Search,
  Eye,
  Trash2,
  Loader2,
  Calendar,
  X,
  Printer,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  CreditCard,
  Truck,
  StickyNote,
  Clock,
} from "lucide-react";
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
import { useLogoUrl } from "@/components/logo";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  discount_price?: number | null;
  total?: number;
  selected_size?: string | null;
  selected_color?: string | null;
  image?: string | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  payment_status: string;
  fulfillment_status?: string;
  payment_method?: string | null;
  grand_total: number;
  subtotal?: number;
  discount_total?: number;
  shipping_total?: number;
  tax_total?: number;
  placed_at: string;
  confirmed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  shipping_address_json?: string;
  billing_address_json?: string | null;
  shipping_method?: string | null;
  tracking_number?: string | null;
  customer_note?: string | null;
  admin_note?: string | null;
  items?: OrderItem[];
}

/** Parsed shipping address shape (stored as JSON string in DB). */
interface ShippingAddress {
  name?: string;
  phone?: string;
  address?: string;
  area?: string;
  city?: string;
  district?: string;
  zip?: string;
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

const areaLabels: Record<string, string> = {
  inside_dhaka: "Inside Dhaka",
  outside_dhaka: "Outside Dhaka",
  dhaka: "Dhaka",
};

/** Safe-parse the shipping_address_json column into an object. */
function parseAddress(raw?: string): ShippingAddress | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

/** Format an ISO timestamp for display; returns "—" if missing. */
function fmtDate(iso?: string | null, withTime = true): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!withTime) return date;
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date}, ${time}`;
  } catch {
    return "—";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [viewOrder, setViewOrder] = React.useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = React.useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Order | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);
      const qs = params.toString();
      const url = qs ? `/api/admin/orders?${qs}` : "/api/admin/orders";
      const res = await fetch(url);
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
  }, [fromDate, toDate]);

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

  function clearDateFilter() {
    setFromDate("");
    setToDate("");
  }
  const hasDateFilter = !!(fromDate || toDate);

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
        if (viewOrder?.id === order.id) {
          setViewOrder({ ...viewOrder, status: newStatus });
        }
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function deleteOrder(order: Order) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders?id=${order.id}`, {
        method: "DELETE",
      });
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
    } finally {
      setDeleting(false);
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
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
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

        {/* Date range filter row */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Date Range:
          </span>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-9 w-[150px]"
            aria-label="From date"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-9 w-[150px]"
            aria-label="To date"
          />
          {hasDateFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9"
              onClick={clearDateFilter}
              title="Clear date filter"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
          {hasDateFilter && (
            <span className="ml-auto text-xs text-muted-foreground">
              Showing {orders.length} order{orders.length === 1 ? "" : "s"} in
              range
            </span>
          )}
        </div>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium">
            {search || statusFilter !== "ALL"
              ? "No orders match your filters"
              : "No orders yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || statusFilter !== "ALL"
              ? "Try different filters"
              : "Orders will appear here when customers place them"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Order #
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total
                  </th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment
                  </th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((order) => {
                  const statusInfo = statusOptions.find(
                    (s) => s.value === order.status
                  );
                  return (
                    <tr key={order.id} className="hover:bg-muted/20">
                      <td className="p-3">
                        <button
                          className="font-medium text-accent-text hover:underline"
                          onClick={() => setViewOrder(order)}
                        >
                          {order.order_number}
                        </button>
                      </td>
                      <td className="p-3">
                        <p className="text-sm font-medium">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer_phone}
                        </p>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {fmtDate(order.placed_at, false)}
                      </td>
                      <td className="p-3 text-right text-sm font-medium">
                        {formatPrice(order.grand_total)}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant="secondary"
                          className={
                            paymentColors[order.payment_status] || "bg-muted"
                          }
                        >
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Select
                          value={order.status}
                          onValueChange={(v) => updateOrderStatus(order, v)}
                        >
                          <SelectTrigger
                            size="sm"
                            className={`w-[130px] border-0 ${statusInfo?.color}`}
                          >
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
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-accent-text"
                            onClick={() => setInvoiceOrder(order)}
                            title="Generate invoice"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => setDeleteConfirm(order)}
                            title="Delete order"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* ===== Order Details Dialog ===== */}
      {viewOrder && (
        <Dialog
          open={!!viewOrder}
          onOpenChange={() => setViewOrder(null)}
        >
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center justify-between gap-2">
                <span>Order {viewOrder.order_number}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      statusOptions.find((s) => s.value === viewOrder.status)
                        ?.color || "bg-muted"
                    }
                  >
                    {viewOrder.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      paymentColors[viewOrder.payment_status] || "bg-muted"
                    }
                  >
                    {viewOrder.payment_status}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Customer + Shipping (two columns on desktop) */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Customer info */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    <User className="h-4 w-4" /> Customer
                  </h3>
                  <dl className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div>
                        <dt className="text-xs text-muted-foreground">Name</dt>
                        <dd className="font-medium">
                          {viewOrder.customer_name}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Phone
                        </dt>
                        <dd className="font-medium">
                          <a
                            href={`tel:${viewOrder.customer_phone}`}
                            className="text-accent-text hover:underline"
                          >
                            {viewOrder.customer_phone}
                          </a>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <dt className="text-xs text-muted-foreground">Email</dt>
                        <dd className="truncate font-medium">
                          {viewOrder.customer_email}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                {/* Shipping address */}
                {(() => {
                  const addr = parseAddress(viewOrder.shipping_address_json);
                  return (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        <MapPin className="h-4 w-4" /> Shipping Address
                      </h3>
                      {addr ? (
                        <div className="space-y-2 text-sm">
                          {addr.name && (
                            <p className="font-medium">{addr.name}</p>
                          )}
                          {addr.phone && (
                            <p className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              <a
                                href={`tel:${addr.phone}`}
                                className="hover:text-accent-text hover:underline"
                              >
                                {addr.phone}
                              </a>
                            </p>
                          )}
                          {addr.address && (
                            <p className="whitespace-pre-line text-foreground">
                              {addr.address}
                            </p>
                          )}
                          {(addr.city || addr.district) && (
                            <p className="text-muted-foreground">
                              {[addr.city, addr.district]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                          {addr.zip && (
                            <p className="text-muted-foreground">
                              ZIP: {addr.zip}
                            </p>
                          )}
                          {addr.area && (
                            <Badge
                              variant="outline"
                              className="mt-1 border-accent/40 text-accent-text"
                            >
                              {areaLabels[addr.area] || addr.area}
                            </Badge>
                          )}
                        </div>
                      ) : viewOrder.shipping_address_json ? (
                        <p className="whitespace-pre-line text-sm text-foreground">
                          {viewOrder.shipping_address_json}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No shipping address on file
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Order meta — placed at, payment, tracking */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Placed
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {fmtDate(viewOrder.placed_at)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" /> Payment
                  </p>
                  <p className="mt-1 text-sm font-medium capitalize">
                    {viewOrder.payment_method || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" /> Shipping Method
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {viewOrder.shipping_method || "Standard"}
                  </p>
                </div>
              </div>

              {/* Order items */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Package className="h-4 w-4" /> Items (
                  {viewOrder.items?.length || 0})
                </h3>
                {viewOrder.items && viewOrder.items.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-border/60">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="p-3 text-left font-medium">Product</th>
                          <th className="p-3 text-center font-medium">Qty</th>
                          <th className="p-3 text-right font-medium">Price</th>
                          <th className="p-3 text-right font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {viewOrder.items.map((item) => {
                          const lineTotal =
                            item.total != null
                              ? item.total
                              : (item.discount_price ?? item.price) *
                                item.quantity;
                          const unitPrice =
                            item.discount_price ?? item.price;
                          const hasDiscount =
                            item.discount_price != null &&
                            item.discount_price < item.price;
                          return (
                            <tr key={item.id}>
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt=""
                                      className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                                    />
                                  ) : null}
                                  <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      SKU: {item.sku}
                                    </p>
                                    {(item.selected_size ||
                                      item.selected_color) && (
                                      <p className="text-xs text-muted-foreground">
                                        {item.selected_size &&
                                          `Size: ${item.selected_size}`}
                                        {item.selected_size &&
                                          item.selected_color &&
                                          " · "}
                                        {item.selected_color &&
                                          `Color: ${item.selected_color}`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center font-medium">
                                {item.quantity}
                              </td>
                              <td className="p-3 text-right">
                                {hasDiscount ? (
                                  <div>
                                    <p className="font-medium text-accent-text">
                                      {formatPrice(unitPrice)}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-through">
                                      {formatPrice(item.price)}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="font-medium">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right font-semibold">
                                {formatPrice(lineTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    No items in this order
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="ml-auto max-w-xs space-y-1.5 text-sm">
                  {viewOrder.subtotal != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(viewOrder.subtotal)}
                      </span>
                    </div>
                  )}
                  {viewOrder.discount_total != null &&
                    viewOrder.discount_total > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Discount</span>
                        <span className="font-medium">
                          −{formatPrice(viewOrder.discount_total)}
                        </span>
                      </div>
                    )}
                  {viewOrder.shipping_total != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {viewOrder.shipping_total > 0
                          ? formatPrice(viewOrder.shipping_total)
                          : "Free"}
                      </span>
                    </div>
                  )}
                  {viewOrder.tax_total != null && viewOrder.tax_total > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">
                        {formatPrice(viewOrder.tax_total)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 text-base">
                    <span className="font-semibold">Grand Total</span>
                    <span className="font-serif font-semibold text-accent-text">
                      {formatPrice(viewOrder.grand_total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes (customer + admin) */}
              {(viewOrder.customer_note || viewOrder.admin_note) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {viewOrder.customer_note && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
                        <StickyNote className="h-3.5 w-3.5" /> Customer Note
                      </p>
                      <p className="mt-1 text-sm text-amber-900">
                        {viewOrder.customer_note}
                      </p>
                    </div>
                  )}
                  {viewOrder.admin_note && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-800">
                        <StickyNote className="h-3.5 w-3.5" /> Admin Note
                      </p>
                      <p className="mt-1 text-sm text-blue-900">
                        {viewOrder.admin_note}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline */}
              <div className="rounded-xl border border-border/60 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Clock className="h-4 w-4" /> Timeline
                </h3>
                <div className="space-y-1.5 text-sm">
                  <TimelineRow label="Order Placed" iso={viewOrder.placed_at} />
                  <TimelineRow
                    label="Confirmed"
                    iso={viewOrder.confirmed_at}
                  />
                  <TimelineRow label="Shipped" iso={viewOrder.shipped_at} />
                  <TimelineRow
                    label="Delivered"
                    iso={viewOrder.delivered_at}
                  />
                  <TimelineRow
                    label="Cancelled"
                    iso={viewOrder.cancelled_at}
                    danger
                  />
                </div>
              </div>

              {/* Status update + invoice */}
              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <span className="text-sm font-medium">Update Status:</span>
                <Select
                  value={viewOrder.status}
                  onValueChange={(v) => updateOrderStatus(viewOrder, v)}
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
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={() => setInvoiceOrder(viewOrder)}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ===== Invoice Dialog (printable) ===== */}
      {invoiceOrder && (
        <InvoiceDialog
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* ===== Delete Confirmation ===== */}
      {deleteConfirm && (
        <Dialog
          open={!!deleteConfirm}
          onOpenChange={() => setDeleteConfirm(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Order?</DialogTitle>
            </DialogHeader>
            <p className="py-4 text-sm text-muted-foreground">
              Are you sure you want to permanently delete order{" "}
              <strong className="text-foreground">
                {deleteConfirm.order_number}
              </strong>
              ? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteOrder(deleteConfirm)}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Order
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/** Single timeline row with a colored dot. */
function TimelineRow({
  label,
  iso,
  danger,
}: {
  label: string;
  iso?: string | null;
  danger?: boolean;
}) {
  const done = !!iso;
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`h-2 w-2 flex-shrink-0 rounded-full ${
          done
            ? danger
              ? "bg-red-500"
              : "bg-green-500"
            : "bg-muted-foreground/30"
        }`}
      />
      <span
        className={`flex-1 ${done ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <span
        className={`text-xs ${done ? "text-foreground" : "text-muted-foreground/60"}`}
      >
        {fmtDate(iso)}
      </span>
    </div>
  );
}

/**
 * Printable invoice dialog.
 * Per user request: invoice contains ONLY the customer's name, phone number
 * and address — plus the order items for reference. The on-screen dialog
 * has a header bar (title + Print button); @media print hides everything
 * except the invoice sheet itself.
 */
function InvoiceDialog({ order, onClose }: { order: Order; onClose: () => void }) {
  const addr = parseAddress(order.shipping_address_json);
  const invoiceRef = React.useRef<HTMLDivElement>(null);
  const logoUrl = useLogoUrl();

  // Customer-facing name/phone/address come from the shipping address (the
  // info the customer gave at checkout); fall back to the order-level
  // snapshot fields if the address JSON is missing.
  const name = addr?.name || order.customer_name || "—";
  const phone = addr?.phone || order.customer_phone || "—";
  const addressLines: string[] = [];
  if (addr?.address) addressLines.push(...addr.address.split("\n"));
  if (addr?.city || addr?.district) {
    addressLines.push(
      [addr?.city, addr?.district].filter(Boolean).join(", ")
    );
  }
  if (addr?.zip) addressLines.push(`ZIP: ${addr.zip}`);
  if (addr?.area) addressLines.push(areaLabels[addr.area] || addr.area);
  if (addressLines.length === 0 && !addr) {
    addressLines.push("No address on file");
  }

  // Delivery charge shown on the invoice. Older orders were saved with
  // shipping_total = 0 even though the charge was folded into grand_total
  // (checkout used to hardcode shippingCost: 0). So we recover the actual
  // charge the customer paid from the totals math:
  //   grand_total = subtotal - discount + shipping + tax
  //   => shipping = grand_total - subtotal + discount - tax
  // We prefer the stored value when it is positive (new, correctly-saved
  // orders) and fall back to the derived value otherwise. The result is 0
  // (rendered as "Free") only for genuinely free orders — gift cards,
  // FREE_SHIPPING coupons, or orders above the free-shipping threshold.
  const derivedShipping = Math.max(
    0,
    order.grand_total -
      (order.subtotal ?? order.grand_total) +
      (order.discount_total ?? 0) -
      (order.tax_total ?? 0)
  );
  const shippingAmount =
    order.shipping_total != null && order.shipping_total > 0
      ? order.shipping_total
      : derivedShipping;

  function handlePrint() {
    const sheet = invoiceRef.current;
    if (!sheet) {
      window.print();
      return;
    }
    // Open the invoice in a fresh window with the app's stylesheets copied
    // over, then print just that window. This sidesteps the Radix Dialog
    // overlay / fixed positioning / CSS cascade that broke the previous
    // in-page print (splitting the invoice across two pages and mangling
    // the table borders). The new window contains ONLY the invoice sheet,
    // so it prints cleanly on a single page.
    const win = window.open("", "_blank", "width=820,height=1000");
    if (!win) {
      toast.error("Please allow pop-ups to print the invoice.");
      return;
    }
    const styles = Array.from(
      document.head.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((n) => n.outerHTML)
      .join("\n");
    win.document.open();
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8" />` +
        `<title>Invoice ${order.order_number}</title>${styles}` +
        `<style>@page{margin:12mm;}html,body{margin:0;padding:0;background:#fff;color:#000;}` +
        `.invoice-sheet{border:none!important;box-shadow:none!important;border-radius:0!important;margin:0!important;}` +
        `</style></head><body>${sheet.outerHTML}</body></html>`
    );
    win.document.close();
    win.focus();
    // Let styles + the logo image settle before invoking the print dialog.
    setTimeout(() => {
      win.print();
      setTimeout(() => win.close(), 300);
    }, 400);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="invoice-dialog max-h-[94vh] overflow-y-auto sm:max-w-2xl">
        {/* Screen-only header (hidden when printing) */}
        <DialogHeader className="invoice-no-print">
          <DialogTitle>Invoice — {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="invoice-no-print mb-3 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>

        {/* ===== Printable invoice sheet ===== */}
        <div
          ref={invoiceRef}
          className="invoice-sheet rounded-lg border border-border bg-white p-6 text-black"
        >
          {/* Invoice header — logo centered at the top, brand + invoice
              meta below it. */}
          <div className="border-b-2 border-black pb-4">
            {/* Logo centered */}
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="alrakib.com"
                className="h-16 w-auto object-contain"
              />
            </div>
            {/* Brand name (left) + invoice meta (right) */}
            <div className="mt-3 flex items-start justify-between">
              <h1 className="font-serif text-2xl font-bold tracking-tight">
                alrakib.com
              </h1>
              <div className="text-right">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                  Invoice
                </h2>
                <p className="text-xs text-gray-600">
                  Order: {order.order_number}
                </p>
                <p className="text-xs text-gray-600">
                  Date: {fmtDate(order.placed_at, false)}
                </p>
              </div>
            </div>
          </div>

          {/* Bill To — ONLY name, phone, address (per user request) */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Bill To
            </p>
            <div className="space-y-1">
              <p className="text-base font-bold">{name}</p>
              <p className="text-sm">Phone: {phone}</p>
              {addressLines.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Address: </span>
                  {addressLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Items table */}
          <div className="mt-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-black text-left text-xs uppercase tracking-wider">
                  <th className="py-2 pr-2 font-bold">Product</th>
                  <th className="py-2 px-2 text-center font-bold">Qty</th>
                  <th className="py-2 px-2 text-right font-bold">Price</th>
                  <th className="py-2 pl-2 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => {
                    const unitPrice = item.discount_price ?? item.price;
                    const lineTotal =
                      item.total != null
                        ? item.total
                        : unitPrice * item.quantity;
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-300 align-top"
                      >
                        <td className="py-2 pr-2">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            SKU: {item.sku}
                            {item.selected_size && ` · Size: ${item.selected_size}`}
                            {item.selected_color && ` · Color: ${item.selected_color}`}
                          </p>
                        </td>
                        <td className="py-2 px-2 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatPrice(unitPrice)}
                        </td>
                        <td className="py-2 pl-2 text-right font-medium">
                          {formatPrice(lineTotal)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-gray-500"
                    >
                      No items
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                {/* Full breakdown: subtotal, discount, delivery charge, tax,
                    then grand total — so the customer can see exactly how the
                    total was reached (including the delivery charge). */}
                {order.subtotal != null && (
                  <tr className="border-t border-gray-300">
                    <td colSpan={3} className="py-2 text-right text-gray-600">
                      Subtotal
                    </td>
                    <td className="py-2 pl-2 text-right">
                      {formatPrice(order.subtotal)}
                    </td>
                  </tr>
                )}
                {order.discount_total != null &&
                  order.discount_total > 0 && (
                    <tr>
                      <td colSpan={3} className="py-2 text-right text-green-700">
                        Discount
                      </td>
                      <td className="py-2 pl-2 text-right text-green-700">
                        −{formatPrice(order.discount_total)}
                      </td>
                    </tr>
                  )}
                {order.shipping_total != null && (
                  <tr>
                    <td colSpan={3} className="py-2 text-right text-gray-600">
                      Delivery Charge
                    </td>
                    <td className="py-2 pl-2 text-right">
                      {shippingAmount > 0
                        ? formatPrice(shippingAmount)
                        : "Free"}
                    </td>
                  </tr>
                )}
                {order.tax_total != null && order.tax_total > 0 && (
                  <tr>
                    <td colSpan={3} className="py-2 text-right text-gray-600">
                      Tax
                    </td>
                    <td className="py-2 pl-2 text-right">
                      {formatPrice(order.tax_total)}
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-black">
                  <td colSpan={3} className="py-3 text-right font-bold">
                    Grand Total
                  </td>
                  <td className="py-3 pl-2 text-right font-serif text-lg font-bold">
                    {formatPrice(order.grand_total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-300 pt-3 text-center">
            <p className="text-xs text-gray-500">
              Thank you for your order! — alrakib.com
            </p>
            <p className="text-xs text-gray-400">
              This is a computer-generated invoice and does not require a
              signature.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
