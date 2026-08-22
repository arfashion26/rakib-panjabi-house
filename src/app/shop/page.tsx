"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/product/product-card";
import { placeholderProducts } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = [
  "panjabi-collection",
  "shirts",
  "t-shirts",
  "polo-shirts",
  "jeans",
  "pants",
  "trousers",
  "blazers",
  "waistcoats",
  "hoodies",
  "jackets",
  "punjabi-pajama",
  "sherwani",
  "kids-collection",
  "women-collection",
  "accessories",
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "30", "32", "34", "36", "38", "40", "42", "44", "46"];
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

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  // Filter products
  const filteredProducts = React.useMemo(() => {
    let result = [...placeholderProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.search_keywords?.toLowerCase().includes(q)
      );
    }

    if (categoryParam) {
      result = result.filter((p) => {
        const cat = ALL_CATEGORIES.find((c) => c === categoryParam);
        return cat && p.category_name?.toLowerCase().includes(cat.split("-")[0]);
      });
    }

    if (minPrice) {
      const min = Number(minPrice);
      result = result.filter((p) => (p.discount_price ?? p.price) >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      result = result.filter((p) => (p.discount_price ?? p.price) <= max);
    }

    // Sort
    switch (sortParam) {
      case "price_asc":
        result.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
        break;
      case "price_desc":
        result.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
        break;
      case "popular":
        result.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [search, categoryParam, minPrice, maxPrice, sortParam]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/shop");
  }

  const activeFilters: { label: string; param: string }[] = [];
  if (search) activeFilters.push({ label: `Search: "${search}"`, param: "q" });
  if (categoryParam) activeFilters.push({ label: `Category: ${categoryParam}`, param: "category" });
  if (minPrice) activeFilters.push({ label: `Min: ৳${minPrice}`, param: "minPrice" });
  if (maxPrice) activeFilters.push({ label: `Max: ৳${maxPrice}`, param: "maxPrice" });

  const FilterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          Categories
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParam("category", "")}
            className={cn(
              "block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
              !categoryParam
                ? "bg-accent/10 font-medium text-accent"
                : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
            )}
          >
            All Categories
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam("category", cat)}
              className={cn(
                "block w-full rounded-md px-3 py-1.5 text-left text-sm capitalize transition-colors",
                categoryParam === cat
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
              )}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => updateParam("minPrice", e.target.value)}
            className="h-9"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
            className="h-9"
          />
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            { label: "Under ৳1000", min: "", max: "1000" },
            { label: "৳1000 - ৳2000", min: "1000", max: "2000" },
            { label: "৳2000 - ৳5000", min: "2000", max: "5000" },
            { label: "Above ৳5000", min: "5000", max: "" },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                updateParam("minPrice", range.min);
                updateParam("maxPrice", range.max);
              }}
              className="block w-full rounded-md px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/5 hover:text-foreground"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          Colors
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {ALL_COLORS.map((color) => (
            <button
              key={color.name}
              title={color.name}
              className="h-8 w-8 rounded-full border-2 border-border transition-all hover:scale-110 hover:border-accent"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          Sizes
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              className="flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear button */}
      {activeFilters.length > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <nav className="mb-2 text-xs text-muted-foreground">
          <span>Home</span>
          <span className="mx-1">/</span>
          <span className="text-foreground">Shop</span>
        </nav>
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          {search ? `Search: "${search}"` : "All Products"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32">
            {FilterContent}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
            {/* Mobile filter trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {FilterContent}
                </div>
              </SheetContent>
            </Sheet>

            {/* Active filters */}
            <div className="flex flex-1 flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter.param} variant="secondary" className="gap-1">
                  {filter.label}
                  <button
                    onClick={() => updateParam(filter.param, "")}
                    className="ml-1 rounded-full hover:bg-accent/20"
                    aria-label="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Sort */}
            <Select value={sortParam} onValueChange={(v) => updateParam("sort", v)}>
              <SelectTrigger size="sm" className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters} className="mt-4" variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  images={product.images}
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

export default function ShopPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <ShopContent />
    </React.Suspense>
  );
}
