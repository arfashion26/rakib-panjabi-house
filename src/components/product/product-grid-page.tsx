"use client";

import Link from "next/link";
import { Sparkles, TrendingUp, Zap, ArrowRight } from "lucide-react";
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

export function ProductGridPage({
  title,
  eyebrow,
  description,
  products,
  saleMode = false,
}: {
  title: string;
  eyebrow: string;
  description: string;
  products: Product[];
  saleMode?: boolean;
}) {
  const { t, locale } = useLanguage();
  const Icon = saleMode ? Zap : eyebrow === "Just Arrived" ? Sparkles : TrendingUp;

  // Use translations based on page type
  const pageTitle = saleMode ? t("sale.title") : eyebrow === "Just Arrived" ? t("newArrivals.title") : t("bestSellers.title");
  const pageEyebrow = saleMode ? t("sale.eyebrow") : eyebrow === "Just Arrived" ? t("newArrivals.eyebrow") : t("bestSellers.eyebrow");
  const pageDesc = saleMode ? t("sale.description") : eyebrow === "Just Arrived" ? t("newArrivals.description") : t("bestSellers.description");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">{t("common.home")}</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{title.split(" — ")[0]}</span>
      </nav>

      <div className="mb-10">
        <div
          className={`mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
            saleMode
              ? "border-red-500/30 bg-red-500/10 text-red-600"
              : "border-accent/30 bg-accent/10 text-accent"
          }`}
        >
          <Icon className="h-3 w-3" />
          {locale === "bn" ? pageEyebrow : eyebrow}
        </div>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">{locale === "bn" ? pageTitle : title}</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{locale === "bn" ? pageDesc : description}</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Icon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">{t("shop.noProducts")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Check back soon — we&apos;re adding new products regularly!
          </p>
          <ButtonLink href="/shop" variant="outline" className="mt-4">
            Browse All Products
          </ButtonLink>
        </div>
      ) : (
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
      )}

      <div className="mt-16 text-center">
        <ButtonLink href="/shop" variant="outline">
          View All Products
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
