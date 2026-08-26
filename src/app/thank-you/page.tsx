"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  Phone,
  User,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  const { t } = useLanguage();
  const [orderNumber, setOrderNumber] = React.useState("");
  const [isNewUser, setIsNewUser] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    const num = sessionStorage.getItem("lastOrderNumber") || "";
    const phone = sessionStorage.getItem("lastOrderPhone") || "";
    const newUser = sessionStorage.getItem("lastOrderNewUser") === "true";
    setOrderNumber(num);
    setPhoneNumber(phone);
    setIsNewUser(newUser);
    sessionStorage.removeItem("lastOrderNumber");
    sessionStorage.removeItem("lastOrderPhone");
    sessionStorage.removeItem("lastOrderNewUser");
  }, []);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-md px-4 py-6">
          <Link href="/" className="flex justify-center">
            <Logo size="md" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Main confirmation card */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
          {/* Top: Success icon */}
          <div className="relative bg-gradient-to-br from-accent/20 via-accent/5 to-transparent px-6 py-12 text-center">
            <Sparkles className="absolute left-1/4 top-4 h-5 w-5 text-accent/40" />
            <Sparkles className="absolute right-1/4 top-6 h-4 w-4 text-accent/30" />
            <Sparkles className="absolute left-1/3 top-8 h-3 w-3 text-accent/20" />

            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <CheckCircle2 className="h-10 w-10 text-accent-foreground" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 text-center md:px-8">
            <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
              Thank You!
            </h1>
            <p className="mt-2 font-serif text-xl text-accent">
              Your Order is Confirmed
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              We&apos;ve received your order and will call you shortly to confirm.
            </p>

            {/* Order number */}
            {orderNumber && (
              <div className="mt-6 inline-flex flex-col items-center rounded-xl border border-accent/30 bg-accent/5 px-8 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Order Number
                </p>
                <p className="mt-1 font-serif text-2xl font-bold text-accent">
                  {orderNumber}
                </p>
              </div>
            )}

            {/* New user account notice */}
            {isNewUser && phoneNumber && (
              <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-5 text-left">
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  <h2 className="font-serif text-lg font-medium text-accent">
                    Your Account is Ready!
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve automatically created an account for you. You can track your
                  order anytime — just login with your phone number!
                </p>

                <div className="mt-3 flex items-center gap-3 rounded-lg bg-background p-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Login with your phone:</p>
                    <p className="text-sm font-medium">{phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* What happens next */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                What Happens Next?
              </h3>
              <div className="grid gap-3 text-left sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-background p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Phone className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-semibold">1. Call Confirmation</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We&apos;ll call to confirm your order
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Package className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-semibold">2. Processing</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We prepare your items for delivery
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Truck className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-semibold">3. Delivery</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Inside Dhaka: 1 day · Outside: 1-3 days
                  </p>
                </div>
              </div>
            </div>

            {/* Payment reminder */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                💵 <strong className="text-foreground">Cash on Delivery:</strong> Please
                keep the exact amount ready when your order arrives.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">
                  <Phone className="mr-2 h-4 w-4" />
                  Login to Track Order
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Support */}
            <p className="mt-8 text-xs text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="text-accent hover:underline">
                Contact us
              </Link>{" "}
              or call{" "}
              <a href="tel:+8801716243949" className="text-accent hover:underline">
                +880 1716-243949
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
