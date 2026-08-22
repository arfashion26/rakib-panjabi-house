"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye, ArrowRight } from "lucide-react";
import { Container, SectionHeading, ButtonLink } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/**
 * Sample placeholder products
 * (Will be replaced with actual products from database in Phase 3)
 */
export const placeholderProducts = [
  {
    id: 1,
    name: "Premium Cotton Panjabi — Emerald",
    slug: "premium-cotton-panjabi-emerald",
    price: 2499,
    discountPrice: 1999,
    rating: 4.8,
    reviews: 124,
    badge: "New",
    colors: ["#0F5132", "#1A1A1F", "#8B6F47"],
  },
  {
    id: 2,
    name: "Royal Silk Sherwani — Ivory Gold",
    slug: "royal-silk-sherwani-ivory-gold",
    price: 12999,
    discountPrice: 9999,
    rating: 4.9,
    reviews: 87,
    badge: "Premium",
    colors: ["#F5F1E8", "#B8860B", "#1A1A1F"],
  },
  {
    id: 3,
    name: "Linen Casual Shirt — Sand",
    slug: "linen-casual-shirt-sand",
    price: 1499,
    discountPrice: 1199,
    rating: 4.7,
    reviews: 203,
    badge: "Bestseller",
    colors: ["#D2B48C", "#FFFFFF", "#1A1A1F"],
  },
  {
    id: 4,
    name: "Tailored Wool Blazer — Charcoal",
    slug: "tailored-wool-blazer-charcoal",
    price: 5999,
    discountPrice: 4499,
    rating: 4.8,
    reviews: 156,
    badge: "New",
    colors: ["#1A1A1F", "#36454F", "#8B6F47"],
  },
  {
    id: 5,
    name: "Premium Oxford Shirt — White",
    slug: "premium-oxford-shirt-white",
    price: 1799,
    discountPrice: 1399,
    rating: 4.6,
    reviews: 178,
    badge: "",
    colors: ["#FFFFFF", "#F5F5F0", "#1A1A1F"],
  },
  {
    id: 6,
    name: "Embroidered Kurta Pajama — Maroon",
    slug: "embroidered-kurta-pajama-maroon",
    price: 3499,
    discountPrice: 2799,
    rating: 4.9,
    reviews: 94,
    badge: "New",
    colors: ["#800020", "#1A1A1F", "#8B6F47"],
  },
  {
    id: 7,
    name: "Slim Fit Jeans — Dark Indigo",
    slug: "slim-fit-jeans-dark-indigo",
    price: 2299,
    discountPrice: 1799,
    rating: 4.7,
    reviews: 256,
    badge: "Bestseller",
    colors: ["#1A237E", "#0D1117", "#8B6F47"],
  },
  {
    id: 8,
    name: "Quilted Winter Jacket — Olive",
    slug: "quilted-winter-jacket-olive",
    price: 3999,
    discountPrice: 3199,
    rating: 4.8,
    reviews: 67,
    badge: "",
    colors: ["#556B2F", "#1A1A1F", "#8B6F47"],
  },
];

/**
 * Product Card - Reusable component
 */
export function ProductCard({ product }: { product: typeof placeholderProducts[0] }) {
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col">
      {/* Image area */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-muted"
      >
        {/* Placeholder gradient background */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${
              product.colors[0]
            }40, ${product.colors[product.colors.length - 1]}80)`,
          }}
        />

        {/* Product monogram (placeholder) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-5xl font-light text-white/30">
            RPH
          </span>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
              -{discount}%
            </span>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-background/90 shadow-sm hover:bg-background"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-background/90 shadow-sm hover:bg-background"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Bottom add-to-cart button on hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground/60">({product.reviews})</span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-accent"
        >
          {product.name}
        </Link>

        {/* Colors */}
        <div className="mt-2 flex gap-1.5">
          {product.colors.map((color, i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full border border-border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-base font-semibold text-foreground">
                ৳{product.discountPrice.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ৳{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-foreground">
              ৳{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * New Arrivals Section
 */
export function NewArrivals() {
  return (
    <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
      <Container>
        <div className="mb-10 md:mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <SectionHeading
            eyebrow="Just Arrived"
            title="New Arrivals"
            subtitle="Discover the latest additions to our collection, featuring fresh designs and seasonal must-haves."
            align="left"
            className="mb-0 md:max-w-xl"
          />
          <ButtonLink href="/new-arrivals" variant="ghost" className="shrink-0">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {placeholderProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * Trending Products Section
 */
export function TrendingProducts() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <div className="mb-10 md:mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <SectionHeading
            eyebrow="Hot Right Now"
            title="Trending Products"
            subtitle="Our most-loved pieces that everyone is talking about this season."
            align="left"
            className="mb-0 md:max-w-xl"
          />
          <ButtonLink href="/best-sellers" variant="ghost" className="shrink-0">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {placeholderProducts.slice(2, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
