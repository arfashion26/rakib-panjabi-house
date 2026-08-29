"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/layout/container";

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

export function NewArrivalsContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  if (products.length === 0) return null;

  return (
    <section className="bg-muted py-14 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t("newArrivals.eyebrow")}</p>
            <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">{t("newArrivals.title")}</h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {t("newArrivals.description")}
            </p>
          </div>
          <ButtonLink href="/new-arrivals" variant="ghost" className="shrink-0">
            {t("newArrivals.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              images={product.images?.map((img) => img.url) || []}
              colors={product.colors}
              rating={product.rating}
              reviewCount={product.review_count}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
