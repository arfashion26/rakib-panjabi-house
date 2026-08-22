"use client";

import * as React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/store";
import { getProducts } from "@/lib/services/products";
import { ProductCard } from "@/components/product/product-card";

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

export default function DashboardWishlist() {
  const productIds = useWishlist((s) => s.productIds);
  const [wishlistProducts, setWishlistProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      if (productIds.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { products } = await getProducts({ limit: 100 });
        const filtered = products.filter((p) => productIds.includes(p.id));
        setWishlistProducts(filtered);
      } catch {
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [productIds]);

  if (loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading your wishlist...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">My Wishlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
          <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">Your wishlist is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save items you love by clicking the heart icon.
          </p>
          <Link href="/shop" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {wishlistProducts.map((product) => (
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
