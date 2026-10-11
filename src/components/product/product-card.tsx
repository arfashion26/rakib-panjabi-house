"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useCurrency } from "@/i18n/currency-context";
import { useCart, useWishlist } from "@/lib/store";
import { cn } from "@/lib/utils";
import { calculateDiscount } from "@/lib/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    discount_price?: number | null;
    short_description?: string | null;
    is_featured?: boolean;
    is_best_seller?: boolean;
    is_new_arrival?: boolean;
    is_flash_sale?: boolean;
  };
  images?: string[];
  rating?: number;
  reviewCount?: number;
  colors?: Array<{ name: string; hex_value: string }>;
  variant?: "default" | "compact";
  className?: string;
}

export function ProductCard({
  product,
  images = [],
  rating,
  reviewCount,
  colors,
  variant = "default",
  className,
}: ProductCardProps) {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const addItem = useCart((s) => s.addItem);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const hasInWishlist = useWishlist((s) => s.has(product.id));

  const finalPrice = product.discount_price ?? product.price;
  const discount = calculateDiscount(product.price, product.discount_price ?? null);
  const hasImageUrl = images.length > 0 && images[0];

  const bgGradient = product.is_flash_sale
    ? "linear-gradient(135deg, #fee2e2, #fecaca)"
    : "linear-gradient(135deg, #f5f5f0, #e5e5e0)";

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.id) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: hasImageUrl ? images[0] : null,
        price: product.price,
        discountPrice: product.discount_price ?? null,
        selectedSize: null,
        selectedColor: null,
        sku: product.sku,
      },
      1
    );
    toast.success(t("productCard.addedToCart"));
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(
      hasInWishlist ? t("productCard.removedFromWishlist") : t("productCard.addedToWishlist")
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border-2 border-red-500/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-red-600",
        className
      )}
    >
      {/* Image section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {hasImageUrl ? (
            <img
              src={images[0]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{ background: bgGradient }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl font-light text-gray-300">RPH</span>
              </div>
            </>
          )}
        </Link>

        {/* Badges — top left */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_new_arrival && (
            <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
              NEW
            </span>
          )}
          {product.is_best_seller && (
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
              BEST
            </span>
          )}
          {product.is_flash_sale && (
            <span className="flex items-center gap-0.5 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
              <Zap className="h-2 w-2" />
              SALE
            </span>
          )}
        </div>

        {/* Wishlist — top right */}
        <button
          onClick={handleWishlist}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:bg-white hover:scale-110"
          aria-label="Wishlist"
        >
          <Heart className={cn("h-3.5 w-3.5", hasInWishlist ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </button>
      </div>

      {/* Info section — product name + price + cart button in one row */}
      <div className="flex flex-1 flex-col justify-between p-2.5">
        {/* Rating */}
        {rating !== undefined && (
          <div className="mb-1 flex items-center gap-1 text-[10px]">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-800">{rating}</span>
            <span className="text-gray-400">({reviewCount || 0})</span>
          </div>
        )}

        {/* Product name */}
        <Link
          href={`/product/${product.slug}`}
          className="mb-1.5 line-clamp-2 text-xs font-medium leading-tight text-gray-800 hover:text-red-600"
        >
          {product.name}
        </Link>

        {/* Price + Cart button — SAME ROW */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(finalPrice)}
            </span>
            {product.discount_price && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Cart button — right side of price */}
          <button
            onClick={handleAddToCart}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600 hover:scale-110 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
