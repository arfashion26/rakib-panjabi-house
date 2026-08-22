"use client";

import * as React from "react";
import { useParams } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useCart, useWishlist } from "@/lib/store";
import { placeholderProducts } from "@/lib/placeholder-data";
import { formatPrice, calculateDiscount } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = React.useMemo(
    () => placeholderProducts.find((p) => p.slug === slug),
    [slug]
  );

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isZoomed, setIsZoomed] = React.useState(false);

  const addItem = useCart((s) => s.addItem);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const hasInWishlist = useWishlist((s) => (product ? s.has(product.id) : false));

  // Related products (same category)
  const relatedProducts = React.useMemo(() => {
    if (!product) return [];
    return placeholderProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-medium">Product Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.discount_price ?? null);
  const finalPrice = product.discount_price ?? product.price;

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 1 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: null,
      price: product.price,
      discountPrice: product.discount_price ?? null,
      sku: product.sku,
      selectedSize: selectedSize ?? (product.sizes[0] || null),
      selectedColor: selectedColor ?? (product.colors[0]?.name || null),
    }, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(hasInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at Rakib Panjabi House`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-accent">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop/${product.category_name?.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-accent capitalize">
          {product.category_name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          {/* Thumbnails */}
          <div className="flex gap-2 md:flex-col">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "relative h-16 w-16 overflow-hidden rounded-md border-2 transition-all",
                  selectedImage === idx
                    ? "border-accent"
                    : "border-border hover:border-accent/50"
                )}
                style={{ background: `linear-gradient(135deg, ${img}30, ${img}90)` }}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-serif text-xs font-light text-white/40">RPH</span>
                </div>
              </button>
            ))}
          </div>

          {/* Main image */}
          <div
            className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-lg bg-muted"
            onClick={() => setIsZoomed(!isZoomed)}
            style={{
              background: `linear-gradient(135deg, ${product.images[selectedImage]}30, ${product.images[product.images.length - 1]}90)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-9xl font-light text-white/30">
                RPH
              </span>
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.is_new_arrival && (
                <Badge className="w-fit">New</Badge>
              )}
              {product.is_best_seller && (
                <Badge className="w-fit bg-accent text-accent-foreground">Bestseller</Badge>
              )}
              {discount > 0 && (
                <Badge className="w-fit bg-red-500">-{discount}%</Badge>
              )}
            </div>

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <ZoomIn className="h-3.5 w-3.5" />
              {isZoomed ? "Click to zoom out" : "Click to zoom"}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div>
          {/* Brand & rating */}
          <div className="mb-2 flex items-center justify-between">
            {product.brand_name && (
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                {product.brand_name}
              </span>
            )}
            {product.rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.review_count} reviews)</span>
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="font-serif text-2xl font-medium leading-tight tracking-tight md:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          {/* SKU */}
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
            SKU: {product.sku}
          </p>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-2xl font-medium md:text-3xl">
              {formatPrice(finalPrice)}
            </span>
            {product.discount_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                Save {formatPrice(product.price - finalPrice)}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="mt-4 text-base text-muted-foreground">
              {product.short_description}
            </p>
          )}

          <Separator className="my-6" />

          {/* Color selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">
                  Color: <span className="text-muted-foreground">{selectedColor ?? "Select"}</span>
                </label>
              </div>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                      selectedColor === color.name
                        ? "border-accent ring-2 ring-accent/20"
                        : "border-border hover:border-accent/50"
                    )}
                    title={color.name}
                  >
                    <span
                      className="h-7 w-7 rounded-full"
                      style={{ backgroundColor: color.hex_value }}
                    />
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
                  Size: <span className="text-muted-foreground">{selectedSize ?? "Select"}</span>
                </label>
                <Link
                  href="/size-guide"
                  className="text-xs text-accent hover:underline"
                >
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "flex h-11 min-w-11 items-center justify-center rounded-md border px-3 text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-accent hover:text-accent"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-base font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlist}
              className={cn(hasInWishlist && "border-red-500 text-red-500")}
            >
              <Heart className={cn("h-5 w-5", hasInWishlist && "fill-red-500")} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Buy Now button */}
          <Button
            size="lg"
            variant="secondary"
            className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              handleAddToCart();
              window.location.href = "/checkout";
            }}
          >
            Buy Now
          </Button>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="h-5 w-5 text-accent" />
              <span className="text-xs text-muted-foreground">Free Shipping<br />Over ৳2000</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="h-5 w-5 text-accent" />
              <span className="text-xs text-muted-foreground">7-Day<br />Easy Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span className="text-xs text-muted-foreground">100% Secure<br />Payment</span>
            </div>
          </div>

          {/* Product meta */}
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-xs">
            {product.fabric && (
              <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">Fabric:</span>
                <span>{product.fabric}</span>
              </div>
            )}
            {product.fit && (
              <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">Fit:</span>
                <span>{product.fit}</span>
              </div>
            )}
            {product.origin && (
              <div className="flex gap-2">
                <span className="font-medium text-muted-foreground">Origin:</span>
                <span>{product.origin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Reviews */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start gap-6 border-b border-border">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.review_count})
            </TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              {product.care && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Care Instructions
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">{product.care}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {product.fabric && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-3 font-medium">Fabric</td>
                      <td className="px-4 py-3">{product.fabric}</td>
                    </tr>
                  )}
                  {product.fit && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-3 font-medium">Fit</td>
                      <td className="px-4 py-3">{product.fit}</td>
                    </tr>
                  )}
                  {product.care && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-3 font-medium">Care</td>
                      <td className="px-4 py-3">{product.care}</td>
                    </tr>
                  )}
                  {product.origin && (
                    <tr className="border-b border-border">
                      <td className="bg-muted/50 px-4 py-3 font-medium">Origin</td>
                      <td className="px-4 py-3">{product.origin}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="bg-muted/50 px-4 py-3 font-medium">SKU</td>
                    <td className="px-4 py-3">{product.sku}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Rating summary */}
              <div className="flex flex-col gap-6 rounded-lg bg-muted/30 p-6 md:flex-row md:items-center">
                <div className="text-center md:text-left">
                  <div className="font-serif text-5xl font-medium text-accent">
                    {product.rating}
                  </div>
                  <div className="mt-2 flex justify-center gap-0.5 md:justify-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(product.rating ?? 0)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Based on {product.review_count} reviews
                  </p>
                </div>
                <Separator orientation="vertical" className="hidden md:block" />
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const percent =
                      star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 1 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="flex w-8 items-center gap-0.5">
                          {star}
                          <Star className="h-3 w-3 fill-accent text-accent" />
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-accent"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-muted-foreground">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample reviews */}
              <div className="space-y-4">
                {[
                  {
                    name: "Tanvir Ahmed",
                    rating: 5,
                    date: "2 weeks ago",
                    text: "Excellent quality! The fabric is premium and the fit is perfect. Highly recommend.",
                  },
                  {
                    name: "Rakibul Hasan",
                    rating: 5,
                    date: "1 month ago",
                    text: "Better than expected. Fast delivery and great packaging. Will buy again.",
                  },
                  {
                    name: "Imran Khan",
                    rating: 4,
                    date: "1 month ago",
                    text: "Good product overall. The material is nice, though I wish there were more color options.",
                  },
                ].map((review, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                          {review.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{review.name}</div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={cn(
                                  "h-3 w-3",
                                  idx < review.rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="mb-1 font-medium text-foreground">Shipping</h4>
                <p>
                  We offer free shipping on all orders over ৳2000 within Bangladesh.
                  Standard delivery takes 2-5 business days inside Dhaka and 3-7 days
                  outside Dhaka. Express delivery available at checkout.
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-foreground">Returns & Exchanges</h4>
                <p>
                  Easy 7-day return policy. If you&apos;re not satisfied with your purchase,
                  return it within 7 days for a full refund or exchange. Items must be
                  unworn, unwashed, and with original tags.
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-foreground">Payment Options</h4>
                <p>
                  We accept SSLCommerz, bKash, Nagad, Rocket, Visa/Mastercard via Stripe,
                  and Cash on Delivery (COD) across Bangladesh.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      <div className="mt-16">
        <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight md:text-3xl">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-6">
          {relatedProducts.map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              images={rel.images}
              colors={rel.colors}
              rating={rel.rating}
              reviewCount={rel.review_count}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
