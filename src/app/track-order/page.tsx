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
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TrackOrderPage() {
  const { t } = useLanguage();
  const [orderNumber, setOrderNumber] = React.useState("");
  const [searched, setSearched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1200);
  }

  const trackingSteps = [
    {
      icon: CheckCircle2,
      title: t("trackOrder.orderPlaced"),
      date: "Aug 22, 2026 — 10:32 AM",
      desc: t("trackOrder.orderPlacedDesc"),
      done: true,
    },
    {
      icon: Package,
      title: t("trackOrder.processing"),
      date: "Aug 22, 2026 — 2:15 PM",
      desc: t("trackOrder.processingDesc"),
      done: true,
    },
    {
      icon: Truck,
      title: t("trackOrder.shipped"),
      date: "Aug 23, 2026 — 9:00 AM",
      desc: t("trackOrder.shippedDesc"),
      done: false,
      current: true,
    },
    {
      icon: HomeIcon,
      title: t("trackOrder.delivered"),
      date: "Expected Aug 25, 2026",
      desc: t("trackOrder.deliveredDesc"),
      done: false,
    },
  ];

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

        {/* Results */}
        {searched && (
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("trackOrder.orderNumber")}
                </p>
                <p className="font-serif text-lg font-medium text-accent">
                  {orderNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("trackOrder.currentStatus")}
                </p>
                <p className="font-medium text-accent">{t("trackOrder.inTransit")}</p>
              </div>
            </div>

            {/* Tracking timeline */}
            <div className="space-y-6">
              {trackingSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2",
                        step.done
                          ? "border-accent bg-accent text-accent-foreground"
                          : step.current
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    {idx < trackingSteps.length - 1 && (
                      <div
                        className={cn(
                          "mt-1 h-12 w-0.5",
                          step.done ? "bg-accent" : "bg-border"
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{step.title}</h3>
                      {step.current && (
                        <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                          <Clock className="h-2.5 w-2.5" />
                          {t("trackOrder.current")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                    <p className="mt-1 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking link */}
            <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center text-sm">
              <p className="text-muted-foreground">
                {t("trackOrder.carrier")}: <span className="font-medium text-foreground">Pathao Courier</span>
              </p>
              <p className="text-muted-foreground">
                {t("trackOrder.trackingId")}: <span className="font-mono text-foreground">PTH-XX123456789</span>
              </p>
            </div>

            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/dashboard">{t("trackOrder.viewFullDetails")}</Link>
            </Button>
          </div>
        )}

        {/* Help */}
        {!searched && (
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
