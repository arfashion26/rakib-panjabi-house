"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  Minus,
  Plus,
  ChevronRight,
  Share2,
  ZoomIn,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart, useWishlist } from "@/lib/store";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscount } from "@/lib/types";
import { toast } from "sonner";

interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
}

interface ProductSize {
  id: string;
  size: string;
  stock: number;
}

interface ProductColor {
  id: string;
  name: string;
  hex_value: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string | null;
  fabric: string | null;
  fit: string | null;
  care: string | null;
  origin: string | null;
  price: number;
  discount_price: number | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  is_flash_sale?: boolean;
  sizes: ProductSize[];
  colors: ProductColor[];
  specifications?: Array<{ key: string; value: string }> | null;
}

interface RelatedProduct {
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
  colors?: { name: string; hex_value: string }[];
  images?: { url: string; is_primary: boolean }[];
  rating?: number;
  review_count?: number;
}

export function ProductDetailContent({
  product,
  images: dbImages,
  reviews,
  relatedProducts,
}: {
  product: Product;
  images: ProductImage[];
  reviews: any[];
  relatedProducts: RelatedProduct[];
}) {
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);

  const addItem = useCart((s) => s.addItem);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const hasInWishlist = useWishlist((s) => s.has(product.id));

  const discount = calculateDiscount(product.price, product.discount_price ?? null);
  const finalPrice = product.discount_price ?? product.price;

  const allImages = React.useMemo(() => {
    const urls: string[] = [];
    if (dbImages && dbImages.length > 0) {
      dbImages.forEach((img) => urls.push(img.url));
    } else if (product.colors && product.colors.length > 0) {
      product.colors.forEach((c) => {
        if (c.hex_value) urls.push(c.hex_value);
      });
    }
    return urls.length > 0 ? urls : ["placeholder"];
  }, [dbImages, product.colors]);

  function handleAddToCart() {
    if (product.sizes.length > 1 && !selectedSize) {
      toast.error(t("productDetail.selectSize"));
      return;
    }
    if (product.colors.length > 1 && !selectedColor) {
      toast.error(t("productDetail.selectColor"));
      return;
    }
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: allImages[0] !== "placeholder" ? allImages[0] : null,
        price: product.price,
        discountPrice: product.discount_price ?? null,
        sku: product.sku,
        selectedSize: selectedSize ?? (product.sizes[0]?.size || null),
        selectedColor: selectedColor ?? (product.colors[0]?.name || null),
      },
      quantity
    );
    toast.success(t("productDetail.addedToCart").replace("{name}", product.name));
  }

  function handleWishlist() {
    toggleWishlist(product.id);
    toast.success(hasInWishlist ? t("productDetail.removedFromWishlist") : t("productDetail.addedToWishlist"));
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("productDetail.shareLinkCopied"));
    }
  }

  const selectedSizeData = product.sizes.find((s) => s.size === selectedSize);
  const selectedColorData = product.colors.find((c) => c.name === selectedColor);
  const isInStock =
    (product.sizes.length === 0 || (selectedSizeData && selectedSizeData.stock > 0)) &&
    (product.colors.length === 0 || (selectedColorData && selectedColorData.stock > 0));

  // Parse specifications (could be array or JSON string)
  const customSpecs: Array<{ key: string; value: string }> = React.useMemo(() => {
    if (!product.specifications) return [];
    if (Array.isArray(product.specifications)) return product.specifications;
    try {
      const parsed = JSON.parse(product.specifications as any);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [product.specifications]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">{t("common.home")}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-accent">{t("common.shop")}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      {/* Main layout — 2 columns on desktop */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* ===== LEFT: Compact Image Gallery ===== */}
        <div className="flex gap-3">
          {/* Thumbnails — vertical strip */}
          {allImages.length > 1 && (
            <div className="flex shrink-0 flex-col gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImageIdx === idx
                      ? "border-accent ring-1 ring-accent/20"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  {img !== "placeholder" && img.startsWith("#") ? (
                    <div className="h-full w-full" style={{ backgroundColor: img }} />
                  ) : img !== "placeholder" ? (
                    <img src={img} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="font-serif text-[10px] font-light text-muted-foreground/40">RPH</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main image — compact aspect ratio */}
          <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-xl border border-border/60 bg-muted">
            {allImages[selectedImageIdx] !== "placeholder" && allImages[selectedImageIdx].startsWith("#") ? (
              <div className="absolute inset-0" style={{ backgroundColor: allImages[selectedImageIdx] }} />
            ) : allImages[selectedImageIdx] !== "placeholder" ? (
              <img
                src={allImages[selectedImageIdx]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-7xl font-light text-muted-foreground/20">RPH</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.is_new_arrival && (
                <Badge className="bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                  {t("productDetail.newBadge")}
                </Badge>
              )}
              {product.is_best_seller && (
                <Badge className="bg-accent px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
                  {t("productDetail.bestsellerBadge")}
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-red-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Product Info ===== */}
        <div className="flex flex-col">
          {/* Title + SKU */}
          {product.is_featured && (
            <span className="mb-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              {t("productDetail.featuredProduct")}
            </span>
          )}
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl lg:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            {t("products.sku")}: {product.sku}
          </p>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm font-medium">{reviews.length > 0 ? "5.0" : "—"}</span>
            <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground md:text-3xl">
              {formatPrice(finalPrice)}
            </span>
            {product.discount_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                {t("productDetail.saveAmount")} {formatPrice(product.price - finalPrice)}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.short_description}
            </p>
          )}

          <Separator className="my-5" />

          {/* Color selection */}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                {t("productDetail.color")}:{" "}
                <span className="text-muted-foreground">{selectedColor ?? t("productDetail.selectPlaceholder")}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                      selectedColor === color.name
                        ? "border-accent ring-2 ring-accent/20"
                        : "border-border hover:border-accent/50"
                    )}
                    title={`${color.name} (${color.stock} in stock)`}
                  >
                    <span className="h-6 w-6 rounded-full" style={{ backgroundColor: color.hex_value }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("productDetail.size")}:{" "}
                  <span className="text-muted-foreground">{selectedSize ?? t("productDetail.selectPlaceholder")}</span>
                </label>
                <Link href="/size-guide" className="text-xs text-accent hover:underline">
                  {t("productDetail.sizeGuide")}
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.size)}
                    disabled={size.stock === 0}
                    className={cn(
                      "relative flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all",
                      size.stock === 0 && "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through",
                      selectedSize === size.size && size.stock > 0 && "border-accent bg-accent/10 text-accent",
                      selectedSize !== size.size && size.stock > 0 && "border-border hover:border-accent hover:text-accent"
                    )}
                  >
                    {size.size}
                    {size.stock === 0 && (
                      <span className="absolute -bottom-4 left-0 right-0 text-center text-[8px] text-red-500">
                        {t("productDetail.outOfStockLabel")}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="mt-5 flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center rounded-lg border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to cart */}
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {isInStock ? t("productDetail.addToCart") : t("productDetail.outOfStock")}
            </Button>

            {/* Wishlist */}
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlist}
              className={cn(hasInWishlist && "border-red-500 text-red-500")}
            >
              <Heart className={cn("h-4 w-4", hasInWishlist && "fill-red-500")} />
            </Button>

            {/* Share */}
            <Button size="lg" variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Buy now */}
          <Button
            size="lg"
            variant="secondary"
            className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => { handleAddToCart(); window.location.href = "/checkout"; }}
            disabled={!isInStock}
          >
            {t("productDetail.buyNow")}
          </Button>

          {/* Trust badges */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck className="h-4 w-4 text-accent" />
              <span className="text-[10px] text-muted-foreground">{t("productDetail.shippingInfo")}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RefreshCw className="h-4 w-4 text-accent" />
              <span className="text-[10px] text-muted-foreground">{t("productDetail.returnsInfo")}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className="text-[10px] text-muted-foreground">{t("productDetail.paymentOptions")}</span>
            </div>
          </div>

          {/* Quick specs */}
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-xs">
            {product.fabric && (
              <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">{t("productDetail.fabric")}:</span>
                <span>{product.fabric}</span>
              </div>
            )}
            {product.fit && (
              <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">{t("productDetail.fit")}:</span>
                <span>{product.fit}</span>
              </div>
            )}
            {product.origin && (
              <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">{t("productDetail.origin")}:</span>
                <span>{product.origin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Tabs Section ===== */}
      <div className="mt-10">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start gap-6 border-b border-border">
            <TabsTrigger value="description">{t("productDetail.description")}</TabsTrigger>
            <TabsTrigger value="specifications">{t("productDetail.specifications")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("productDetail.reviews")} ({reviews.length})</TabsTrigger>
            <TabsTrigger value="shipping">{t("productDetail.shippingReturns")}</TabsTrigger>
          </TabsList>

          {/* Description */}
          <TabsContent value="description" className="mt-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            {product.care && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {t("productDetail.careInstructions")}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">{product.care}</p>
              </div>
            )}
          </TabsContent>

          {/* Specifications — includes custom specs */}
          <TabsContent value="specifications" className="mt-5">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {product.fabric && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-2.5 font-medium">{t("productDetail.fabric")}</td>
                      <td className="px-4 py-2.5">{product.fabric}</td>
                    </tr>
                  )}
                  {product.fit && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-2.5 font-medium">{t("productDetail.fit")}</td>
                      <td className="px-4 py-2.5">{product.fit}</td>
                    </tr>
                  )}
                  {product.care && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-2.5 font-medium">{t("productDetail.care")}</td>
                      <td className="px-4 py-2.5">{product.care}</td>
                    </tr>
                  )}
                  {product.origin && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-2.5 font-medium">{t("productDetail.origin")}</td>
                      <td className="px-4 py-2.5">{product.origin}</td>
                    </tr>
                  )}
                  {/* Custom specifications */}
                  {customSpecs.map((spec, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-2.5 font-medium">{spec.key}</td>
                      <td className="px-4 py-2.5">{spec.value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="bg-muted/50 px-4 py-2.5 font-medium">{t("products.sku")}</td>
                    <td className="px-4 py-2.5">{product.sku}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-5">
            {reviews.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-medium">{t("productDetail.noReviews")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("productDetail.beFirst")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-border/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                          {review.user?.name?.[0] || t("productDetail.anonymous")[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{review.user?.name || t("productDetail.anonymous")}</div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={cn("h-3 w-3", idx < review.rating ? "fill-accent text-accent" : "text-muted-foreground")} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && <h4 className="mt-2 text-sm font-medium">{review.title}</h4>}
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Shipping */}
          <TabsContent value="shipping" className="mt-5">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h4 className="mb-1 font-medium text-foreground">{t("productDetail.shippingInfo")}</h4>
                <p>{t("productDetail.shippingDesc")}</p>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-foreground">{t("productDetail.returnsInfo")}</h4>
                <p>{t("productDetail.returnsDesc")}</p>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-foreground">{t("productDetail.paymentOptions")}</h4>
                <p>{t("productDetail.paymentDesc")}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 text-lg font-bold tracking-tight md:text-xl">
            {t("productDetail.relatedProducts")}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                images={rel.images?.map((img) => img.url) || []}
                colors={rel.colors}
                rating={rel.rating}
                reviewCount={rel.review_count}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
