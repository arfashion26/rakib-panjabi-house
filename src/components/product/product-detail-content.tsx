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
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);

  const addItem = useCart((s) => s.addItem);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const hasInWishlist = useWishlist((s) => s.has(product.id));

  const discount = calculateDiscount(product.price, product.discount_price ?? null);
  const finalPrice = product.discount_price ?? product.price;

  // Collect all image URLs (DB images + color images)
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

  // Check stock for selected size/color
  const selectedSizeData = product.sizes.find((s) => s.size === selectedSize);
  const selectedColorData = product.colors.find((c) => c.name === selectedColor);
  const isInStock =
    (product.sizes.length === 0 || (selectedSizeData && selectedSizeData.stock > 0)) &&
    (product.colors.length === 0 || (selectedColorData && selectedColorData.stock > 0));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">{t("common.home")}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-accent">{t("common.shop")}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          {allImages.length > 1 && (
            <div className="flex gap-2 md:flex-col">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-md border-2 transition-all",
                    selectedImageIdx === idx ? "border-accent" : "border-border hover:border-accent/50"
                  )}
                >
                  {img !== "placeholder" && img.startsWith("#") ? (
                    <div className="h-full w-full" style={{ backgroundColor: img }} />
                  ) : img !== "placeholder" ? (
                    <img src={img} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="font-serif text-xs font-light text-muted-foreground/40">RPH</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div
            className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-lg bg-muted"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {allImages[selectedImageIdx] !== "placeholder" && allImages[selectedImageIdx].startsWith("#") ? (
              <div className="absolute inset-0" style={{ backgroundColor: allImages[selectedImageIdx] }} />
            ) : allImages[selectedImageIdx] !== "placeholder" ? (
              <img src={allImages[selectedImageIdx]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-9xl font-light text-muted-foreground/30">RPH</span>
              </div>
            )}

            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.is_new_arrival && <Badge>{t("productDetail.newBadge")}</Badge>}
              {product.is_best_seller && <Badge className="bg-accent text-accent-foreground">{t("productDetail.bestsellerBadge")}</Badge>}
              {discount > 0 && <Badge className="bg-red-500">-{discount}%</Badge>}
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <ZoomIn className="h-3.5 w-3.5" />
              {isZoomed ? t("productDetail.clickZoomOut") : t("productDetail.clickZoom")}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div>
          {product.is_featured && (
            <span className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">{t("productDetail.featuredProduct")}</span>
          )}
          <h1 className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
            {t("products.sku")}: {product.sku}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-2xl font-medium md:text-3xl">{formatPrice(finalPrice)}</span>
            {product.discount_price && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                {t("productDetail.saveAmount")} {formatPrice(product.price - finalPrice)}
              </span>
            )}
          </div>

          {product.short_description && (
            <p className="mt-4 text-base text-muted-foreground">{product.short_description}</p>
          )}

          <Separator className="my-6" />

          {/* Color selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                {t("productDetail.color")}: <span className="text-muted-foreground">{selectedColor ?? t("productDetail.selectPlaceholder")}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                      selectedColor === color.name ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                    )}
                    title={`${color.name} (${color.stock} in stock)`}
                  >
                    <span className="h-7 w-7 rounded-full" style={{ backgroundColor: color.hex_value }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("productDetail.size")}: <span className="text-muted-foreground">{selectedSize ?? t("productDetail.selectPlaceholder")}</span>
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
                      "relative flex h-11 min-w-11 items-center justify-center rounded-md border px-3 text-sm font-medium transition-all",
                      size.stock === 0 && "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through",
                      selectedSize === size.size && size.stock > 0 && "border-accent bg-accent/10 text-accent",
                      selectedSize !== size.size && size.stock > 0 && "border-border hover:border-accent hover:text-accent"
                    )}
                  >
                    {size.size}
                    {size.stock === 0 && (
                      <span className="absolute -bottom-4 left-0 right-0 text-center text-[9px] text-red-500">{t("productDetail.outOfStockLabel")}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">{t("productDetail.quantity")}</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-base font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!isInStock}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isInStock ? t("productDetail.addToCart") : t("productDetail.outOfStock")}
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist} className={cn(hasInWishlist && "border-red-500 text-red-500")}>
              <Heart className={cn("h-5 w-5", hasInWishlist && "fill-red-500")} />
            </Button>
            <Button size="lg" variant="outline" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Button size="lg" variant="secondary" className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => { handleAddToCart(); window.location.href = "/checkout"; }}
            disabled={!isInStock}
          >
            {t("productDetail.buyNow")}
          </Button>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="h-5 w-5 text-accent" />
              <span className="text-xs text-muted-foreground">{t("productDetail.freeShippingBadge")}<br />{t("productDetail.freeShippingBadgeDesc")}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="h-5 w-5 text-accent" />
              <span className="text-xs text-muted-foreground">{t("productDetail.returnsBadge")}<br />{t("productDetail.returnsBadgeDesc")}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span className="text-xs text-muted-foreground">{t("productDetail.securePaymentBadge")}<br />{t("productDetail.securePaymentBadgeDesc")}</span>
            </div>
          </div>

          {/* Product meta */}
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-xs">
            {product.fabric && <div className="flex gap-2"><span className="font-medium text-muted-foreground">{t("productDetail.fabric")}:</span><span>{product.fabric}</span></div>}
            {product.fit && <div className="flex gap-2"><span className="font-medium text-muted-foreground">{t("productDetail.fit")}:</span><span>{product.fit}</span></div>}
            {product.origin && <div className="flex gap-2"><span className="font-medium text-muted-foreground">{t("productDetail.origin")}:</span><span>{product.origin}</span></div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start gap-6 border-b border-border">
            <TabsTrigger value="description">{t("productDetail.description")}</TabsTrigger>
            <TabsTrigger value="specifications">{t("productDetail.specifications")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("productDetail.reviews")} ({reviews.length})</TabsTrigger>
            <TabsTrigger value="shipping">{t("productDetail.shippingReturns")}</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>
            {product.care && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("productDetail.careInstructions")}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{product.care}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {product.fabric && <tr className="border-b border-border"><td className="bg-muted/50 px-4 py-3 font-medium">{t("productDetail.fabric")}</td><td className="px-4 py-3">{product.fabric}</td></tr>}
                  {product.fit && <tr className="border-b border-border"><td className="bg-muted/50 px-4 py-3 font-medium">{t("productDetail.fit")}</td><td className="px-4 py-3">{product.fit}</td></tr>}
                  {product.care && <tr className="border-b border-border"><td className="bg-muted/50 px-4 py-3 font-medium">{t("productDetail.care")}</td><td className="px-4 py-3">{product.care}</td></tr>}
                  {product.origin && <tr className="border-b border-border"><td className="bg-muted/50 px-4 py-3 font-medium">{t("productDetail.origin")}</td><td className="px-4 py-3">{product.origin}</td></tr>}
                  <tr><td className="bg-muted/50 px-4 py-3 font-medium">{t("products.sku")}</td><td className="px-4 py-3">{product.sku}</td></tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {reviews.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium">{t("productDetail.noReviews")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("productDetail.beFirst")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-border/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                          {review.user?.name?.[0] || "U"}
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
                      <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    {review.title && <h4 className="mt-3 text-sm font-medium">{review.title}</h4>}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-4 text-sm text-muted-foreground">
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
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight md:text-3xl">
            {t("productDetail.relatedProducts")}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-6">
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
