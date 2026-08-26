"use client";

import * as React from "react";
import { Flame } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/layout/container";
import { useLanguage } from "@/i18n/language-context";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discount_price: number | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  is_flash_sale?: boolean;
  status: string;
  sizes?: { size: string; stock: number }[];
  colors?: { name: string; hex_value: string }[];
  images?: { url: string; is_primary: boolean }[];
  rating?: number;
  review_count?: number;
}

function useCountdown(targetHours: number = 48) {
  const [timeLeft, setTimeLeft] = React.useState({ hours: targetHours, minutes: 0, seconds: 0 });

  React.useEffect(() => {
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

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground md:h-16 md:w-16">
        <span className="font-serif text-2xl font-medium tabular-nums md:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export function FlashSaleContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const time = useCountdown(48);

  if (products.length === 0) return null;

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-10 flex flex-col items-center gap-6 text-center md:mb-12 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t("flashSale.eyebrow")}</p>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                {t("flashSale.title")}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TimeBlock value={time.hours} label={t("flashSale.hours")} />
            <span className="font-serif text-2xl text-accent">:</span>
            <TimeBlock value={time.minutes} label={t("flashSale.mins")} />
            <span className="font-serif text-2xl text-accent">:</span>
            <TimeBlock value={time.seconds} label={t("flashSale.secs")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-6">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg bg-primary-foreground/5 p-3 backdrop-blur">
              <ProductCard
                product={product}
                images={product.images?.map((img) => img.url) || []}
                colors={product.colors}
                rating={product.rating}
                reviewCount={product.review_count}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <ButtonLink href="/sale" className="bg-accent text-accent-foreground hover:bg-accent/90">
            {t("flashSale.shopAll")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
