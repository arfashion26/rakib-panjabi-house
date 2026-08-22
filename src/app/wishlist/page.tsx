"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist, useCart } from "@/lib/store";
import { Container, ButtonLink } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { placeholderProducts } from "@/lib/placeholder-data";
import { toast } from "sonner";

export default function WishlistPage() {
  const productIds = useWishlist((s) => s.productIds);
  const toggle = useWishlist((s) => s.toggle);
  const addItem = useCart((s) => s.addItem);
  const clearWishlist = useWishlist((s) => s.clear);

  // Match wishlist IDs with placeholder products
  const wishlistProducts = React.useMemo(() => {
    return placeholderProducts.filter((p) => productIds.includes(p.id));
  }, [productIds]);

  function handleAddAllToCart() {
    wishlistProducts.forEach((p) => {
      addItem({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: null,
        price: p.price,
        discountPrice: p.discount_price ?? null,
        sku: p.sku,
        selectedSize: null,
        selectedColor: null,
      });
    });
    toast.success(`Added ${wishlistProducts.length} items to cart`);
  }

  if (wishlistProducts.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium">Your Wishlist is Empty</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Save your favorite items here for easy access later. Click the heart
              icon on any product to add it to your wishlist.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">
              Explore Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Wishlist</span>
      </nav>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddAllToCart}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              clearWishlist();
              toast.success("Wishlist cleared");
            }}
            className="text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {wishlistProducts.map((product) => (
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
    </Container>
  );
}
