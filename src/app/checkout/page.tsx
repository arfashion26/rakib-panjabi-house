"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  CreditCard,
  Lock,
  Loader2,
  ShoppingBag,
  ArrowRight,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/lib/store";
import { placeOrder } from "@/lib/services/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Container } from "@/components/layout/container";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// No shipping charge — only COD charge based on area
const COD_CHARGES = {
  inside_dhaka: 70,
  outside_dhaka: 120,
};
// No free shipping threshold — shipping is always free

// Payment methods (in production, these would come from admin settings)
// Admin can enable/disable these in /admin/settings → Payment Methods
const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Cash on Delivery",
    desc: "Pay with cash when you receive your order",
    icon: "💵",
    enabled: true,
    alwaysShow: true,
  },
  {
    id: "bkash",
    name: "bKash",
    desc: "Pay with your bKash account",
    icon: "📱",
    enabled: true, // admin can disable
  },
  {
    id: "nagad",
    name: "Nagad",
    desc: "Pay with your Nagad account",
    icon: "📱",
    enabled: true, // admin can disable
  },
  {
    id: "rocket",
    name: "Rocket",
    desc: "Pay with your Rocket account",
    icon: "📱",
    enabled: false, // admin can disable
  },
  {
    id: "sslcommerz",
    name: "Card Payment (SSLCommerz)",
    desc: "Visa, Mastercard, Amex",
    icon: "💳",
    enabled: true, // admin can disable
  },
  {
    id: "stripe",
    name: "International Card (Stripe)",
    desc: "For international customers",
    icon: "🌍",
    enabled: false, // admin can disable
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [processing, setProcessing] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [confirmationData, setConfirmationData] = React.useState({
    orderNumber: "",
    phone: "",
    isNewUser: false,
  });

  // Form state — simplified: name, address, phone, area, payment
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    address: "",
    area: "inside_dhaka" as "inside_dhaka" | "outside_dhaka",
    payment: "cod",
    note: "",
  });

  const subtotal = getSubtotal();
  const shippingCost = 0; // No shipping charge — always free
  const codCharge = form.payment === "cod" ? COD_CHARGES[form.area] : 0;
  const total = subtotal + shippingCost + codCharge;

  // Available payment methods (filtered by admin-enabled)
  const availablePayments = PAYMENT_METHODS.filter((p) => p.enabled);

  // Redirect to cart if empty
  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!form.address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }
    return true;
  }

  async function placeOrderHandler() {
    if (!validate()) return;

    setProcessing(true);
    try {
      const result = await placeOrder({
        name: form.name,
        phone: form.phone,
        address: form.address,
        area: form.area,
        payment: form.payment,
        note: form.note,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          price: item.price,
          discountPrice: item.discountPrice,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        subtotal,
        shippingCost,
        codCharge,
        total,
      });

      setProcessing(false);

      if (result.success) {
        clearCart();
        // Show confirmation popup (no redirect — stay on page)
        setConfirmationData({
          orderNumber: result.orderNumber || "",
          phone: form.phone,
          isNewUser: result.isNewUser || false,
        });
        setShowConfirmation(true);
        setProcessing(false);
      } else {
        toast.error(result.error || "Failed to place order. Please try again.");
      }
    } catch (error: any) {
      setProcessing(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/cart" className="hover:text-accent">Cart</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="mb-8 font-serif text-3xl font-medium tracking-tight md:text-4xl">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Delivery Information */}
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
              <MapPin className="h-5 w-5" />
              Delivery Information
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1716-243949"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <textarea
                  id="address"
                  placeholder="House #, Road #, Block, Area, Thana"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={3}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              {/* Area selection */}
              <div className="space-y-2">
                <Label>Delivery Area *</Label>
                <RadioGroup
                  value={form.area}
                  onValueChange={(v) => updateField("area", v as "inside_dhaka" | "outside_dhaka")}
                  className="grid grid-cols-2 gap-3"
                >
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      form.area === "inside_dhaka"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <RadioGroupItem value="inside_dhaka" id="inside_dhaka" />
                    <div>
                      <div className="text-sm font-medium">Inside Dhaka</div>
                      <div className="text-xs text-muted-foreground">
                        COD charge: ৳{COD_CHARGES.inside_dhaka}
                      </div>
                    </div>
                  </label>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      form.area === "outside_dhaka"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <RadioGroupItem value="outside_dhaka" id="outside_dhaka" />
                    <div>
                      <div className="text-sm font-medium">Outside Dhaka</div>
                      <div className="text-xs text-muted-foreground">
                        COD charge: ৳{COD_CHARGES.outside_dhaka}
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Optional note */}
              <div className="space-y-2">
                <Label htmlFor="note">Order Note (optional)</Label>
                <textarea
                  id="note"
                  placeholder="Any special instructions for delivery..."
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </h2>
            <RadioGroup
              value={form.payment}
              onValueChange={(v) => updateField("payment", v)}
              className="space-y-3"
            >
              {availablePayments.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                    form.payment === method.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{method.name}</span>
                      {method.id === "cod" && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{method.desc}</div>
                    {method.id === "cod" && (
                      <div className="mt-1 text-xs text-orange-600">
                        + ৳{COD_CHARGES[form.area]} COD charge
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </RadioGroup>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <Lock className="h-4 w-4 shrink-0" />
              <span>
                Your payment information is processed securely. We do not store
                credit card details.
              </span>
            </div>
          </div>

          {/* Place order button (mobile) */}
          <Button
            onClick={placeOrderHandler}
            disabled={processing}
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 lg:hidden"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Place Order — {formatPrice(total)}
              </>
            )}
          </Button>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
              <ShoppingBag className="h-5 w-5" />
              Order Summary
            </h2>

            {/* Items */}
            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto scrollbar-elegant">
              {items.map((item, idx) => {
                const price = item.discountPrice ?? item.price;
                const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`;
                return (
                  <div key={key} className="flex gap-3">
                    <div
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted"
                      style={{
                        background: item.image
                          ? `url(${item.image}) center/cover`
                          : `linear-gradient(135deg, #f5f5f0, #e5e5e0)`,
                      }}
                    >
                      {!item.image && (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-serif text-xs font-light text-muted-foreground/40">
                            RPH
                          </span>
                        </div>
                      )}
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-muted-foreground">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && " · "}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      )}
                    </div>
                    <span className="self-center text-sm font-medium">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-accent">FREE</span>
              </div>
              {codCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    COD Charge ({form.area === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"})
                  </span>
                  <span className="font-medium">{formatPrice(codCharge)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="font-serif text-2xl font-medium">{formatPrice(total)}</span>
            </div>

            {/* Place order button (desktop) */}
            <Button
              onClick={placeOrderHandler}
              disabled={processing}
              size="lg"
              className="mt-6 hidden w-full bg-accent text-accent-foreground hover:bg-accent/90 lg:flex"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Place Order — {formatPrice(total)}
                </>
              )}
            </Button>

            {/* Trust badges */}
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>100% Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-accent" />
                <span>Fast delivery across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>

          {/* Continue shopping */}
          <Button variant="ghost" className="mt-4 w-full" asChild>
            <Link href="/shop">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </aside>
      </div>

      {/* Order Confirmation Popup */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md overflow-hidden p-0" >
          {/* Gradient header */}
          <div className="relative bg-gradient-to-br from-accent/20 via-accent/5 to-transparent px-6 py-8 text-center">
            <Sparkles className="absolute left-1/4 top-3 h-4 w-4 text-accent/40" />
            <Sparkles className="absolute right-1/4 top-5 h-3 w-3 text-accent/30" />
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                <CheckCircle2 className="h-9 w-9 text-accent-foreground" />
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight">
              Order Confirmed!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thank you! Your order has been placed successfully.
            </p>
          </div>

          {/* Order details */}
          <div className="px-6 py-4">
            {confirmationData.orderNumber && (
              <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Order Number
                </p>
                <p className="mt-1 font-serif text-xl font-bold text-accent">
                  {confirmationData.orderNumber}
                </p>
              </div>
            )}

            {/* New user notice */}
            {confirmationData.isNewUser && (
              <div className="mb-4 rounded-lg border border-accent/20 bg-accent/5 p-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium text-accent">Account Created!</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  We&apos;ve created an account for you. Login with your phone number to track your order.
                </p>
                <div className="mt-2 flex items-center gap-2 rounded bg-background px-3 py-1.5">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{confirmationData.phone}</span>
                </div>
              </div>
            )}

            {/* Next steps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>We&apos;ll call you to confirm the order</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-accent" />
                <span>Delivery in 3-5 business days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-accent" />
                <span>Pay cash when you receive your order</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-border px-6 py-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowConfirmation(false);
                router.push("/shop");
              }}
            >
              Continue Shopping
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowConfirmation(false);
                router.push("/login");
              }}
            >
              Track My Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
