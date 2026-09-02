"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/language-context";
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
  const { t } = useLanguage();
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
    toast.success(t("productDetail.addedToCart").replace("{name}", product.name));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(hasInWishlist ? t("productDetail.removedFromWishlist") : t("productDetail.addedToWishlist"));
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
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-accent/40 hover:shadow-xl",
        variant === "compact" && "gap-3",
        className
      )}
    >
      {/* Image section */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-muted"
        aria-label={product.name}
      >
        {hasImageUrl ? (
          <img
            src={images[0]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges — top left */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.is_new_arrival && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              {t("productDetail.newBadge")}
            </span>
          )}
          {product.is_best_seller && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
              {t("productDetail.bestsellerBadge")}
            </span>
          )}
          {product.is_flash_sale && (
            <span className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
              <Zap className="h-2.5 w-2.5" />
              {t("flashSale.eyebrow")}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Hover actions — top right */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={handleWishlist}
            aria-label={t("productCard.addToWishlist")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
          >
            <Heart className={cn("h-3.5 w-3.5", hasInWishlist ? "fill-red-500 text-red-500" : "text-foreground")} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            aria-label={t("productCard.quickView")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
          >
            <Eye className="h-3.5 w-3.5 text-foreground" />
          </Link>
        </div>

        {/* Bottom add-to-cart — slides up on hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-accent text-[11px] font-bold uppercase tracking-wider text-accent-foreground shadow-lg transition-all hover:bg-accent/90 active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {t("productCard.addToCart")}
          </button>
        </div>
      </Link>

      {/* Info section */}
      <div className="flex flex-1 flex-col p-3">
        {/* Rating */}
        {rating !== undefined && (
          <div className="mb-1.5 flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-accent text-accent-text" />
            <span className="font-semibold text-foreground">{rating}</span>
            {reviewCount !== undefined && (
              <span className="text-muted-foreground">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors hover:text-accent-text"
        >
          {product.name}
        </Link>

        {/* Colors */}
        {colors && colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="h-3 w-3 rounded-full border border-border/60 ring-1 ring-white/50"
                style={{ backgroundColor: color.hex_value }}
                title={color.name}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] font-medium text-muted-foreground">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-foreground">
            {formatPrice(finalPrice)}
          </span>
          {product.discount_price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-auto rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
