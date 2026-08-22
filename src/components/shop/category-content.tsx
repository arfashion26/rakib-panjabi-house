"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRight } from "lucide-react";
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export function CategoryContent({
  category,
  products,
  total,
}: {
  category: Category;
  products: Product[];
  total: number;
}) {
  const [sortBy, setSortBy] = React.useState<"newest" | "price_asc" | "price_desc" | "popular" | "rating">("newest");

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "price_asc":
        sorted.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
        break;
      case "price_desc":
        sorted.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
        break;
      case "popular":
        sorted.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-accent">Shop</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8 border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {total} {total === 1 ? "product" : "products"} available
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {products.length} of {total} products
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-lg font-medium">No products in this category yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back soon — we&apos;re adding new products regularly.
          </p>
          <ButtonLink href="/shop" className="mt-4">
            Browse All Products
          </ButtonLink>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {sortedProducts.map((product) => (
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
    </div>
  );
}
