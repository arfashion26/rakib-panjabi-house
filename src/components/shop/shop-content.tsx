"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/i18n/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";

const ALL_COLORS = [
  { name: "Black", value: "#1A1A1F" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#1A237E" },
  { name: "Maroon", value: "#800020" },
  { name: "Olive", value: "#556B2F" },
  { name: "Brown", value: "#8B6F47" },
  { name: "Sand", value: "#D2B48C" },
  { name: "Grey", value: "#8B8B8B" },
  { name: "Emerald", value: "#0F5132" },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "38", "40", "42", "44", "46", "30", "32", "34", "36"];

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
  category_id: string;
  sizes?: { size: string; stock: number }[];
  colors?: { name: string; hex_value: string }[];
  images?: { url: string; is_primary: boolean }[];
  rating?: number;
  review_count?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ShopContent({
  products,
  categories,
  total,
  searchParams,
}: {
  products: Product[];
  categories: Category[];
  total: number;
  searchParams: { q?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string };
}) {
  const router = useRouter();
  const search = searchParams.q || "";
  const categoryParam = searchParams.category || "";
  const sortParam = searchParams.sort || "newest";
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const { t } = useLanguage();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.sort) params.set("sort", searchParams.sort);
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/shop");
  }

  const activeFilters: { label: string; param: string }[] = [];
  if (search) activeFilters.push({ label: `${t("shop.searchLabel")}: "${search}"`, param: "q" });
  if (categoryParam) {
    const cat = categories.find((c) => c.slug === categoryParam);
    activeFilters.push({ label: `${t("shop.categoryLabel")}: ${cat?.name || categoryParam}`, param: "category" });
  }
  if (minPrice) activeFilters.push({ label: `${t("shop.minPlaceholder")}: ৳${minPrice}`, param: "minPrice" });
  if (maxPrice) activeFilters.push({ label: `${t("shop.maxPlaceholder")}: ৳${maxPrice}`, param: "maxPrice" });

  const FilterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          {t("products.categories")}
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParam("category", "")}
            className={cn(
              "block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
              !categoryParam ? "bg-accent/10 font-medium text-accent" : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
            )}
          >
            {t("products.allCategories")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.slug)}
              className={cn(
                "block w-full rounded-md px-3 py-1.5 text-left text-sm capitalize transition-colors",
                categoryParam === cat.slug ? "bg-accent/10 font-medium text-accent" : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          {t("products.priceRange")}
        </h3>
        <div className="flex items-center gap-2">
          <Input type="number" placeholder={t("shop.minPlaceholder")} defaultValue={minPrice || ""} onBlur={(e) => updateParam("minPrice", e.target.value)} className="h-9" />
          <span className="text-muted-foreground">—</span>
          <Input type="number" placeholder={t("shop.maxPlaceholder")} defaultValue={maxPrice || ""} onBlur={(e) => updateParam("maxPrice", e.target.value)} className="h-9" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t("products.colors")}</h3>
        <div className="grid grid-cols-5 gap-2">
          {ALL_COLORS.map((color) => (
            <button key={color.name} title={color.name} className="h-8 w-8 rounded-full border-2 border-border transition-all hover:scale-110 hover:border-accent" style={{ backgroundColor: color.value }} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t("products.sizes")}</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button key={size} className="flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent">
              {size}
            </button>
          ))}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          {t("products.clearFilters")}
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <nav className="mb-2 text-xs text-muted-foreground">
          <span>{t("common.home")}</span>
          <span className="mx-1">/</span>
          <span className="text-foreground">{t("common.shop")}</span>
        </nav>
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          {search ? `${t("shop.searchLabel")}: "${search}"` : t("shop.allProducts")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total} {total === 1 ? t("products.product") : t("products.products")}
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32">{FilterContent}</div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {t("products.filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t("products.filters")}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{FilterContent}</div>
              </SheetContent>
            </Sheet>

            <div className="flex flex-1 flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter.param} variant="secondary" className="gap-1">
                  {filter.label}
                  <button onClick={() => updateParam(filter.param, "")} className="ml-1 rounded-full hover:bg-accent/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <Select defaultValue={sortParam} onValueChange={(v) => updateParam("sort", v)}>
              <SelectTrigger size="sm" className="w-[160px]">
                <SelectValue placeholder={t("products.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("products.sortNewest")}</SelectItem>
                <SelectItem value="popular">{t("products.sortPopular")}</SelectItem>
                <SelectItem value="rating">{t("products.sortRating")}</SelectItem>
                <SelectItem value="price_asc">{t("products.sortPriceAsc")}</SelectItem>
                <SelectItem value="price_desc">{t("products.sortPriceDesc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">{t("shop.noProducts")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search || categoryParam || minPrice || maxPrice
                  ? t("shop.noProductsDesc")
                  : t("shop.noProductsYet")}
              </p>
              {(search || categoryParam || minPrice || maxPrice) && (
                <Button onClick={clearFilters} className="mt-4" variant="outline">
                  {t("shop.clearFilters")}
                </Button>
              )}
              {!search && !categoryParam && !minPrice && !maxPrice && (
                <Button asChild className="mt-4">
                  <Link href="/admin/products">
                    {t("shop.addProducts")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6">
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
          )}
        </div>
      </div>
    </div>
  );
}
