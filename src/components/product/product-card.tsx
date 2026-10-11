"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    : product.is_new_arrival
    ? "linear-gradient(135deg, #dbeafe, #bfdbfe)"
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
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
        className
      )}
    >
      {/* Image section */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {hasImageUrl ? (
            <img
              src={images[0]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ background: bgGradient }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-5xl font-light text-gray-300">RPH</span>
              </div>
            </>
          )}
        </Link>

        {/* Badges — top left, rounded */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.is_new_arrival && (
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
              New
            </span>
          )}
          {product.is_best_seller && (
            <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
              Best Seller
            </span>
          )}
          {product.is_flash_sale && (
            <span className="flex items-center gap-0.5 rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
              <Zap className="h-2.5 w-2.5" />
              Flash
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-md bg-green-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action buttons — top right */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <button
            onClick={handleWishlist}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all hover:bg-white hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart className={cn("h-3.5 w-3.5", hasInWishlist ? "fill-red-500 text-red-500" : "text-gray-700")} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            aria-label="Quick view"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all hover:bg-white hover:scale-110"
          >
            <Eye className="h-3.5 w-3.5 text-gray-700" />
          </Link>
        </div>

        {/* Add to cart — slides up on hover */}
        <div className="absolute inset-x-2 bottom-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {t("productCard.addToCart")}
          </button>
        </div>
      </div>

      {/* Info section — white bg, clean modern design */}
      <div className="flex flex-1 flex-col p-3">
        {/* Rating */}
        {rating !== undefined && (
          <div className="mb-1 flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-900">{rating}</span>
            {reviewCount !== undefined && (
              <span className="text-gray-400">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-amber-600"
        >
          {product.name}
        </Link>

        {/* Colors */}
        {colors && colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="h-3 w-3 rounded-full border border-gray-200 ring-1 ring-white/50"
                style={{ backgroundColor: color.hex_value }}
                title={color.name}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] font-medium text-gray-400">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(finalPrice)}
          </span>
          {product.discount_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-auto rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
              Save {discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
