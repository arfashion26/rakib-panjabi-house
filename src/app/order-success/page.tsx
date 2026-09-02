"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Phone,
  User,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Container, ButtonLink } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/i18n/language-context";

export default function OrderSuccessPage() {
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
      {/* Header with logo */}
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-md px-4 py-6">
          <Link href="/" className="flex justify-center">
            <Logo size="md" />
          </Link>
        </div>
      </header>

      <Container className="py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Confirmation Card */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
            {/* Top: Success icon with gradient */}
            <div className="relative bg-gradient-to-br from-accent/20 via-accent/5 to-transparent px-6 py-10 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <CheckCircle2 className="h-10 w-10 text-accent-foreground" />
                </div>
              </div>

              {/* Sparkles animation */}
              <Sparkles className="absolute left-1/4 top-4 h-5 w-5 text-accent-text/40" />
              <Sparkles className="absolute right-1/4 top-6 h-4 w-4 text-accent-text/30" />
              <Sparkles className="absolute left-1/3 top-8 h-3 w-3 text-accent-text/20" />
            </div>

            {/* Content */}
            <div className="px-6 py-6 text-center md:px-8">
              <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                {t("thankYou.orderConfirmed")}
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                {t("thankYou.description")}
              </p>

              {/* Order number */}
              {orderNumber && (
                <div className="mt-6 inline-flex flex-col items-center rounded-xl border border-accent/30 bg-accent/5 px-8 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t("thankYou.orderNumber")}
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-accent-text">
                    {orderNumber}
                  </p>
                </div>
              )}

              {/* New user account notice */}
              {isNewUser && phoneNumber && (
                <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-5 text-left">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-accent-text" />
                    <h2 className="font-serif text-lg font-medium text-accent-text">
                      {t("thankYou.accountReady")}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("thankYou.accountReadyDesc")}
                  </p>

                  <div className="mt-3 flex items-center gap-3 rounded-lg bg-background p-3">
                    <Phone className="h-5 w-5 text-accent-text" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("thankYou.loginWithPhone")}</p>
                      <p className="text-sm font-medium">{phoneNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Estimated delivery */}
              {orderNumber && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
                    <Truck className="mx-auto mb-2 h-6 w-6 text-accent-text" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("checkout.deliveryArea")}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
                        "en-US",
                        { weekday: "short", month: "short", day: "numeric" }
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
                    <Package className="mx-auto mb-2 h-6 w-6 text-accent-text" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("orderTracking.status")}
                    </p>
                    <p className="mt-1 text-sm font-medium text-orange-600">{t("orderDetail.processing")}</p>
                  </div>
                </div>
              )}

              {/* Next steps */}
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("thankYou.whatHappensNext")}
                </h3>
                <div className="grid gap-3 text-left sm:grid-cols-3">
                  <div className="rounded-lg border border-border/60 bg-background p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                      <Mail className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-semibold">1. {t("thankYou.step1Title")}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("thankYou.step1Desc")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                      <Package className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-semibold">2. {t("thankYou.step2Title")}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("thankYou.step2Desc")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                      <Truck className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-semibold">3. {t("thankYou.step3Title")}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("thankYou.step3Desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/login">
                    <Phone className="mr-2 h-4 w-4" />
                    {t("thankYou.loginToTrack")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/shop">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t("thankYou.continueShopping")}
                  </Link>
                </Button>
              </div>

              {/* Support */}
              <p className="mt-6 text-xs text-muted-foreground">
                {t("thankYou.needHelp")}{" "}
                <Link href="/contact" className="text-accent-text hover:underline">
                  {t("thankYou.contactUs")}
                </Link>{" "}
                {t("thankYou.orCall")}{" "}
                <a href="tel:+8801716243949" className="text-accent-text hover:underline">
                  +880 1716-243949
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
