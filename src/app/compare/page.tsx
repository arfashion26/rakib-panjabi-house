"use client";

import * as React from "react";
import Link from "next/link";
import { GitCompare, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCompare } from "@/lib/store";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { placeholderProducts } from "@/lib/placeholder-data";
import { useCart } from "@/lib/store";
import { formatPrice, calculateDiscount } from "@/lib/types";
import { toast } from "sonner";

export default function ComparePage() {
  const productIds = useCompare((s) => s.productIds);
  const toggle = useCompare((s) => s.toggle);
  const clearCompare = useCompare((s) => s.clear);
  const addItem = useCart((s) => s.addItem);

  const products = React.useMemo(() => {
    return placeholderProducts.filter((p) => productIds.includes(p.id));
  }, [productIds]);

  if (products.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <GitCompare className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium">Nothing to Compare</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Add products to compare their features side by side. You can compare
              up to 4 products at once.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  const specs = [
    { key: "price", label: "Price" },
    { key: "discount_price", label: "Discount Price" },
    { key: "fabric", label: "Fabric" },
    { key: "fit", label: "Fit" },
    { key: "care", label: "Care" },
    { key: "origin", label: "Origin" },
    { key: "weight_kg", label: "Weight" },
    { key: "brand_name", label: "Brand" },
    { key: "rating", label: "Rating" },
    { key: "review_count", label: "Reviews" },
  ];

  return (
    <Container className="py-8">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Compare</span>
      </nav>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
            Compare Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Comparing {products.length} of 4 products
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={clearCompare}
          className="text-muted-foreground hover:text-red-500"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-40 border-b border-border p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              {products.map((product) => (
                <th key={product.id} className="border-b border-border p-4 text-center align-top">
                  <div className="relative">
                    <button
                      onClick={() => toggle(product.id)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-red-500 hover:text-white"
                      aria-label="Remove from compare"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      className="block aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted"
                      style={{
                        background: `linear-gradient(135deg, ${product.images[0]}30, ${product.images[product.images.length - 1]}90)`,
                      }}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-serif text-3xl font-light text-white/30">
                          RPH
                        </span>
                      </div>
                    </Link>
                    <Link
                      href={`/product/${product.slug}`}
                      className="mt-2 line-clamp-2 block text-sm font-medium hover:text-accent"
                    >
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.key} className="border-b border-border/60">
                <td className="bg-muted/30 p-4 text-sm font-medium">
                  {spec.label}
                </td>
                {products.map((product) => {
                  const value = (product as any)[spec.key];
                  return (
                    <td key={product.id} className="p-4 text-center text-sm">
                      {spec.key === "price" || spec.key === "discount_price"
                        ? value
                          ? formatPrice(value as number)
                          : "—"
                        : value
                        ? String(value)
                        : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Action row */}
            <tr>
              <td className="bg-muted/30 p-4 text-sm font-medium">Actions</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Button
                    size="sm"
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: null,
                        price: product.price,
                        discountPrice: product.discount_price ?? null,
                        sku: product.sku,
                        selectedSize: null,
                        selectedColor: null,
                      });
                      toast.success("Added to cart");
                    }}
                  >
                    <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                    Add to Cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
}
