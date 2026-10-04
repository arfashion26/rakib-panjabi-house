"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
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
}

interface MegaHeroProps {
  slides: HeroSlide[];
  categories: CategoryItem[];
  announcement?: { text: string; enabled: boolean };
}

/**
 * Mega Hero Section — fully mobile responsive.
 *
 * Layout:
 *   ┌───────────────────────────────────────────────┐
 *   │            [ Search bar (full width) ]        │
 *   ├──────────────┬────────────────────────────────┤
 *   │  Categories  │     Image Slider               │
 *   │  (vertical)  │     (auto-rotating)            │
 *   │              │                                 │
 *   └──────────────┴────────────────────────────────┘
 *
 * Mobile:
 *   - Search bar at top (compact)
 *   - Slider fills remaining viewport (uses desktop image at full size)
 *   - Category chips below slider (horizontal scroll)
 *
 * Desktop (lg+):
 *   - Same search bar (bigger)
 *   - Left sidebar with categories (vertical list)
 *   - Right slider (fills remaining height)
 */
export function MegaHero({ slides, categories, announcement }: MegaHeroProps) {
  const router = useRouter();
  const [current, setCurrent] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const total = slides.length;

  // Auto-rotate slides every 5s
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

  // Limit to 8 categories for clean layout
  const visibleCategories = categories.slice(0, 8);

  return (
    <section className="relative bg-background">
      {/* Hero takes full viewport height (minus header offset).
          Announcement bar is now in the site header, so we don't
          duplicate it here. */}
      <div className="mx-auto flex max-w-7xl flex-col px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 min-h-[calc(100vh-11rem)] lg:min-h-[calc(100vh-13rem)]">
        {/* Search bar — mobile/tablet only. Desktop header already has
            its own big search bar, so we hide this on lg+ to avoid
            duplication. */}
        <form onSubmit={handleSearch} className="relative mb-3 sm:mb-4 lg:hidden">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for panjabis, shirts, pants, accessories..."
            className="h-11 sm:h-12 w-full rounded-full border border-border bg-background pl-11 pr-24 text-sm text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:pr-28 sm:text-base"
            aria-label="Search products"
          />
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 sm:px-6 sm:py-2 sm:text-sm"
          >
            Search
          </button>
        </form>

        {/* 2-column layout: categories (left, desktop only) + slider (right).
            On mobile, only the slider shows (categories become chips below). */}
        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[280px_1fr]">
          {/* Categories sidebar — hidden on mobile, shown on lg+.
              h-full so it stretches to match the slider's height. */}
          <aside className="hidden lg:block">
            <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-background">
              <div className="border-b border-border bg-muted/30 px-4 py-2.5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  All Categories
                </h2>
              </div>
              <ul className="flex-1 overflow-y-auto">
                {visibleCategories.length === 0 ? (
                  <li className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No categories yet
                  </li>
                ) : (
                  visibleCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/shop/${cat.slug}`}
                        className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent/10"
                      >
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-9 w-9 shrink-0 rounded-md object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                            {cat.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="flex-1 text-sm font-medium text-foreground group-hover:text-accent-text">
                          {cat.name}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent-text" />
                      </Link>
                    </li>
                  ))
                )}
              </ul>
              {categories.length > 8 && (
                <Link
                  href="/shop"
                  className="block border-t border-border bg-muted/20 px-4 py-2 text-center text-xs font-medium text-accent-text hover:bg-accent/10"
                >
                  View All Categories →
                </Link>
              )}
            </div>
          </aside>

          {/* Slider — fixed 2:1 aspect ratio on ALL devices.
              Admin uploads a 1600×800px image → it shows identically
              on desktop, tablet, and mobile. No cropping, no black bg. */}
          <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted">
            {/* Slides */}
            {total === 0 ? (
              <div className="flex aspect-[2/1] items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 text-center text-primary-foreground/70">
                <div>
                  <p className="text-sm font-medium">No hero slides yet</p>
                  <p className="mt-1 text-xs">Add slides from Admin → Homepage</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[2/1]">
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700 ease-in-out",
                      idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    {/* Single image, object-cover on 2:1 container.
                        Same size on all devices — no cropping if the
                        uploaded image matches 2:1 ratio. */}
                    <img
                      src={slide.image || slide.mobileImage}
                      alt={slide.title || `Slide ${idx + 1}`}
                      className="h-full w-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                      fetchPriority={idx === 0 ? "high" : "low"}
                      decoding="async"
                    />

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />

                    {/* Slide text + CTA */}
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
                          <h2 className="font-serif text-base font-semibold text-white sm:text-xl lg:text-3xl">
                            {slide.title}
                          </h2>
                        )}
                        {slide.subtitle && (
                          <p className="mt-1.5 max-w-md text-xs text-white/80 sm:mt-2 sm:text-sm lg:text-base">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.link && slide.buttonText && (
                          <Link
                            href={slide.link}
                            className="mt-3 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm"
                          >
                            {slide.buttonText}
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Arrow controls — visible on all screen sizes.
                    Smaller on mobile, larger on desktop. */}
                {total > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-md transition-all hover:bg-background sm:left-3 sm:p-2"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-md transition-all hover:bg-background sm:right-3 sm:p-2"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </>
                )}

                {/* Dot indicators */}
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

        {/* Mobile category chips — visible only on mobile (replaces sidebar).
            Horizontal scroll for compact display. */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:bg-accent/10"
            >
              {cat.image && (
                <img
                  src={cat.image}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover"
                  loading="lazy"
                />
              )}
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
