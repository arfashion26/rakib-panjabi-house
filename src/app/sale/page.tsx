"use client";

import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Container, ButtonLink } from "@/components/layout/container";
import { placeholderProducts } from "@/lib/placeholder-data";

export default function SalePage() {
  const products = placeholderProducts.filter((p) => p.discount_price !== null);

  return (
    <Container className="py-8 md:py-12">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Sale</span>
      </nav>

      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
          <Zap className="h-3 w-3" />
          Limited Time
        </div>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Sale — Up to 40% Off
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
          Save big on premium fashion. Limited stock available — grab your favorites
          before they&apos;re gone!
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
