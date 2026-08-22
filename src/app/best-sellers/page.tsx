"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Container, ButtonLink } from "@/components/layout/container";
import { placeholderProducts } from "@/lib/placeholder-data";

export default function BestSellersPage() {
  const products = placeholderProducts.filter((p) => p.is_best_seller);

  return (
    <Container className="py-8 md:py-12">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Best Sellers</span>
      </nav>

      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <TrendingUp className="h-3 w-3" />
          Customer Favorites
        </div>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Best Sellers
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
          Our most-loved pieces, chosen by thousands of happy customers. Shop the
          styles everyone is talking about.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            images={product.images}
            colors={product.colors}
            rating={product.rating}
            reviewCount={product.review_count}
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <ButtonLink href="/shop" variant="outline">
          View All Products
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonLink>
      </div>
    </Container>
  );
}
