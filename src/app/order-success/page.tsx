"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Mail, ArrowRight, User, Phone, KeyRound } from "lucide-react";
import { Container, ButtonLink } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [tempPassword, setTempPassword] = React.useState("");
  const [isNewUser, setIsNewUser] = React.useState(false);

  React.useEffect(() => {
    const num = sessionStorage.getItem("lastOrderNumber") || "";
    const pass = sessionStorage.getItem("tempPassword") || "";
    setOrderNumber(num);
    if (pass && !pass.includes("database not connected")) {
      setTempPassword(pass);
      setIsNewUser(true);
    }
    // Clear after reading
    sessionStorage.removeItem("lastOrderNumber");
    sessionStorage.removeItem("tempPassword");
  }, []);

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-12 w-12 text-accent" />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Thank You for Your Order!
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Your order has been placed successfully. We&apos;ve sent a confirmation
          email with your order details.
        </p>

        {/* New user account notice */}
        {isNewUser && (
          <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-6 text-left">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              <h2 className="font-serif text-lg font-medium text-accent">
                Your Account Has Been Created!
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              We&apos;ve automatically created an account for you so you can track
              your order, view order history, and shop faster next time.
            </p>

            <div className="mt-4 space-y-2 rounded-md bg-background p-4">
              <div className="flex items-center gap-2 text-sm">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Temporary Password:</span>
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-accent">
                  {tempPassword}
                </code>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              <strong>Important:</strong> Please change this password after your first
              login for security. You can login using your phone number and this password.
            </p>

            <Button asChild className="mt-4 w-full">
              <Link href="/login">Login to Your Account</Link>
            </Button>
          </div>
        )}

        {/* Order number card */}
        {orderNumber && (
          <div className="mt-8 rounded-lg border border-border/60 bg-card p-6 text-left">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Order Number
                </p>
                <p className="mt-1 font-serif text-xl font-medium text-accent">
                  {orderNumber}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Estimated Delivery
                </p>
                <p className="mt-1 font-medium">
                  {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "short", day: "numeric" }
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <Mail className="mb-2 h-6 w-6 text-accent" />
            <h3 className="text-sm font-semibold">1. Confirmation</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              You&apos;ll receive an email confirmation shortly
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <Package className="mb-2 h-6 w-6 text-accent" />
            <h3 className="text-sm font-semibold">2. Processing</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              We&apos;ll prepare your order for shipping
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <Truck className="mb-2 h-6 w-6 text-accent" />
            <h3 className="text-sm font-semibold">3. Delivery</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Your order will arrive in 3-5 days
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/track-order" variant="outline">
            Track My Order
          </ButtonLink>
          <ButtonLink href="/shop">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>

        {/* Support note */}
        <p className="mt-8 text-xs text-muted-foreground">
          Need help?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Contact our support team
          </Link>{" "}
          or call us at +880 1716-243949
        </p>
      </div>
    </Container>
  );
}
