"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  X,
  Truck,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/container";
import { formatPrice } from "@/lib/types";
import { toast } from "sonner";

const FREE_SHIPPING_THRESHOLD = 2000;
const FLAT_SHIPPING = 80;

export default function CartPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCart();
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{
    code: string;
    discount: number;
  } | null>(null);

  const subtotal = getSubtotal();
  const discount = appliedCoupon?.discount ?? 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const total = Math.max(0, subtotal - discount) + shipping;

  function applyCoupon() {
    if (!couponCode.trim()) {
      toast.error(t("common.enterCoupon"));
      return;
    }
    // Demo coupon codes
    const codes: Record<string, number> = {
      WELCOME10: 0.1,
      RAKIB20: 0.2,
      FESTIVE15: 0.15,
    };
    const code = couponCode.toUpperCase();
    if (codes[code]) {
      const discountAmount = Math.round(subtotal * codes[code]);
      setAppliedCoupon({ code, discount: discountAmount });
      toast.success(t("common.couponApplied").replace("{amount}", formatPrice(discountAmount)));
    } else {
      toast.error(t("common.invalidCoupon"));
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success(t("common.couponRemoved"));
  }

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium">{t("cartPage.empty")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("cartPage.emptyDesc")}
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">
              {t("cartPage.continueShopping")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent-text">{t("common.home")}</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{t("common.cart")}</span>
      </nav>

      <h1 className="mb-8 font-serif text-3xl font-medium tracking-tight md:text-4xl">
        {t("cartPage.title")} ({items.length})
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const itemPrice = item.discountPrice ?? item.price;
            const itemTotal = itemPrice * item.quantity;
            const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`;
            return (
              <div
                key={key}
                className="flex gap-4 rounded-lg border border-border/60 bg-card p-4"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:h-32 sm:w-32"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        item.image
                          ? `url(${item.image}) center/cover`
                          : `linear-gradient(135deg, #f5f5f0, #e5e5e0)`,
                    }}
                  />
                  {!item.image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-2xl font-light text-muted-foreground/40">
                        RPH
                      </span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="line-clamp-2 text-sm font-medium hover:text-accent-text sm:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("products.sku")}: {item.sku}
                      </p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.selectedSize && `${t("productDetail.size")}: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && " · "}
                          {item.selectedColor && `${t("productDetail.color")}: ${item.selectedColor}`}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-500"
                      onClick={() => {
                        removeItem(item.productId, item.selectedSize, item.selectedColor);
                        toast.success(t("common.itemRemoved"));
                      }}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quantity & price */}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            Math.max(1, item.quantity - 1),
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPrice(itemTotal)}
                      </div>
                      {item.discountPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" asChild>
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("cartPage.continueShopping")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                clearCart();
                toast.success(t("common.cartCleared"));
              }}
              className="text-muted-foreground hover:text-red-500"
            >
              {t("cartPage.clearCart")}
            </Button>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <h2 className="mb-4 font-serif text-xl font-medium">
              {t("cartPage.orderSummary")}
            </h2>

            {/* Free shipping progress */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="mb-4 rounded-lg bg-accent/10 p-3">
                <p className="flex items-center gap-2 text-xs text-accent-text">
                  <Truck className="h-4 w-4" />
                  {t("cartPage.freeShippingProgress").split("{amount}")[0]}
                  <strong>
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                  </strong>
                  {t("cartPage.freeShippingProgress").split("{amount}")[1]}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-accent/20">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Coupon */}
            <div className="mb-4">
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Tag className="h-3.5 w-3.5" />
                {t("cartPage.promoCode")}
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-md border border-accent/30 bg-accent/10 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-accent-text">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("cartPage.youSave").replace("{amount}", formatPrice(appliedCoupon.discount))}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={removeCoupon}
                  >
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
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    {t("cartPage.applyCode")}
                  </Button>
                </div>
              )}
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                {t("cartPage.couponHint")}
              </p>
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cartPage.subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent-text">
                  <span>{t("cartPage.discountLabel")}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cartPage.shippingLabel")}</span>
                {shipping === 0 ? (
                  <span className="font-medium text-accent-text">{t("cart.free")}</span>
                ) : (
                  <span className="font-medium">{formatPrice(shipping)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cartPage.taxLabel")}</span>
                <span className="font-medium">{formatPrice(0)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-medium">{t("cartPage.total")}</span>
              <span className="font-serif text-2xl font-medium">
                {formatPrice(total)}
              </span>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/checkout")}
            >
              {t("cartPage.proceedCheckout")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Payment methods */}
            <div className="mt-4 text-center">
              <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("cartPage.paymentMethods")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {["bKash", "Nagad", "Rocket", "Visa", "Mastercard", "COD"].map(
                  (method) => (
                    <span
                      key={method}
                      className="rounded border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
