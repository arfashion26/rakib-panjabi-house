"use client";

import * as React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Container, ButtonLink } from "@/components/layout/container";
import { ProductCard } from "@/components/home/product-sections";
import { placeholderProducts } from "@/components/home/product-sections";

/**
 * Countdown timer hook
 */
function useCountdown(targetHours: number = 24) {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: targetHours,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    // Set target time relative to mount (avoid hydration mismatch)
    const target = Date.now() + targetHours * 60 * 60 * 1000;

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetHours]);

  return timeLeft;
}

/**
 * Time block - displays a countdown time unit
 */
function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground md:h-16 md:w-16">
        <span className="font-serif text-2xl font-medium tabular-nums md:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/**
 * Flash Sale Section - with live countdown timer
 */
export function FlashSale() {
  const time = useCountdown(48);

  const flashSaleProducts = placeholderProducts
    .filter((p) => p.discountPrice)
    .slice(0, 4);

  return (
    <section className="bg-primary text-primary-foreground">
      <Container className="py-12 md:py-16 lg:py-20">
        {/* Header with countdown */}
        <div className="mb-10 flex flex-col items-center gap-6 text-center md:mb-12 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Limited Time
              </p>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Flash Sale — Up to 40% Off
              </h2>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <TimeBlock value={time.hours} label="Hours" />
            <span className="font-serif text-2xl text-accent">:</span>
            <TimeBlock value={time.minutes} label="Mins" />
            <span className="font-serif text-2xl text-accent">:</span>
            <TimeBlock value={time.seconds} label="Secs" />
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-6">
          {flashSaleProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg bg-primary-foreground/5 p-3 backdrop-blur"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center md:mt-12">
          <ButtonLink
            href="/sale"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Shop All Sale Items
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
