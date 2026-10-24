"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  image: string;
  mobileImage?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  buttonText?: string;
  align?: "left" | "center" | "right";
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  parent_id?: string | null;
}

interface MegaHeroProps {
  slides: HeroSlide[];
  categories: CategoryItem[];
  announcement?: { text: string; enabled: boolean };
}

export function MegaHero({ slides, categories, announcement }: MegaHeroProps) {
  const router = useRouter();
  const [current, setCurrent] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
  const total = slides.length;

  const mainCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id);

  React.useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, [total]);

  const goNext = React.useCallback(() => {
    if (total === 0) return;
    setCurrent((p) => (p + 1) % total);
  }, [total]);
  const goPrev = React.useCallback(() => {
    if (total === 0) return;
    setCurrent((p) => (p - 1 + total) % total);
  }, [total]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
    else router.push("/shop");
  }

  // Auto-search: navigate to /shop?q= after user stops typing for 500ms
  React.useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(() => {
      router.push(`/shop?q=${encodeURIComponent(search.trim())}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, router]);

  // Get sub-categories for the hovered category
  const activeSubs = hoveredCategory
    ? subCategories.filter((s) => s.parent_id === hoveredCategory)
    : [];
  const activeCat = mainCategories.find((c) => c.id === hoveredCategory);

  return (
    <section className="relative bg-white">
      {/* Category bar — horizontal, below header */}
      <div className="relative z-30 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0.5 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1">
            <Link
              href="/shop"
              className="shrink-0 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent hover:text-accent-foreground sm:px-3 sm:text-sm"
            >
              All
            </Link>

            {mainCategories.map((cat) => {
              const subs = subCategories.filter((s) => s.parent_id === cat.id);
              return (
                <div
                  key={cat.id}
                  className="shrink-0"
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/shop/${cat.slug}`}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm",
                      hoveredCategory === cat.id
                        ? "bg-accent text-accent-foreground"
                        : "text-primary hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {cat.name}
                    {subs.length > 0 && (
                      <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dropdown — rendered INSIDE the category bar container (z-30),
            not inside the slider. Uses fixed positioning relative to the
            bar, so it floats above the slider without being clipped. */}
        {activeSubs.length > 0 && activeCat && (
          <div className="pointer-events-auto absolute left-0 top-full z-50 w-full">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <div className="w-fit min-w-[240px] rounded-xl border border-gray-200 bg-white/95 py-2 shadow-2xl backdrop-blur-xl">
                <div className="px-4 py-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {activeCat.name}
                  </p>
                </div>
                {activeSubs.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/shop/${sub.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-accent/20 hover:text-accent"
                  >
                    {sub.image && (
                      <img
                        src={sub.image}
                        alt=""
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    )}
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search bar — mobile only.
          Gap above (pt-4) and below (pb-4) separates it from the
          category bar and slider. */}
      <form onSubmit={handleSearch} className="relative mx-auto max-w-7xl px-4 pt-4 pb-4 sm:px-6 lg:hidden">
        <div className="flex h-14 items-stretch rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="relative flex flex-1 items-stretch">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="h-full w-full border-0 bg-white pl-12 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              aria-label="Search products"
            />
          </div>
          <button
            type="submit"
            className="flex h-full items-center gap-2 bg-primary px-6 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      {/* Slider — z-0 so dropdown (z-50) appears above */}
      <div className="relative z-0 mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden sm:rounded-lg border border-border/60 bg-muted">
          {total === 0 ? (
            <div className="flex aspect-[2/1] items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 text-center text-primary-foreground/70">
              <div>
                <p className="text-sm font-medium">No hero slides yet</p>
                <p className="mt-1 text-xs">Add slides from Admin → Homepage</p>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[2/1]">
              {slides.map((slide, idx) => {
                const slideLink = slide.link || "#";
                return (
                  <Link
                    key={slide.id || idx}
                    href={slideLink}
                    className={cn(
                      "absolute inset-0 block transition-opacity duration-700 ease-in-out",
                      idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <img
                      src={slide.image || slide.mobileImage}
                      alt={slide.title || `Slide ${idx + 1}`}
                      className="h-full w-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                      fetchPriority={idx === 0 ? "high" : "low"}
                      decoding="async"
                    />

                    {(slide.title || slide.subtitle) && (
                      <div
                        className={cn(
                          "absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-10",
                          slide.align === "right" && "items-end text-right",
                          slide.align === "center" && "items-center text-center",
                          (!slide.align || slide.align === "left") && "items-start"
                        )}
                      >
                        {slide.title && (
                          <h2 className="font-serif text-base font-semibold text-white drop-shadow-lg sm:text-xl lg:text-3xl">
                            {slide.title}
                          </h2>
                        )}
                        {slide.subtitle && (
                          <p className="mt-1.5 max-w-md text-xs text-white drop-shadow-md sm:mt-2 sm:text-sm lg:text-base">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.buttonText && (
                          <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90 sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm">
                            {slide.buttonText}
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}

              {total > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-foreground shadow-md transition-all hover:bg-white sm:left-3 sm:p-2"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-foreground shadow-md transition-all hover:bg-white sm:right-3 sm:p-2"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}

              {total > 1 && (
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-3">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all sm:h-2",
                        idx === current
                          ? "w-5 bg-accent sm:w-6"
                          : "w-1.5 bg-white/60 hover:bg-white sm:w-2"
                      )}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
