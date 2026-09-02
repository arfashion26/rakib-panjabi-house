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
  Tag,
  X,
  Gift,
} from "lucide-react";
import { useCart } from "@/lib/store";
import { placeOrder } from "@/lib/services/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Container } from "@/components/layout/container";
import { formatPrice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/language-context";
import { toast } from "sonner";

// COD charge based on delivery area
const COD_CHARGES = {
  inside_dhaka: 70,
  outside_dhaka: 120,
};

interface PaymentMethod {
  id: string;
  name: string;
  nameBn: string;
  desc: string;
  descBn: string;
  icon: string;
  recommended?: boolean;
  alwaysShow?: boolean;
  enabled: boolean;
}

interface CouponData {
  id: string;
  code: string;
  type: string;
  value: number;
  description: string | null;
  discount: number;
  freeShipping: boolean;
}

interface GiftCardOrder {
  type: "gift_card";
  amount: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const { t, locale } = useLanguage();
  const [processing, setProcessing] = React.useState(false);
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  // Payment methods from API
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([
    {
      id: "cod",
      name: "Cash on Delivery",
      nameBn: "ক্যাশ অন ডেলিভারি",
      desc: "Pay with cash when you receive your order",
      descBn: "অর্ডার পেয়ে টাকা দিন",
      icon: "💵",
      recommended: true,
      alwaysShow: true,
      enabled: true,
    },
  ]);

  // Gift card order (if redirected from /gift-cards)
  const [giftCardOrder, setGiftCardOrder] = React.useState<GiftCardOrder | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = React.useState("");
  const [couponData, setCouponData] = React.useState<CouponData | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);

  // Form state
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    address: "",
    area: "inside_dhaka" as "inside_dhaka" | "outside_dhaka",
    payment: "cod",
    note: "",
  });

  // Load payment methods + gift card order on mount
  React.useEffect(() => {
    // Load gift card order from sessionStorage
    const gc = sessionStorage.getItem("giftCardOrder");
    if (gc) {
      try {
        const parsed = JSON.parse(gc) as GiftCardOrder;
        setGiftCardOrder(parsed);
        // Pre-fill sender name if available
        if (parsed.senderName && parsed.senderName !== "Anonymous") {
          setForm((f) => ({ ...f, name: parsed.senderName }));
        }
      } catch {}
    }

    // Load payment methods from API
    fetch("/api/payment-methods")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.methods?.length > 0) {
          setPaymentMethods(data.methods);
          // If the default payment is not enabled, switch to first enabled
          const enabled = data.methods.filter((m: PaymentMethod) => m.enabled);
          if (enabled.length > 0 && !enabled.find((m: PaymentMethod) => m.id === form.payment)) {
            setForm((f) => ({ ...f, payment: enabled[0].id }));
          }
        }
      })
      .catch(() => {
        // Keep default (COD only)
      });
  }, []);

  const subtotal = giftCardOrder ? giftCardOrder.amount : getSubtotal();
  const couponDiscount = couponData?.discount || 0;
  const codCharge = form.payment === "cod" && !giftCardOrder ? COD_CHARGES[form.area] : 0;
  const total = Math.max(0, subtotal - couponDiscount) + codCharge;

  // Redirect to cart if empty AND no gift card order AND no order was placed
  React.useEffect(() => {
    if (items.length === 0 && !orderPlaced && !giftCardOrder) {
      router.push("/cart");
    }
  }, [items.length, orderPlaced, giftCardOrder, router]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function applyCoupon() {
    if (!couponCode.trim()) {
      toast.error(locale === "bn" ? "কুপন কোড লিখুন" : "Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponData(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        // Merge coupon object + discount + freeShipping into one state object
        setCouponData({
          ...data.coupon,
          discount: data.discount,
          freeShipping: data.freeShipping,
        });
        toast.success(
          locale === "bn"
            ? `কুপন প্রয়োগ হয়েছে! আপনি ${formatPrice(data.discount)} সাশ্রয় করেছেন`
            : `Coupon applied! You saved ${formatPrice(data.discount)}`
        );
      } else {
        toast.error(data.error || "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCouponData(null);
    setCouponCode("");
    toast.success(locale === "bn" ? "কুপন সরানো হয়েছে" : "Coupon removed");
  }

  function validate() {
    if (!form.name.trim()) {
      toast.error(locale === "bn" ? "আপনার নাম লিখুন" : "Please enter your name");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error(locale === "bn" ? "ফোন নাম্বার লিখুন" : "Please enter your phone number");
      return false;
    }
    if (!giftCardOrder && !form.address.trim()) {
      toast.error(locale === "bn" ? "ডেলিভারি ঠিকানা লিখুন" : "Please enter your delivery address");
      return false;
    }
    return true;
  }

  async function placeOrderHandler() {
    if (!validate()) return;

    setProcessing(true);
    try {
      // For gift card orders, items is empty — the order represents the gift card purchase
      const orderItems = giftCardOrder
        ? [
            {
              productId: "gift-card",
              name: `Gift Card (৳${giftCardOrder.amount}) — ${giftCardOrder.recipientName}`,
              slug: "gift-card",
              sku: `GIFT-${giftCardOrder.amount}`,
              price: giftCardOrder.amount,
              discountPrice: null,
              quantity: 1,
              selectedSize: null,
              selectedColor: null,
            },
          ]
        : items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            sku: item.sku,
            price: item.price,
            discountPrice: item.discountPrice,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          }));

      const result = await placeOrder({
        name: form.name,
        phone: form.phone,
        address: giftCardOrder ? `Digital delivery to ${giftCardOrder.recipientEmail}` : form.address,
        area: form.area,
        payment: form.payment,
        note: form.note,
        items: orderItems,
        subtotal,
        shippingCost: 0,
        codCharge,
        total,
        coupon: couponData
          ? {
              id: couponData.id,
              code: couponData.code,
              discount: couponData.discount,
            }
          : null,
        giftCard: giftCardOrder,
      });

      if (result.success) {
        setOrderPlaced(true);
        clearCart();
        // Clear gift card order from sessionStorage
        if (giftCardOrder) {
          sessionStorage.removeItem("giftCardOrder");
        }
        sessionStorage.setItem("lastOrderNumber", result.orderNumber || "");
        sessionStorage.setItem("lastOrderPhone", form.phone);
        sessionStorage.setItem("lastOrderNewUser", String(result.isNewUser || false));
        router.replace("/thank-you");
        return;
      } else {
        setProcessing(false);
        toast.error(result.error || "Failed to place order. Please try again.");
      }
    } catch (error: any) {
      setProcessing(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  // Hide page if cart empty AND no gift card AND no order placed
  if (items.length === 0 && !orderPlaced && !giftCardOrder) {
    return null;
  }

  const isGiftCard = !!giftCardOrder;

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent-text">
          {t("common.home")}
        </Link>
        <span className="mx-1">/</span>
        {isGiftCard ? (
          <Link href="/gift-cards" className="hover:text-accent-text">
            {t("giftCards.title")}
          </Link>
        ) : (
          <Link href="/cart" className="hover:text-accent-text">
            {t("common.cart")}
          </Link>
        )}
        <span className="mx-1">/</span>
        <span className="text-foreground">{t("checkout.title")}</span>
      </nav>

      {/* Gift card banner */}
      {isGiftCard && (
        <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 shrink-0 text-accent-text" />
            <div className="flex-1">
              <p className="text-sm font-medium text-accent-text">
                {locale === "bn" ? "গিফট কার্ড অর্ডার" : "Gift Card Order"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {locale === "bn"
                  ? `প্রাপক: ${giftCardOrder!.recipientName} (${giftCardOrder!.recipientEmail}) · পরিমাণ: ৳${giftCardOrder!.amount}`
                  : `Recipient: ${giftCardOrder!.recipientName} (${giftCardOrder!.recipientEmail}) · Amount: ৳${giftCardOrder!.amount}`}
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm(locale === "bn" ? "গিফট কার্ড অর্ডার বাতিল করবেন?" : "Cancel gift card order?")) {
                  sessionStorage.removeItem("giftCardOrder");
                  setGiftCardOrder(null);
                  router.push("/gift-cards");
                }
              }}
              className="text-xs text-muted-foreground hover:text-red-500"
            >
              {locale === "bn" ? "বাতিল" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      <h1 className="mb-8 font-serif text-3xl font-medium tracking-tight md:text-4xl">
        {t("checkout.title")}
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Delivery Information */}
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
              <MapPin className="h-5 w-5" />
              {t("checkout.deliveryInfo")}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("checkout.fullName")} *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder={locale === "bn" ? "আপনার পুরো নাম" : "Your full name"}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("checkout.phoneNumber")} *</Label>
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

              {/* Hide address for gift card orders (digital delivery) */}
              {!isGiftCard && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t("checkout.deliveryAddress")} *</Label>
                    <textarea
                      id="address"
                      placeholder={
                        locale === "bn"
                          ? "বাড়ি #, রোড #, ব্লক, এরিয়া, থানা"
                          : "House #, Road #, Block, Area, Thana"
                      }
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      rows={3}
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("checkout.deliveryArea")} *</Label>
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
                          <div className="text-sm font-medium">{t("checkout.insideDhaka")}</div>
                          <div className="text-xs text-muted-foreground">
                            COD: ৳{COD_CHARGES.inside_dhaka} · {t("checkout.deliveryInsideDhaka")}
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
                          <div className="text-sm font-medium">{t("checkout.outsideDhaka")}</div>
                          <div className="text-xs text-muted-foreground">
                            COD: ৳{COD_CHARGES.outside_dhaka} · {t("checkout.deliveryOutsideDhaka")}
                          </div>
                        </div>
                      </label>
                    </RadioGroup>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="note">{t("checkout.orderNote")}</Label>
                <textarea
                  id="note"
                  placeholder={t("checkout.orderNotePlaceholder")}
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
              {t("checkout.paymentMethod")}
            </h2>
            <RadioGroup
              value={form.payment}
              onValueChange={(v) => updateField("payment", v)}
              className="space-y-3"
            >
              {paymentMethods.filter((m) => m.enabled).map((method) => (
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
                      <span className="text-sm font-medium">
                        {locale === "bn" ? method.nameBn : method.name}
                      </span>
                      {method.recommended && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          {t("checkout.recommended")}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locale === "bn" ? method.descBn : method.desc}
                    </div>
                    {method.id === "cod" && !isGiftCard && (
                      <div className="mt-1 text-xs text-orange-600">
                        + ৳{COD_CHARGES[form.area]} {t("checkout.codCharge")}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </RadioGroup>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{t("checkout.securePayment")}</span>
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
                {t("checkout.processing")}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {t("checkout.placeOrder")} — {formatPrice(total)}
              </>
            )}
          </Button>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
              <ShoppingBag className="h-5 w-5" />
              {t("checkout.orderSummary")}
            </h2>

            {/* Items */}
            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto scrollbar-elegant">
              {isGiftCard ? (
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-accent/30 to-accent/10">
                    <div className="flex h-full w-full items-center justify-center">
                      <Gift className="h-6 w-6 text-accent-text" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium">
                      {locale === "bn" ? "গিফট কার্ড" : "Gift Card"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {giftCardOrder!.recipientName} ({giftCardOrder!.recipientEmail})
                    </p>
                  </div>
                  <span className="self-center text-sm font-medium">
                    {formatPrice(giftCardOrder!.amount)}
                  </span>
                </div>
              ) : (
                items.map((item, idx) => {
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
                            {item.selectedSize && `${t("productDetail.size")}: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && " · "}
                            {item.selectedColor && `${t("productDetail.color")}: ${item.selectedColor}`}
                          </p>
                        )}
                      </div>
                      <span className="self-center text-sm font-medium">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <Separator className="my-4" />

            {/* Coupon section */}
            <div className="mb-4">
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Tag className="h-3.5 w-3.5" />
                {t("cartPage.promoCode")}
              </label>
              {couponData ? (
                <div className="flex items-center justify-between rounded-md border border-accent/30 bg-accent/10 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-accent-text">{couponData.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("cartPage.youSave").replace("{amount}", formatPrice(couponData.discount))}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={removeCoupon}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder={t("cartPage.couponPlaceholder")}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-10"
                    disabled={couponLoading}
                  />
                  <Button variant="outline" onClick={applyCoupon} disabled={couponLoading}>
                    {couponLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("cartPage.applyCode")
                    )}
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-accent-text">
                  <span>{t("cartPage.discountLabel")}</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              {codCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("checkout.codCharge")} ({form.area === "inside_dhaka" ? t("checkout.insideDhaka") : t("checkout.outsideDhaka")})
                  </span>
                  <span className="font-medium">{formatPrice(codCharge)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-medium">{t("checkout.total")}</span>
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
                  {t("checkout.processing")}
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {t("checkout.placeOrder")} — {formatPrice(total)}
                </>
              )}
            </Button>

            {/* Trust badges */}
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>{t("checkout.trustSecurePayment")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-accent-text" />
                <span>{t("checkout.trustFastDelivery")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>{t("checkout.trustEasyReturns")}</span>
              </div>
            </div>
          </div>

          <Button variant="ghost" className="mt-4 w-full" asChild>
            <Link href={isGiftCard ? "/gift-cards" : "/shop"}>
              {t("cartPage.continueShopping")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </aside>
      </div>
    </Container>
  );
}
