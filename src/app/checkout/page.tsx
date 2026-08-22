"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Truck,
  CreditCard,
  MapPin,
  User,
  Lock,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Container } from "@/components/layout/container";
import { formatPrice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FREE_SHIPPING_THRESHOLD = 2000;
const FLAT_SHIPPING = 80;
const COD_CHARGE = 50;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [step, setStep] = React.useState(1);
  const [processing, setProcessing] = React.useState(false);

  // Form state
  const [contact, setContact] = React.useState({
    email: "",
    phone: "",
  });
  const [shipping, setShipping] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
    altPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    thana: "",
    postalCode: "",
  });
  const [shippingMethod, setShippingMethod] = React.useState("standard");
  const [paymentMethod, setPaymentMethod] = React.useState("cod");

  const subtotal = getSubtotal();
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const codCharge = paymentMethod === "cod" ? COD_CHARGE : 0;
  const total = subtotal + shippingCost + codCharge;

  // Redirect to cart if empty
  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  function validateStep1() {
    if (!contact.email || !contact.phone) {
      toast.error("Please fill in your contact information");
      return false;
    }
    return true;
  }

  function validateStep2() {
    if (
      !shipping.firstName ||
      !shipping.phone ||
      !shipping.addressLine1 ||
      !shipping.city
    ) {
      toast.error("Please fill in all required shipping fields");
      return false;
    }
    return true;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function placeOrder() {
    setProcessing(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    clearCart();
    toast.success("Order placed successfully!");
    router.push("/order-success");
  }

  const steps = [
    { number: 1, title: "Contact", icon: User },
    { number: 2, title: "Shipping", icon: MapPin },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <Container className="py-8">
      {/* Header */}
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

      {/* Progress steps */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center gap-2 md:gap-4">
          {steps.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    step >= s.number
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-background text-muted-foreground"
                  )}
                >
                  {step > s.number ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    step >= s.number ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Step 1: Contact */}
          {step === 1 && (
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
                <User className="h-5 w-5" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <>
              <div className="rounded-lg border border-border/60 bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      value={shipping.firstName}
                      onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Your last name"
                      value={shipping.lastName}
                      onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altPhone">Alt. Phone</Label>
                    <Input
                      id="altPhone"
                      type="tel"
                      placeholder="Alternative phone"
                      value={shipping.altPhone}
                      onChange={(e) => setShipping({ ...shipping, altPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      placeholder="House #, Road #, Block"
                      value={shipping.addressLine1}
                      onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={shipping.addressLine2}
                      onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Dhaka"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="Dhaka"
                      value={shipping.district}
                      onChange={(e) => setShipping({ ...shipping, district: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thana">Thana/Upazila</Label>
                    <Input
                      id="thana"
                      placeholder="Thana name"
                      value={shipping.thana}
                      onChange={(e) => setShipping({ ...shipping, thana: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="1207"
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping method */}
              <div className="rounded-lg border border-border/60 bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
                  <Truck className="h-5 w-5" />
                  Shipping Method
                </h2>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                  className="space-y-3"
                >
                  {[
                    {
                      id: "standard",
                      name: "Standard Delivery",
                      desc: "3-5 business days",
                      cost: shippingCost,
                    },
                    {
                      id: "express",
                      name: "Express Delivery",
                      desc: "1-2 business days (inside Dhaka)",
                      cost: shippingCost + 50,
                    },
                    {
                      id: "same_day",
                      name: "Same Day Delivery",
                      desc: "Order before 11 AM (Dhaka only)",
                      cost: shippingCost + 100,
                    },
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                        shippingMethod === method.id
                          ? "border-accent bg-accent/5"
                          : "border-border"
                      )}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="cursor-pointer">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {method.desc}
                          </div>
                        </Label>
                      </div>
                      <span className="font-medium">
                        {method.cost === 0 ? "FREE" : formatPrice(method.cost)}
                      </span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {[
                  {
                    id: "sslcommerz",
                    name: "SSLCommerz",
                    desc: "Pay with bKash, Nagad, Rocket, or cards",
                    icon: "💳",
                  },
                  {
                    id: "stripe",
                    name: "Stripe (International Cards)",
                    desc: "Visa, Mastercard, Amex",
                    icon: "🌍",
                  },
                  {
                    id: "bkash",
                    name: "bKash",
                    desc: "Pay directly with your bKash account",
                    icon: "📱",
                  },
                  {
                    id: "nagad",
                    name: "Nagad",
                    desc: "Pay directly with your Nagad account",
                    icon: "📱",
                  },
                  {
                    id: "cod",
                    name: "Cash on Delivery",
                    desc: `Pay when you receive (extra ${formatPrice(COD_CHARGE)} charge)`,
                    icon: "💵",
                  },
                ].map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                      paymentMethod === method.id
                        ? "border-accent bg-accent/5"
                        : "border-border"
                    )}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="cursor-pointer">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {method.desc}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <Lock className="h-4 w-4 shrink-0" />
                <span>
                  Your payment information is processed securely. We do not store
                  credit card details nor have access to your card information.
                </span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/cart">← Back to Cart</Link>
              </Button>
            )}

            {step < 3 ? (
              <Button onClick={nextStep}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={placeOrder}
                disabled={processing}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Place Order ({formatPrice(total)})
                  </>
                )}
              </Button>
            )}
          </div>
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
                        background:
                          item.image
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
                      <p className="line-clamp-1 text-sm font-medium">
                        {item.name}
                      </p>
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
                {shippingCost === 0 ? (
                  <span className="font-medium text-accent">FREE</span>
                ) : (
                  <span className="font-medium">{formatPrice(shippingCost)}</span>
                )}
              </div>
              {codCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">COD Charge</span>
                  <span className="font-medium">{formatPrice(codCharge)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="font-serif text-2xl font-medium">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <>
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                  FREE shipping
                </>
              )}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
