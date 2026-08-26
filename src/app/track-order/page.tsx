"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Home as HomeIcon,
  Loader2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/types";

interface TrackingStep {
  step: string;
  title: string;
  titleBn: string;
  desc: string;
  descBn: string;
  timestamp: string | null;
  done: boolean;
  current?: boolean;
  isCancelled?: boolean;
}

interface OrderData {
  order_number: string;
  status: string;
  payment_status: string;
  grand_total: number;
  currency: string;
  customer_name: string;
  placed_at: string;
  delivered_at: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  shipping_provider: string | null;
  payment_method: string | null;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
    discount_price: number | null;
    selected_size: string | null;
    selected_color: string | null;
  }>;
  timeline: TrackingStep[];
}

const STATUS_LABELS: Record<string, { en: string; bn: string; color: string }> = {
  PENDING: { en: "Pending", bn: "অপেক্ষমাণ", color: "text-orange-600" },
  CONFIRMED: { en: "Confirmed", bn: "কনফার্মড", color: "text-blue-600" },
  PROCESSING: { en: "Processing", bn: "প্রসেসিং", color: "text-blue-600" },
  SHIPPED: { en: "Shipped", bn: "শিপড", color: "text-purple-600" },
  DELIVERED: { en: "Delivered", bn: "ডেলিভার্ড", color: "text-green-600" },
  CANCELLED: { en: "Cancelled", bn: "বাতিল", color: "text-red-600" },
  FAILED: { en: "Failed", bn: "ব্যর্থ", color: "text-red-600" },
  RETURNED: { en: "Returned", bn: "ফেরত", color: "text-orange-600" },
  REFUNDED: { en: "Refunded", bn: "রিফান্ড", color: "text-orange-600" },
};

export default function TrackOrderPage() {
  const { t, locale } = useLanguage();
  const [orderNumber, setOrderNumber] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [order, setOrder] = React.useState<OrderData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(
        `/api/track-order?order=${encodeURIComponent(orderNumber.trim())}`
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Order not found");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getStepIcon(step: string, done: boolean, isCancelled?: boolean) {
    if (isCancelled) return XCircle;
    if (step === "order_placed") return CheckCircle2;
    if (step === "confirmed") return CheckCircle2;
    if (step === "processing") return Package;
    if (step === "shipped") return Truck;
    if (step === "delivered") return HomeIcon;
    if (step === "cancelled") return XCircle;
    return CheckCircle2;
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Package className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
            {t("trackOrder.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("trackOrder.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t("trackOrder.placeholder")}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="h-11"
            />
            <Button type="submit" disabled={loading} className="h-11">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {t("trackOrder.track")}
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <p className="text-sm font-medium text-red-700">{error}</p>
            <p className="mt-1 text-xs text-red-600">
              {locale === "bn"
                ? "অর্ডার নাম্বার চেক করুন অথবা সাপোর্টে যোগাযোগ করুন।"
                : "Please check your order number or contact support."}
            </p>
          </div>
        )}

        {/* Results */}
        {order && (
          <div className="space-y-4">
            {/* Order header */}
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("trackOrder.orderNumber")}
                  </p>
                  <p className="font-serif text-lg font-medium text-accent">
                    {order.order_number}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("trackOrder.currentStatus")}
                  </p>
                  <p
                    className={cn(
                      "font-medium",
                      STATUS_LABELS[order.status]?.color || "text-accent"
                    )}
                  >
                    {STATUS_LABELS[order.status]?.[locale === "bn" ? "bn" : "en"] ||
                      order.status}
                  </p>
                </div>
              </div>

              {/* Order meta */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "bn" ? "অর্ডার তারিখ" : "Order Date"}
                  </p>
                  <p className="font-medium">
                    {new Date(order.placed_at).toLocaleString(locale === "bn" ? "bn-BD" : "en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "bn" ? "মোট" : "Total"}
                  </p>
                  <p className="font-medium">{formatPrice(order.grand_total)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "bn" ? "পেমেন্ট" : "Payment"}
                  </p>
                  <p className="font-medium capitalize">
                    {order.payment_method === "cod"
                      ? locale === "bn"
                        ? "ক্যাশ অন ডেলিভারি"
                        : "Cash on Delivery"
                      : order.payment_method || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "bn" ? "পেমেন্ট স্ট্যাটাস" : "Payment Status"}
                  </p>
                  <p className="font-medium">
                    {order.payment_status === "PAID"
                      ? locale === "bn"
                        ? "পরিশোধিত"
                        : "Paid"
                      : locale === "bn"
                      ? "অপরিশোধিত"
                      : "Unpaid"}
                  </p>
                </div>
              </div>

              {/* Items */}
              {order.items.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {locale === "bn" ? "আইটেম" : "Items"} ({order.items.length})
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground"> × {item.quantity}</span>
                          {(item.selected_size || item.selected_color) && (
                            <span className="text-xs text-muted-foreground">
                              {" "}
                              ({[item.selected_size, item.selected_color].filter(Boolean).join(", ")})
                            </span>
                          )}
                        </div>
                        <span className="font-medium">
                          {formatPrice((item.discount_price ?? item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tracking timeline */}
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <h3 className="mb-4 font-serif text-lg font-medium">
                {locale === "bn" ? "অর্ডার টাইমলাইন" : "Order Timeline"}
              </h3>
              <div className="space-y-6">
                {order.timeline.map((step, idx) => {
                  const Icon = getStepIcon(step.step, step.done, step.isCancelled);
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full border-2",
                            step.isCancelled
                              ? "border-red-500 bg-red-500 text-white"
                              : step.done
                              ? "border-accent bg-accent text-accent-foreground"
                              : step.current
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border bg-background text-muted-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {idx < order.timeline.length - 1 && (
                          <div
                            className={cn(
                              "mt-1 h-12 w-0.5",
                              step.done && !step.isCancelled ? "bg-accent" : "bg-border"
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {locale === "bn" ? step.titleBn : step.title}
                          </h4>
                          {step.current && !step.isCancelled && (
                            <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                              <Clock className="h-2.5 w-2.5" />
                              {t("trackOrder.current")}
                            </span>
                          )}
                        </div>
                        {step.timestamp && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(step.timestamp).toLocaleString(
                              locale === "bn" ? "bn-BD" : "en-US",
                              { dateStyle: "medium", timeStyle: "short" }
                            )}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground">
                          {locale === "bn" ? step.descBn : step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tracking number (if shipped) */}
              {order.tracking_number && (
                <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center text-sm">
                  <p className="text-muted-foreground">
                    {t("trackOrder.carrier")}:{" "}
                    <span className="font-medium text-foreground">
                      {order.shipping_provider || "Courier"}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    {t("trackOrder.trackingId")}:{" "}
                    <span className="font-mono text-foreground">{order.tracking_number}</span>
                  </p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-accent hover:underline"
                    >
                      {locale === "bn" ? "কুরিয়ার ওয়েবসাইটে ট্র্যাক করুন →" : "Track on courier website →"}
                    </a>
                  )}
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard">{t("trackOrder.viewFullDetails")}</Link>
            </Button>
          </div>
        )}

        {/* Help */}
        {!order && !error && !loading && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("trackOrder.noOrderNumber")}{" "}
              <Link href="/contact" className="text-accent hover:underline">
                {t("trackOrder.contactSupport")}
              </Link>
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
