"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { placeholderProducts, placeholderCategories } from "@/lib/placeholder-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [sortBy, setSortBy] = React.useState("newest");

  // Find the category
  const category = React.useMemo(() => {
    return placeholderCategories.find((c) => c.slug === slug);
  }, [slug]);

  // Filter products by category (using category_name match)
  const products = React.useMemo(() => {
    if (!category) return [];
    let result = placeholderProducts.filter((p) =>
      p.category_name?.toLowerCase().includes(category.slug.split("-")[0])
    );

    switch (sortBy) {
      case "price_asc":
        result = [...result].sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
        break;
      case "price_desc":
        result = [...result].sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
        break;
      case "popular":
        result = [...result].sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }
    return result;
  }, [category, slug, sortBy]);

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-medium">Category Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-accent">Shop</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Category header */}
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
          {products.length} {products.length === 1 ? "product" : "products"} available
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {products.length} of {products.length} products
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger size="sm" className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-lg font-medium">No products in this category yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back soon — we&apos;re adding new products regularly.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
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
      )}
    </div>
  );
}
