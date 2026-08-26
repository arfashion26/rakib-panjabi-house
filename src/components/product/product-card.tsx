"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist } from "@/lib/store";
import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscount } from "@/lib/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
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
  };
  images?: string[];
  colors?: { name: string; hex_value: string }[];
  rating?: number;
  reviewCount?: number;
  variant?: "default" | "compact";
  className?: string;
}

export function ProductCard({
  product,
  images,
  colors,
  rating,
  reviewCount,
  variant = "default",
  className,
}: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const hasInWishlist = useWishlist((s) => s.has(product.id));

  const discount = calculateDiscount(product.price, product.discount_price ?? null);
  const finalPrice = product.discount_price ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(hasInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const hasImageUrl =
    images && images.length > 0 && images[0].startsWith("http");

  const bgGradient = !hasImageUrl
    ? images && images.length > 0
      ? `linear-gradient(135deg, ${images[0]}30, ${images[images.length - 1]}90)`
      : "linear-gradient(135deg, #f5f5f0, #e5e5e0)"
    : "";

  return (
    <div
      className={cn(
        "group relative flex flex-col",
        variant === "compact" && "gap-3",
        className
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-muted"
        aria-label={product.name}
      >
        {hasImageUrl ? (
          <img
            src={images[0]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ background: bgGradient }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-5xl font-light text-white/30">RPH</span>
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.is_new_arrival && (
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              New
            </span>
          )}
          {product.is_best_seller && (
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
              Bestseller
            </span>
          )}
          {product.is_flash_sale && (
            <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              <Zap className="h-2.5 w-2.5" />
              Flash
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
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
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <Heart className={cn("h-4 w-4", hasInWishlist && "fill-red-500 text-red-500")} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-background/90 shadow-sm hover:bg-background"
            aria-label="Quick view"
            asChild
          >
            <Link href={`/product/${product.slug}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Bottom add-to-cart button on hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col">
        {rating !== undefined && (
          <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-medium">{rating}</span>
            {reviewCount !== undefined && (
              <span className="text-muted-foreground/60">({reviewCount})</span>
            )}
          </div>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-accent"
        >
          {product.name}
        </Link>

        {colors && colors.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="h-3.5 w-3.5 rounded-full border border-border"
                style={{ backgroundColor: color.hex_value }}
                title={color.name}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(finalPrice)}
          </span>
          {product.discount_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
