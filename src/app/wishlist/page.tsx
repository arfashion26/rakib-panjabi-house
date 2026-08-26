"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/store";
import { getProducts } from "@/lib/services/products";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/language-context";
import { ProductCard } from "@/components/product/product-card";
import { Container, ButtonLink } from "@/components/layout/container";
import { toast } from "sonner";

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

export default function WishlistPage() {
  const { t } = useLanguage();
  const productIds = useWishlist((s) => s.productIds);
  const clearWishlist = useWishlist((s) => s.clear);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Fetch each product by ID
        const { products: fetched } = await getProducts({ limit: 100 });
        const filtered = fetched.filter((p) => productIds.includes(p.id));
        setProducts(filtered);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [productIds]);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="text-center">Loading your wishlist...</div>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium">{t("wishlist.empty")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Save your favorite items here for easy access later. Click the heart icon on any product to add it to your wishlist.
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
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Wishlist</span>
      </nav>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">{t("wishlist.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            clearWishlist();
            toast.success("Wishlist cleared");
          }}
          className="text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
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
    </Container>
  );
}
