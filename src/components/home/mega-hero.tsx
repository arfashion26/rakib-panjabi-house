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
 * Mega Hero Section
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
 * - Search bar at top, full width, with gold accent
 * - Left: vertical list of categories (max 8 visible), each linking to /shop/[slug]
 * - Right: image slider with auto-rotate, arrows, and dots
 *   - Fixed aspect ratio (16:9 on desktop, 4:5 portrait on mobile)
 *   - CTA button on each slide
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

  const activeSlide = total > 0 ? slides[current] : null;
  // Limit to 8 categories for clean layout
  const visibleCategories = categories.slice(0, 8);

  return (
    <section className="relative bg-background">
      {/* Announcement bar (optional, hidden if disabled or empty) */}
      {announcement?.enabled && announcement.text && (
        <div className="bg-accent text-accent-foreground">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-9 items-center justify-center text-center text-xs">
              <span className="font-medium tracking-wide">{announcement.text}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Search bar — full width, prominent */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for panjabis, shirts, pants, accessories..."
            className="h-12 sm:h-14 w-full rounded-full border border-border bg-background pl-12 pr-28 text-sm shadow-sm transition-shadow focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:text-base"
            aria-label="Search products"
          />
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 sm:px-6 sm:text-sm"
          >
            Search
          </button>
        </form>

        {/* 2-column layout: categories (left) + slider (right) */}
        <div className="grid gap-3 lg:grid-cols-[260px_1fr]">
          {/* Categories sidebar — hidden on mobile, shown on lg+ */}
          <aside className="hidden lg:block">
            <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
              <div className="border-b border-border bg-muted/30 px-4 py-2.5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  All Categories
                </h2>
              </div>
              <ul>
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

          {/* Slider — fixed aspect ratio */}
          <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted">
            {/* Slides */}
            {total === 0 ? (
              <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 text-center text-primary-foreground/70">
                <div>
                  <p className="text-sm font-medium">No hero slides yet</p>
                  <p className="mt-1 text-xs">Add slides from Admin → Homepage</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/9] sm:aspect-[16/8] lg:aspect-[16/7]">
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700 ease-in-out",
                      idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    {slide.image ? (
                      <img
                        src={slide.image}
                        alt={slide.title || `Slide ${idx + 1}`}
                        className="h-full w-full object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchPriority={idx === 0 ? "high" : "low"}
                        decoding="async"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary via-primary to-primary/80" />
                    )}

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />

                    {/* Slide text + CTA */}
                    {(slide.title || slide.subtitle) && (
                      <div
                        className={cn(
                          "absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10",
                          slide.align === "right" && "items-end text-right",
                          slide.align === "center" && "items-center text-center",
                          (!slide.align || slide.align === "left") && "items-start"
                        )}
                      >
                        {slide.title && (
                          <h2 className="font-serif text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
                            {slide.title}
                          </h2>
                        )}
                        {slide.subtitle && (
                          <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.link && slide.buttonText && (
                          <Link
                            href={slide.link}
                            className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 sm:text-sm"
                          >
                            {slide.buttonText}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Arrow controls (desktop only) */}
                {total > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md transition-all hover:bg-background sm:block"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md transition-all hover:bg-background sm:block"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {total > 1 && (
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          idx === current
                            ? "w-6 bg-accent"
                            : "w-2 bg-white/60 hover:bg-white"
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

        {/* Mobile category chips — visible only on mobile (replaces sidebar) */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:hidden">
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
